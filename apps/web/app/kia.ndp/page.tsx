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

type Material = {
  label: string;
  title: string;
  description: string;
  links: Array<{ label: string; href: string }>;
};

type Simulator = {
  label: string;
  title: string;
  description: string;
  href: string;
};

const studyModes: Array<{ id: StudyMode; label: string }> = [
  { id: "fullTime", label: "Studia stacjonarne" },
  { id: "partTime", label: "Studia niestacjonarne" },
];

const quizzesByMode: Record<StudyMode, Quiz[]> = {
  fullTime: [
    { label: "Zajęcia 2", title: "Polecenia powłoki Bash", time: "10 min", status: "Dostępna", available: true },
    { label: "Zajęcia 3", title: "Skrypty powłoki Bash", time: "10 min", status: "Wkrótce", available: false },
    { label: "Zajęcia 4", title: "Tworzenie dokumentów LaTeX", time: "10 min", status: "Wkrótce", available: false },
    { label: "Zajęcia 5", title: "Pakiety LaTeX i własne makra", time: "10 min", status: "Wkrótce", available: false },
    { label: "Zajęcia 6", title: "System kontroli wersji Git", time: "10 min", status: "Wkrótce", available: false },
  ],
  partTime: [
    { label: "Zajęcia 2", title: "Polecenia powłoki Bash", time: "10 min", status: "Dostępna", available: true },
    { label: "Zajęcia 3", title: "Skrypty powłoki Bash", time: "10 min", status: "Wkrótce", available: false },
    { label: "Zajęcia 4", title: "LaTeX i własne makra", time: "12 min", status: "Wkrótce", available: false },
    { label: "Zajęcia 5", title: "System kontroli wersji Git", time: "10 min", status: "Wkrótce", available: false },
  ],
};

const simulators: Simulator[] = [
  {
    label: "Terminal",
    title: "Symulator terminala",
    description: "Ćwicz podstawowe polecenia powłoki Bash w bezpiecznym środowisku przeglądarkowym.",
    href: "../materialy/ndp_terminal.html",
  },
  {
    label: "LaTeX",
    title: "Symulator LaTeX",
    description: "Sprawdzaj składnię dokumentów LaTeX i obserwuj efekt zmian bez lokalnej instalacji narzędzi.",
    href: "../materialy/ndp_latex.html",
  },
  {
    label: "Git",
    title: "Symulator Git",
    description: "Przećwicz komendy kontroli wersji, analizę historii i typowe operacje na repozytorium.",
    href: "../materialy/ndp_git.html",
  },
  {
    label: "VIM",
    title: "Symulator VIM",
    description: "Ćwicz podstawową nawigację, tryby pracy i edycję tekstu w edytorze VIM.",
    href: "../materialy/ndp_vim.html",
  },
];

const materialsByMode: Record<StudyMode, Material[]> = {
  fullTime: [
    { label: "Temat 1", title: "Środowisko pracy programisty", description: "Organizacja pracy, macOS, terminal, konfiguracja narzędzi i odpowiedzialne użycie AI.", links: [{ label: "Otwórz materiał", href: "../materialy/ndp_laboratorium_01.html" }] },
    { label: "Temat 2", title: "Polecenia powłoki Bash", description: "System plików, przekierowania, potoki, kody zakończenia i pierwsze pętle.", links: [{ label: "Otwórz materiał", href: "../materialy/ndp_laboratorium_02.html" }] },
    { label: "Temat 3", title: "Skrypty powłoki Bash", description: "Zmienne, instrukcje warunkowe, pętle, case, sygnały i podstawy edytora Vim.", links: [{ label: "Otwórz materiał", href: "../materialy/ndp_laboratorium_03.html" }] },
    { label: "Temat 4", title: "Tworzenie dokumentów LaTeX", description: "Struktura i skład dokumentu, wzory, odwołania, spisy oraz grafika TikZ.", links: [{ label: "Otwórz materiał", href: "../materialy/ndp_laboratorium_04.html" }] },
    { label: "Temat 5", title: "Pakiety LaTeX i własne makra", description: "Makra, listingi, metadane PDF, bibliografia BibTeX i schematy circuitikz.", links: [{ label: "Otwórz materiał", href: "../materialy/ndp_laboratorium_05.html" }] },
    { label: "Temat 6", title: "System kontroli wersji Git", description: "Repozytoria, historia zmian, synchronizacja, konflikty, gałęzie i praca zespołowa.", links: [{ label: "Otwórz materiał", href: "../materialy/ndp_laboratorium_06.html" }] },
    { label: "Ćwiczenia własne", title: "Interaktywny terminal Bash", description: "Samodzielne ćwiczenie podstawowych poleceń w wirtualnym terminalu Bash.", links: [{ label: "Otwórz terminal", href: "../materialy/ndp_terminal.html" }] },
  ],
  partTime: [
    { label: "Temat 1", title: "Środowisko pracy programisty", description: "Organizacja pracy, macOS, terminal, konfiguracja narzędzi i odpowiedzialne użycie AI.", links: [{ label: "Otwórz materiał", href: "../materialy/ndp_laboratorium_01.html" }] },
    { label: "Temat 2", title: "Polecenia powłoki Bash", description: "System plików, przekierowania, potoki, kody zakończenia i pierwsze pętle.", links: [{ label: "Otwórz materiał", href: "../materialy/ndp_laboratorium_02.html" }] },
    { label: "Temat 3", title: "Skrypty powłoki Bash", description: "Zmienne, instrukcje warunkowe, pętle, case, sygnały i podstawy edytora Vim.", links: [{ label: "Otwórz materiał", href: "../materialy/ndp_laboratorium_03.html" }] },
    { label: "Temat 4", title: "LaTeX i własne makra", description: "Połączona instrukcja dla studiów niestacjonarnych: dokumenty LaTeX, pakiety, makra, listingi i bibliografia.", links: [
      { label: "Część 1: LaTeX", href: "../materialy/ndp_laboratorium_04.html" },
      { label: "Część 2: makra", href: "../materialy/ndp_laboratorium_05.html" },
    ] },
    { label: "Temat 5", title: "System kontroli wersji Git", description: "Repozytoria, historia zmian, synchronizacja, konflikty, gałęzie i praca zespołowa.", links: [{ label: "Otwórz materiał", href: "../materialy/ndp_laboratorium_06.html" }] },
    { label: "Ćwiczenia własne", title: "Interaktywny terminal Bash", description: "Samodzielne ćwiczenie podstawowych poleceń w wirtualnym terminalu Bash.", links: [{ label: "Otwórz terminal", href: "../materialy/ndp_terminal.html" }] },
  ],
};

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

        <section className="tabbed-panel" aria-labelledby="simulators-heading">
          <div className="section-head compact">
            <div>
              <h2 id="simulators-heading">Symulatory</h2>
              <p>Uruchom interaktywne środowiska do ćwiczenia terminala, LaTeX-a, Gita i VIM-a.</p>
            </div>
          </div>
          <div className="grid">
            {simulators.map((simulator) => (
              <article className="card" key={simulator.href}>
                <span className="badge success">{simulator.label}</span>
                <h2>{simulator.title}</h2>
                <p>{simulator.description}</p>
                <div className="card-actions">
                  <a className="btn secondary" href={simulator.href}>Uruchom symulator</a>
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
            {materialsByMode[materialsMode].map((material) => (
              <article className="card" key={`${material.label}-${material.title}`}>
                <span className="badge success">{material.label}</span>
                <h2>{material.title}</h2>
                <p>{material.description}</p>
                <div className="card-actions">
                  {material.links.map((link) => <a className="btn secondary" href={link.href} key={link.href}>{link.label}</a>)}
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
