"use client";

import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { sdMaterial, sdQuizzes } from "@/lib/courses";

export default function SeminarPage() {
  return (
    <div className="shell">
      <Header active="dashboard" title="kia.sd" />
      <main id="main" className="container">
        <section className="page-intro">
          <span className="eyebrow">Seminarium dyplomowe</span>
          <h1>kia.sd</h1>
          <p>Materiały, wejściówki i informacje organizacyjne dla przedmiotu Seminarium dyplomowe.</p>
        </section>

        <section className="tabbed-panel" aria-labelledby="quizzes-heading">
          <div className="section-head compact">
            <div>
              <h2 id="quizzes-heading">Wejściówki</h2>
              <p>Zaplanowano cztery wejściówki sprawdzające przygotowanie do kolejnych etapów seminarium.</p>
            </div>
          </div>
          <div className="grid">
            {sdQuizzes.map((quiz) => (
              <article className="card" key={`${quiz.label}-${quiz.title}`}>
                <div className="meta">
                  <span className="badge success">{quiz.label}</span>
                  <span className={`badge ${quiz.available ? "success" : ""}`}>{quiz.status}</span>
                </div>
                <h2>{quiz.title}</h2>
                <p>Czas rozwiązania: {quiz.time}. Jedno podejście.</p>
                <details>
                  <summary>Przykładowe pytania</summary>
                  <ol>
                    {quiz.sampleQuestions?.map((question) => <li key={question}>{question}</li>)}
                  </ol>
                </details>
                {quiz.available ? <Link className="btn" href="/quiz/demo">Rozpocznij</Link> : <button className="btn secondary" disabled>Jeszcze niedostępna</button>}
              </article>
            ))}
          </div>
        </section>

        <section className="tabbed-panel" aria-labelledby="materials-heading">
          <div className="section-head compact">
            <div>
              <h2 id="materials-heading">Materiały</h2>
              <p>Materiały seminarium dyplomowego dostępne są jako osobna strona otwierana w nowej karcie.</p>
            </div>
          </div>
          <div className="grid">
            <article className="card">
              <span className="badge success">{sdMaterial.label}</span>
              <h2>{sdMaterial.title}</h2>
              <p>{sdMaterial.description}</p>
              <div className="card-actions">
                <a className="btn secondary" href={sdMaterial.href} target="_blank" rel="noopener noreferrer">Otwórz materiał</a>
              </div>
            </article>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
