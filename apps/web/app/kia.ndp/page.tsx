import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const quizzes = [
  { title: "Git i praca zespołowa", time: "10 min", status: "Dostępna", available: true },
  { title: "Terminal i automatyzacja", time: "12 min", status: "Wkrótce", available: false },
  { title: "Debugowanie i jakość kodu", time: "10 min", status: "Wkrótce", available: false },
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
