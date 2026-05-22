import { useState } from "react";
import { useLocation } from "react-router-dom";
import { z } from "zod";
import { MessageCircle, ArrowRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

const WHATSAPP_URL = "https://api.whatsapp.com/send?phone=5581981771177&text=Ol%C3%A1%2C%20vim%20do%20site%20e%20desejo%20atendimento!";
const WEBHOOK_URL = "https://leaomarketeria.app.n8n.cloud/webhook/health-safety-pipedrive";
const WEBHOOK_URL_2 = "https://hook.us1.make.com/wavi6o7x17us7vpf6veyyvxy2s9l4l9g";
const WEBHOOK_URL_2_EMAIL = "https://hook.us1.make.com/h28hladtzaiu9h3bevc7uq3tw0pjg7km";

const SETORES = [
  "Indústria (manufatura em geral)",
  "Indústrias de Transformação",
  "Alimentos e Bebidas",
  "Frigoríficos",
  "Agroindústria / Agronegócio",
  "Processadoras de Grãos",
  "Usinas de Açúcar / Etanol",
  "Componentes Automotivos",
  "Logística e Transporte",
  "Construção Civil",
  "Mineração",
  "Óleo e Gás / Energia",
  "Química / Petroquímica",
  "Papel e Celulose",
  "Metalurgia / Siderurgia",
  "Portos e Terminais",
  "Saneamento / Utilidades Públicas",
  "Serviços Industriais / Facilities",
  "Cooperativas / Associações Produtivas",
  "Outros",
];

const step1Schema = z.object({
  nome: z.string().trim().min(1, "Informe seu nome").max(100),
  email: z.string().trim().email("E-mail inválido").max(255),
});

const step2Schema = z.object({
  whatsapp: z.string().trim().min(10, "WhatsApp inválido").max(20),
  empresa: z.string().trim().min(1, "Informe o nome da empresa").max(100),
  setor: z.string().min(1, "Selecione um setor"),
});

interface WhatsAppLeadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const WhatsAppLeadDialog = ({ open, onOpenChange }: WhatsAppLeadDialogProps) => {
  const location = useLocation();
  const isEmailRoute = location.pathname === "/email";
  const makeWebhookUrl = isEmailRoute ? WEBHOOK_URL_2_EMAIL : WEBHOOK_URL_2;
  const source = isEmailRoute ? "email" : "google";
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState({
    nome: "",
    email: "",
    whatsapp: "",
    empresa: "",
    setor: "",
  });

  const formatWhatsApp = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 11);
    if (digits.length <= 2) return digits.length ? `(${digits}` : "";
    if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  };

  const update = (field: string, value: string) => {
    const formatted = field === "whatsapp" ? formatWhatsApp(value) : value;
    setForm((prev) => ({ ...prev, [field]: formatted }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleNext = () => {
    const result = step1Schema.safeParse({ nome: form.nome, email: form.email });
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((e) => {
        fieldErrors[e.path[0] as string] = e.message;
      });
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    setStep(2);
  };

  const handleSubmit = async () => {
    const result = step2Schema.safeParse({
      whatsapp: form.whatsapp,
      empresa: form.empresa,
      setor: form.setor,
    });
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((e) => {
        fieldErrors[e.path[0] as string] = e.message;
      });
      setErrors(fieldErrors);
      return;
    }

    // Push conversion event to GTM dataLayer
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: "form-submit",
      formData: {
        nome: form.nome,
        email: form.email,
        whatsapp: form.whatsapp,
        empresa: form.empresa,
        setor: form.setor,
      },
    });

    // Extract UTM parameters from URL
    const urlParams = new URLSearchParams(window.location.search);

    // Send data to webhooks (fire-and-forget)
    const basePayload = {
      nome: form.nome,
      email: form.email,
      whatsapp: form.whatsapp,
      empresa: form.empresa,
      setor: form.setor,
      origem: window.location.href,
      utm_source: urlParams.get("utm_source") || "",
      utm_medium: urlParams.get("utm_medium") || "",
      utm_campaign: urlParams.get("utm_campaign") || "",
      timestamp: new Date().toISOString(),
    };
    const n8nPayload = JSON.stringify({ ...basePayload, source });
    const makePayload = JSON.stringify(basePayload);
    const headers = { "Content-Type": "application/json" };
    try { fetch(WEBHOOK_URL, { method: "POST", headers, body: n8nPayload }); } catch {}
    try { fetch(makeWebhookUrl, { method: "POST", headers, body: makePayload }); } catch {}

    window.open(WHATSAPP_URL, "_blank", "noopener,noreferrer");
    onOpenChange(false);
    setStep(1);
    setForm({ nome: "", email: "", whatsapp: "", empresa: "", setor: "" });
    setErrors({});
  };

  const handleClose = (value: boolean) => {
    onOpenChange(value);
    if (!value) {
      setStep(1);
      setErrors({});
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-heading font-extrabold text-xl text-foreground">
            {step === 1 ? "Fale com um especialista" : "Quase lá!"}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {step === 1
              ? "Preencha seus dados para iniciar a conversa no WhatsApp."
              : "Informe os dados da sua empresa para personalizar o atendimento."}
          </DialogDescription>
        </DialogHeader>

        {/* Step indicator */}
        <div className="flex gap-2 mb-2">
          <div className={`h-1 flex-1 rounded-full ${step >= 1 ? "bg-accent" : "bg-border"}`} />
          <div className={`h-1 flex-1 rounded-full ${step >= 2 ? "bg-accent" : "bg-border"}`} />
        </div>

        {step === 1 ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nome" className="font-heading font-bold text-sm">Nome</Label>
              <Input
                id="nome"
                placeholder="Seu nome completo"
                value={form.nome}
                onChange={(e) => update("nome", e.target.value)}
                maxLength={100}
              />
              {errors.nome && <p className="text-destructive text-xs">{errors.nome}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="font-heading font-bold text-sm">E-mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                maxLength={255}
              />
              {errors.email && <p className="text-destructive text-xs">{errors.email}</p>}
            </div>
            <Button
              onClick={handleNext}
              className="w-full bg-whatsapp hover:bg-whatsapp/90 text-primary-foreground font-heading font-bold text-base gap-2 h-12 rounded-xl"
            >
              Próximo
              <ArrowRight size={18} />
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="whatsapp" className="font-heading font-bold text-sm">WhatsApp</Label>
              <Input
                id="whatsapp"
                type="tel"
                placeholder="(00) 00000-0000"
                value={form.whatsapp}
                onChange={(e) => update("whatsapp", e.target.value)}
                maxLength={20}
              />
              {errors.whatsapp && <p className="text-destructive text-xs">{errors.whatsapp}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="empresa" className="font-heading font-bold text-sm">Nome da Empresa</Label>
              <Input
                id="empresa"
                placeholder="Sua empresa"
                value={form.empresa}
                onChange={(e) => update("empresa", e.target.value)}
                maxLength={100}
              />
              {errors.empresa && <p className="text-destructive text-xs">{errors.empresa}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="setor" className="font-heading font-bold text-sm">Setor</Label>
              <Select value={form.setor} onValueChange={(v) => update("setor", v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o setor" />
                </SelectTrigger>
                <SelectContent>
                  {SETORES.map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.setor && <p className="text-destructive text-xs">{errors.setor}</p>}
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => { setStep(1); setErrors({}); }}
                className="flex-1 font-heading font-bold gap-2 h-12 rounded-xl"
              >
                <ArrowLeft size={18} />
                Voltar
              </Button>
              <Button
                onClick={handleSubmit}
                className="flex-1 bg-whatsapp hover:bg-whatsapp/90 text-primary-foreground font-heading font-bold text-base gap-2 h-12 rounded-xl"
              >
                <MessageCircle size={18} />
                Falar no WhatsApp
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default WhatsAppLeadDialog;
