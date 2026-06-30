import { Header } from "@/components/Header";

export default function MaterialsPage() {
  const rows = [
    { number: "1", title: "Środowisko pracy programisty", scope: "Organizacja pracy, macOS, terminal, konfiguracja narzędzi i odpowiedzialne użycie AI.", href: "ndp_laboratorium_01.html" },
    { number: "2", title: "Polecenia powłoki Bash", scope: "System plików, przekierowania, potoki, kody zakończenia i pierwsze pętle.", href: "ndp_laboratorium_02.html" },
    { number: "3", title: "Skrypty powłoki Bash", scope: "Zmienne, instrukcje warunkowe, pętle, case, sygnały i podstawy edytora Vim.", href: "ndp_laboratorium_03.html" },
    { number: "4", title: "Tworzenie dokumentów LaTeX", scope: "Struktura i skład dokumentu, wzory, odwołania, spisy oraz grafika TikZ.", href: "ndp_laboratorium_04.html" },
    { number: "5", title: "Pakiety LaTeX i własne makra", scope: "Makra, listingi, metadane PDF, bibliografia BibTeX i schematy circuitikz.", href: "ndp_laboratorium_05.html" },
    { number: "6", title: "System kontroli wersji Git", scope: "Repozytoria, historia zmian, synchronizacja, konflikty, gałęzie i praca zespołowa.", href: "ndp_laboratorium_06.html" },
    { number: "Ćwiczenia własne", title: "Interaktywny terminal Bash", scope: "Samodzielne ćwiczenie podstawowych poleceń w wirtualnym terminalu Bash.", href: "ndp_terminal.html" }
  ];

  return (
    <div className="shell">
      <Header active="materials" />
      <main id="main" className="container">
        <div className="section-head">
          <div>
            <h1>Materiały kursowe</h1>
            <p>Narzędzia dla programistów - semestr zimowy 2026/2027</p>
          </div>
        </div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Temat</th><th>Tytuł</th><th>Zakres</th><th>Akcja</th></tr></thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.number}>
                  <td>{row.number}</td>
                  <td><strong>{row.title}</strong></td>
                  <td>{row.scope}</td>
                  <td><a className="btn secondary" href={row.href}>Otwórz</a></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
