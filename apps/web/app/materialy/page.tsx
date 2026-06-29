import { Header } from "@/components/Header";

export default function MaterialsPage() {
  const rows = [
    ["1", "Wprowadzenie i reprezentacja obrazu", "PDF", "12.10.2026"],
    ["2", "Histogram i operacje punktowe", "Slajdy", "19.10.2026"],
    ["3", "Filtracja przestrzenna", "PDF + kod", "26.10.2026"],
    ["4", "Morfologia matematyczna", "Slajdy", "02.11.2026"]
  ];

  return (
    <div className="shell">
      <Header active="materials" />
      <main id="main" className="container">
        <div className="section-head">
          <div>
            <h1>Materiały kursowe</h1>
            <p>Analiza i obróbka obrazów — semestr zimowy 2026/2027.</p>
          </div>
        </div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Tydzień</th><th>Tytuł</th><th>Format</th><th>Publikacja</th><th>Akcja</th></tr></thead>
            <tbody>
              {rows.map(row => (
                <tr key={row[0]}>
                  {row.map(cell => <td key={cell}>{cell}</td>)}
                  <td><button className="btn secondary">Otwórz</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
