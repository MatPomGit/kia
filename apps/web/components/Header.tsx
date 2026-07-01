import Link from "next/link";

type HeaderProps = {
  active?: string;
  courseHref?: string;
  title?: string;
};

export function Header({ active = "dashboard", courseHref = "/kia.ndp", title = "kia.ndp" }: HeaderProps) {
  return (
    <header className="topbar">
      <Link href="/" className="brand">
        <span className="logo" aria-hidden="true">K</span>
        <span>{title}</span>
      </Link>
      <nav className="topnav" aria-label="Główna nawigacja">
        <Link className={active === "dashboard" ? "active" : ""} href={courseHref}>Przedmiot</Link>
        <Link className={active === "courses" ? "active" : ""} href="/">Kursy</Link>
        <Link className={active === "materials" ? "active" : ""} href="/materialy">Materiały</Link>
        <Link className={active === "results" ? "active" : ""} href="/wyniki">Wyniki</Link>
        <Link className={active === "guide" ? "active" : ""} href="/instrukcja">Instrukcja</Link>
      </nav>
      <span className="mode-label">Tryb demonstracyjny</span>
    </header>
  );
}
