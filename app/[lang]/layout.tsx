import { LanguageProvider } from "@/contexts/language-context";

export default function LangLayout({ children, params }) {
  return (
    <LanguageProvider initialLanguage={params.lang}>
      {children}
    </LanguageProvider>
  );
}