"use client";

import Link from "next/link";
import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ndpMaterialsByMode, ndpQuizzesByMode, ndpSimulators, studyModes, type StudyMode } from "@/lib/courses";

export default function NdPPage() {
  const [quizMode, setQuizMode] = useState<StudyMode>("fullTime");
  const [materialsMode, setMaterialsMode] = useState<StudyMode>("fullTime");

  return (
    <div className="shell">
      <Header active="dashboard" title="kia.ndp" />
      <main id="main" className="container">
        <section className="page-intro">
          <span className="eyebrow">Narzędzia dla programistów</span>
          <h1>kia.ndp</h1>
          <p>Materiały, wejściówki i wyniki dla przedmiotu Narzędzia dla programistów.</p>
        </section>

        <section className="tabbed-panel" aria-labelledby="quizzes-heading">
          <div className="section-head compact">
            <div>
              <h2 id="quizzes-heading">Wejściówki</h2>
              <p>Sprawdź wiedzę przed zajęciami. Program niestacjonarny łączy LaTeX i makra w jedną wejściówkę.</p>
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
            {ndpQuizzesByMode[quizMode].map((quiz) => (
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

        <section className="tabbed-panel" aria-labelledby="simulators-heading">
          <div className="section-head compact">
            <div>
              <h2 id="simulators-heading">Symulatory</h2>
              <p>Uruchom interaktywne środowiska do ćwiczenia terminala, LaTeX-a, Gita i VIM-a.</p>
            </div>
          </div>
          <div className="grid">
            {ndpSimulators.map((simulator) => (
              <article className="card" key={simulator.href}>
                <span className="badge success">{simulator.label}</span>
                <h3>{simulator.title}</h3>
                <p>{simulator.description}</p>
                <div className="card-actions">
                  <a className="btn secondary" href={simulator.href} aria-label={"Uruchom " + simulator.title}>Uruchom symulator</a>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="tabbed-panel" aria-labelledby="materials-heading">
          <div className="section-head compact">
            <div>
              <h2 id="materials-heading">Materiały i instrukcje</h2>
              <p>Laboratoria ułożone w kolejności realizacji dla wybranego trybu studiów.</p>
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
            {ndpMaterialsByMode[materialsMode].map((material) => (
              <article className="card" key={`${material.label}-${material.title}`}>
                <span className="badge success">{material.label}</span>
                <h2>{material.title}</h2>
                <p>{material.description}</p>
                <div className="card-actions">
                  {material.links?.map((link) => <a className="btn secondary" href={link.href} key={link.href}>{link.label}</a>)}
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
