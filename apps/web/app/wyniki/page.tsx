import { Header } from "@/components/Header";

export default function ResultsPage() {
  return (
    <div className="shell">
      <Header active="results" />
      <main id="main" className="container">
        <div className="section-head">
          <div><h1>Moje wyniki</h1><p>Historia zakończonych prób.</p></div>
        </div>

        <section className="metric-grid">
          <div className="card metric"><small>Średni wynik</small><strong>82%</strong></div>
          <div className="card metric"><small>Ukończone próby</small><strong>6</strong></div>
          <div className="card metric"><small>Średni czas</small><strong>8:42</strong></div>
          <div className="card metric"><small>Najlepszy wynik</small><strong>100%</strong></div>
        </section>

        <div className="section-head"><div><h2>Próby</h2></div></div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Wejściówka</th><th>Data</th><th>Wynik</th><th>Czas</th><th>Status</th></tr></thead>
            <tbody>
              <tr><td>Podstawy obrazu cyfrowego</td><td>12.10.2026</td><td>9/10</td><td>08:31</td><td><span className="badge success">Zaliczona</span></td></tr>
              <tr><td>Histogram</td><td>19.10.2026</td><td>7/10</td><td>09:14</td><td><span className="badge success">Zaliczona</span></td></tr>
              <tr><td>Filtracja</td><td>26.10.2026</td><td>6/10</td><td>10:02</td><td><span className="badge warning">Do poprawy</span></td></tr>
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
