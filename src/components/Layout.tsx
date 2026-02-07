import { ReactNode } from "react";
import Header from "./Header";
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
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
      <LanguageSwitcher />
    </div>
  );
};

export default Layout;
