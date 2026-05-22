import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ClientLogosMarquee from "@/components/ClientLogosMarquee";
import HowItWorksSection from "@/components/HowItWorksSection";
import VideoSection from "@/components/VideoSection";
import CookieConsentBanner from "@/components/legal/CookieConsentBanner";


import SocialProofSection from "@/components/SocialProofSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <ClientLogosMarquee />
      <HowItWorksSection />
      <VideoSection />
      
      
      <SocialProofSection />
      <Footer />
      <CookieConsentBanner />
    </div>
  );
};

export default Index;
