import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const quizzes = [
  { title: "Git i praca zespołowa", time: "10 min", status: "Dostępna", available: true },
  { title: "Terminal i automatyzacja", time: "12 min", status: "Wkrótce", available: false },
  { title: "Debugowanie i jakość kodu", time: "10 min", status: "Wkrótce", available: false },
];

const materials = [
  { label: "Temat 1", title: "Środowisko pracy programisty", href: "../materialy/ndp_laboratorium_01.html" },
  { label: "Temat 2", title: "Polecenia powłoki Bash", href: "../materialy/ndp_laboratorium_02.html" },
  { label: "Temat 3", title: "Skrypty powłoki Bash", href: "../materialy/ndp_laboratorium_03.html" },
  { label: "Temat 4", title: "Tworzenie dokumentów LaTeX", href: "../materialy/ndp_laboratorium_04.html" },
  { label: "Temat 5", title: "Pakiety LaTeX i własne makra", href: "../materialy/ndp_laboratorium_05.html" },
  { label: "Temat 6", title: "System kontroli wersji Git", href: "../materialy/ndp_laboratorium_06.html" },
  { label: "Ćwiczenia własne", title: "Interaktywny terminal Bash", href: "../materialy/ndp_terminal.html" },
];

export default function NdPPage() {
  return (
    <div className="shell">
      <Header active="dashboard" title="kia.ndp" />
      <main id="main" className="container">
        <section className="page-intro">
          <span className="eyebrow">Narzędzia dla programistów</span>
          <h1>kia.ndp</h1>
          <p>Materiały, wejściówki i wyniki dla przedmiotu Narzędzia dla programistów.</p>
        </section>
        <section aria-labelledby="materials-heading">
          <div className="section-head">
            <div>
              <h2 id="materials-heading">Materiały edukacyjne</h2>
              <p>Laboratoria ułożone w kolejności realizacji.</p>
            </div>
          </div>
          <div className="grid">
            {materials.map((material) => (
              <article className="card" key={material.label}>
                <span className="badge success">{material.label}</span>
                <h2>{material.title}</h2>
                <a className="btn secondary" href={material.href}>Otwórz materiał</a>
              </article>
            ))}
          </div>
        </section>
        <div className="section-head">
          <div>
            <h2>Wejściówki</h2>
            <p>Sprawdź wiedzę przed zajęciami.</p>
          </div>
        </div>
        <section className="grid" aria-label="Lista wejściówek">
          {quizzes.map((quiz) => (
            <article className="card" key={quiz.title}>
              <span className={`badge ${quiz.available ? "success" : ""}`}>{quiz.status}</span>
              <h2>{quiz.title}</h2>
              <p>Czas rozwiązania: {quiz.time}. Jedno podejście.</p>
              {quiz.available ? <Link className="btn" href="/quiz/demo">Rozpocznij</Link> : <button className="btn secondary" disabled>Jeszcze niedostępna</button>}
            </article>
          ))}
        </section>
      </main>
      <Footer />
    </div>
  );
}
