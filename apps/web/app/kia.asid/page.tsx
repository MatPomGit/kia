"use client";

import Link from "next/link";
import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { asidGradeRequirements, asidMaterials, asidQuizzesByMode, studyModes, type StudyMode } from "@/lib/courses";

export default function AsdPage() {
  const [quizMode, setQuizMode] = useState<StudyMode>("fullTime");
  const [materialsMode, setMaterialsMode] = useState<StudyMode>("fullTime");

  return (
    <div className="shell">
      <Header active="dashboard" courseHref="/kia.asid" title="kia.asid" />
      <main id="main" className="container">
        <section className="page-intro">
          <span className="eyebrow">Algorytmy i struktury danych</span>
          <h1>kia.asid</h1>
          <p>Materiały, wejściówki i wyniki dla przedmiotu Algorytmy i struktury danych.</p>
        </section>

        <section className="tabbed-panel" aria-labelledby="grades-heading">
          <div className="section-head compact">
            <div>
              <h2 id="grades-heading">Warunki przyznawania ocen</h2>
              <p>Ocena końcowa zależy od wykazania wiedzy i umiejętności na kolejnych poziomach wymagań.</p>
            </div>
          </div>
          <div className="grid">
            {asidGradeRequirements.map((requirement) => (
              <article className="card" key={requirement.grade}>
                <span className="badge success">Ocena {requirement.grade}</span>
                <h2>{requirement.title}</h2>
                <p>{requirement.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="tabbed-panel" aria-labelledby="quizzes-heading">
          <div className="section-head compact">
            <div>
              <h2 id="quizzes-heading">Wejściówki</h2>
              <p>Zaplanowano sześć wejściówek sprawdzających najważniejsze zagadnienia kursu.</p>
            </div>
          </div>
          <div className="tabs" role="tablist" aria-label="Tryb studiów dla wejściówek">
            {studyModes.map((mode) => (
              <button
                aria-controls={`quizzes-${mode.id}`}
                aria-selected={quizMode === mode.id}
                className={quizMode === mode.id ? "active" : ""}
                id={`quizzes-tab-${mode.id}`}
                key={mode.id}
                onClick={() => setQuizMode(mode.id)}
                role="tab"
                type="button"
              >
                {mode.label}
              </button>
            ))}
          </div>
          <div aria-labelledby={`quizzes-tab-${quizMode}`} className="grid" id={`quizzes-${quizMode}`} role="tabpanel">
            {asidQuizzesByMode[quizMode].map((quiz) => (
              <article className="card" key={`${quiz.label}-${quiz.title}`}>
                <div className="meta">
                  <span className="badge success">{quiz.label}</span>
                  <span className={`badge ${quiz.available ? "success" : ""}`}>{quiz.status}</span>
                </div>
                <h2>{quiz.title}</h2>
                <p>Czas rozwiązania: {quiz.time}. Jedno podejście.</p>
                {quiz.available ? <Link className="btn" href="/quiz/demo">Rozpocznij</Link> : <button className="btn secondary" disabled>Jeszcze niedostępna</button>}
              </article>
            ))}
          </div>
        </section>

        <section className="tabbed-panel" aria-labelledby="materials-heading">
          <div className="section-head compact">
            <div>
              <h2 id="materials-heading">Materiały i instrukcje</h2>
              <p>Plan siedmiu stron laboratoriów ułożony w kolejności realizacji dla wybranego trybu studiów.</p>
            </div>
          </div>
          <div className="tabs" role="tablist" aria-label="Tryb studiów dla materiałów">
            {studyModes.map((mode) => (
              <button
                aria-controls={`materials-${mode.id}`}
                aria-selected={materialsMode === mode.id}
                className={materialsMode === mode.id ? "active" : ""}
                id={`materials-tab-${mode.id}`}
                key={mode.id}
                onClick={() => setMaterialsMode(mode.id)}
                role="tab"
                type="button"
              >
                {mode.label}
              </button>
            ))}
          </div>
          <div aria-labelledby={`materials-tab-${materialsMode}`} className="grid" id={`materials-${materialsMode}`} role="tabpanel">
            {asidMaterials.map((material) => (
              <article className="card" key={`${materialsMode}-${material.label}-${material.title}`}>
                <span className="badge success">{material.label}</span>
                <h2>{material.title}</h2>
                <p>{material.description}</p>
                <div className="card-actions">
                  <button className="btn secondary" disabled>Strona laboratorium w przygotowaniu</button>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
