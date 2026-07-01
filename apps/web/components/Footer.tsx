import { APP_BUILD_DATE, APP_VERSION } from "@/lib/version.generated";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div>
          <strong>kia</strong>
          <p>System dydaktyczny Katedry Informatyki i Automatyki</p>
        </div>
        <div className="footer-meta">
          <span>Wersja {APP_VERSION}</span>
          <span>Build: {APP_BUILD_DATE}</span>
          <span>Politechnika Rzeszowska</span>
        </div>
      </div>
    </footer>
  );
}
