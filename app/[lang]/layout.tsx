import React from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { LanguageProvider, type LanguageCode } from "@/contexts/language-context";
import PerformanceOptimizer from "@/components/seo/performance-optimizer";

export default async function LangLayout({ children, params }: { children: React.ReactNode, params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  
  return (
    <LanguageProvider initialLanguage={lang as LanguageCode}>
      <PerformanceOptimizer
        preconnectDomains={["https://asteriashome.gr", "https://www.asteriashome.gr"]}
        dnsPrefetchDomains={["https://asteriashome.gr", "https://www.asteriashome.gr"]}
        preloadImages={["/hero-1.png", "/hero-2.png"]}
      />
      <Header />
      {children}
      <Footer />
    </LanguageProvider>
  );
}