import { useLang } from "../context/LangContext";
import { FaFacebookF, FaLinkedinIn } from "react-icons/fa";
import "./Footer.css";

export default function Footer() {
  const { t } = useLang();

  return (
    <footer className="footer">
      <div className="footer__inner container">
        <div className="footer__brand">
          <img src="/logo_rlc.png" alt="RLC Madagascar Chapter" className="footer__logo-img" />
          <p className="footer__address">{t.footer.address}</p>
          <p className="footer__hours">{t.footer.hours}</p>
        </div>

        <div className="footer__social">
          <div className="footer__social-group">
            <span>{t.footer.follow}</span>
            <div className="footer__icons">
              <a href="https://www.facebook.com/yalirlcmg" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><FaFacebookF /></a>
              <a href="https://www.linkedin.com/company/yalirlcmg" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><FaLinkedinIn /></a>
            </div>
          </div>
        </div>
      </div>
      <div className="footer__bottom">
        <p>{t.footer.rights}</p>
      </div>
    </footer>
  );
}
