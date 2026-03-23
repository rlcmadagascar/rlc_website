import { useLang } from "../context/LangContext";
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
              <a href="#" aria-label="Facebook">f</a>
              <a href="#" aria-label="Twitter">t</a>
              <a href="#" aria-label="Instagram">in</a>
            </div>
          </div>
          <div className="footer__social-group">
            <span>{t.footer.subscribe}</span>
            <div className="footer__icons">
              <a href="#" aria-label="YouTube">yt</a>
            </div>
          </div>
          <div className="footer__social-group">
            <span>{t.footer.connect}</span>
            <div className="footer__icons">
              <a href="#" aria-label="LinkedIn">li</a>
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
