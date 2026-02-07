import { ReactNode } from "react";
import Footer from "./Footer";
import LanguageSwitcher from "./LanguageSwitcher";
import { PremiumInfoBar } from "./product";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <PremiumInfoBar />
      <main className="flex-1 pt-9">
        {children}
      </main>
      <Footer />
      <LanguageSwitcher />
    </div>
  );
};

export default Layout;
