import Header from "@/components/header";
import Footer from "@/components/footer";
import { LanguageProvider } from "@/contexts/language-context";
import PerformanceOptimizer from "@/components/seo/performance-optimizer";

export default function LangLayout({ children, params }) {
  return (
    <LanguageProvider initialLanguage={params.lang}>
      <PerformanceOptimizer
        preconnectDomains={["https://i.imgur.com", "https://asteriashome.gr", "https://www.asteriashome.gr"]}
        dnsPrefetchDomains={["https://i.imgur.com", "https://asteriashome.gr", "https://www.asteriashome.gr"]}
        preloadImages={["/hero-1.png", "/hero-2.png"]}
      />
      <Header />
      {children}
      <Footer />
    </LanguageProvider>
  );
}