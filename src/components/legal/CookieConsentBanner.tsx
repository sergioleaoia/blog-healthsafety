import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

const COOKIE_CONSENT_KEY = "phoebus-cookie-consent";
const PRIVACY_POLICY_URL = "https://www.healthsafety.com.br/politica.cfm";

const CookieConsentBanner = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const hasConsent = localStorage.getItem(COOKIE_CONSENT_KEY) === "accepted";
    setVisible(!hasConsent);
  }, []);

  const handleAccept = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, "accepted");
    setVisible(false);
  };

  if (!visible) {
    return null;
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-[60] border-t border-border bg-background/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <p className="text-xs leading-snug text-foreground">
          Este site utiliza cookies e outras tecnologias semelhantes para melhorar a sua experiência. Ao
          continuar navegando, você concorda com as condições previstas na nossa{" "}
          <a
            href={PRIVACY_POLICY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2"
          >
            Política de Privacidade
          </a>
          . Para mais informações, consulte aqui.
        </p>

        <Button
          onClick={handleAccept}
          className="h-10 shrink-0 px-6 font-heading font-bold"
          aria-label="Concordar com o uso de cookies"
        >
          Concordo
        </Button>
      </div>
    </div>
  );
};

export default CookieConsentBanner;
