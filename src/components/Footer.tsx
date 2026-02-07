import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-background border-t border-border py-12 mt-auto">
      <div className="container">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          {/* Brand */}
          <div className="flex flex-col gap-2">
            <span className="font-display text-lg font-semibold text-foreground">
              Eluro
            </span>
            <span className="text-sm text-muted-foreground">
              {t('footer.tagline')}
            </span>
          </div>

          {/* Links */}
          <nav className="flex flex-wrap gap-6 text-sm text-muted-foreground">
            <a
              href="mailto:support@doggospotusa.com"
              className="hover:text-foreground transition-colors duration-300"
            >
              support@doggospotusa.com
            </a>
            <Link
              to="/privacy"
              className="hover:text-foreground transition-colors duration-300"
            >
              {t('footer.privacy')}
            </Link>
            <Link
              to="/terms"
              className="hover:text-foreground transition-colors duration-300"
            >
              {t('footer.terms')}
            </Link>
            <Link
              to="/refund"
              className="hover:text-foreground transition-colors duration-300"
            >
              Refund Policy
            </Link>
            <Link
              to="/shipping"
              className="hover:text-foreground transition-colors duration-300"
            >
              Shipping Policy
            </Link>
          </nav>
        </div>

        <div className="mt-8 pt-8 border-t border-border">
          <p className="text-xs text-muted-foreground">
            {t('footer.copyright', { year: new Date().getFullYear() })}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
