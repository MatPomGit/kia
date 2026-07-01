"use client";

import Link from "next/link";
import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

type StudyMode = "fullTime" | "partTime";

type Quiz = {
  label: string;
  title: string;
  time: string;
  status: string;
  available: boolean;
};

type GradeRequirement = {
  grade: string;
  title: string;
  description: string;
};

type Material = {
  label: string;
  title: string;
  description: string;
};

const studyModes: Array<{ id: StudyMode; label: string }> = [
  { id: "fullTime", label: "Studia stacjonarne" },
  { id: "partTime", label: "Studia niestacjonarne" },
];

const quizzes: Quiz[] = [
  { label: "Wejściówka 1", title: "Projektowanie algorytmów i poprawność", time: "10 min", status: "Wkrótce", available: false },
  { label: "Wejściówka 2", title: "Złożoność obliczeniowa i efektywność", time: "10 min", status: "Wkrótce", available: false },
  { label: "Wejściówka 3", title: "Listy, kolejki i stosy", time: "10 min", status: "Wkrótce", available: false },
  { label: "Wejściówka 4", title: "Drzewa i ich reprezentacje", time: "10 min", status: "Wkrótce", available: false },
  { label: "Wejściówka 5", title: "Grafy i podstawowe zastosowania", time: "10 min", status: "Wkrótce", available: false },
  { label: "Wejściówka 6", title: "Algorytmy sortowania", time: "10 min", status: "Wkrótce", available: false },
];

const quizzesByMode: Record<StudyMode, Quiz[]> = {
  fullTime: quizzes,
  partTime: quizzes,
};

const gradeRequirements: GradeRequirement[] = [
  {
    grade: "3",
    title: "Poziom podstawowy",
    description:
      "Student ma podstawową wiedzę o wybranych technikach projektowania algorytmów, ich poprawności, złożoności i wydajności. Rozumie elementarne struktury danych, takie jak listy, kolejki i stosy, potrafi wykonywać na nich podstawowe operacje oraz zna podstawowe reprezentacje i zastosowania drzew, grafów i popularnych algorytmów sortowania.",
  },
  {
    grade: "4",
    title: "Poziom pogłębiony",
    description:
      "Student spełnia wymagania na ocenę 3, a dodatkowo pisze poprawne programy dzięki rozumieniu zastosowanych rozwiązań, a nie wyłącznie metodą prób i błędów. Ma pogłębioną wiedzę o złożoności, wydajności i poprawności algorytmów, operacjach na strukturach liniowych, reprezentacjach drzew i grafów oraz analizie większej liczby algorytmów sortowania.",
  },
  {
    grade: "5",
    title: "Poziom biegły i kreatywny",
    description:
      "Student spełnia wymagania na ocenę 4, a ponadto potrafi stosować poznane metody do znanych i nowych problemów. Wykazuje biegłość oraz kreatywność w badaniu złożoności algorytmów, doborze i wykorzystaniu struktur danych, reprezentowaniu drzew i grafów oraz znajomości i zastosowaniach algorytmów sortowania.",
  },
];

const materials: Material[] = [
  { label: "Laboratorium 1", title: "Techniki projektowania algorytmów", description: "Poprawność, przejrzystość i sposoby usprawniania rozwiązań algorytmicznych." },
  { label: "Laboratorium 2", title: "Złożoność i wydajność", description: "Analiza czasu działania, pamięci oraz znaczenie poprawności algorytmów." },
  { label: "Laboratorium 3", title: "Listy, kolejki i stosy", description: "Elementarne struktury danych i podstawowe operacje wykonywane na tych strukturach." },
  { label: "Laboratorium 4", title: "Drzewa", description: "Sposoby reprezentowania drzew oraz przykładowe zastosowania w rozwiązywaniu problemów." },
  { label: "Laboratorium 5", title: "Grafy", description: "Reprezentacje grafów, podstawowe pojęcia i typowe zastosowania." },
  { label: "Laboratorium 6", title: "Algorytmy sortowania", description: "Działanie popularnych metod sortowania i porównywanie ich złożoności." },
  { label: "Laboratorium 7", title: "Powtórzenie i zadania przekrojowe", description: "Łączenie technik algorytmicznych, struktur danych oraz analizy złożoności w zadaniach problemowych." },
];

export default function AsdPage() {
  const [quizMode, setQuizMode] = useState<StudyMode>("fullTime");
  const [materialsMode, setMaterialsMode] = useState<StudyMode>("fullTime");

  return (
    <div className="shell">
      <Header active="dashboard" title="kia.asid" />
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
            {gradeRequirements.map((requirement) => (
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
            {quizzesByMode[quizMode].map((quiz) => (
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
            {materials.map((material) => (
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
