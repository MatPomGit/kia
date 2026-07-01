"use client";

import Link from "next/link";
import { FormEvent, useEffect, useRef, useState } from "react";
import { Footer } from "@/components/Footer";
import { DEMO_PASSWORD, DEMO_USERNAME, loginInstructor } from "@/lib/auth";

const subjects = [
  { name: "Narzędzia dla programistów", href: "/kia.ndp", available: true },
  { name: "Algorytmy i struktury danych", href: "/kia.asid", available: true },
  { name: "Programowanie aplikacji mobilnych", href: "#", available: false },
  { name: "Programowanie gier komputerowych", href: "#", available: false },
  { name: "Informatyka afektywna", href: "#", available: false },
  { name: "Robotyka afektywna", href: "#", available: false },
  { name: "Seminarium dyplomowe", href: "/kia.sd", available: true },
];

const steps = [
  {
    title: "Wybierz przedmiot",
    description: "Przejdź do kursu przypisanego do zajęć i korzystaj z materiałów przygotowanych dla Twojej grupy.",
  },
  {
    title: "Korzystaj z materiałów",
    description: "Znajdziesz tu instrukcje, zasady zaliczenia oraz odnośniki potrzebne podczas laboratoriów.",
  },
  {
    title: "Rozwiązuj wejściówki",
    description: "Krótka weryfikacja wiedzy pomaga przygotować się do zajęć i uporządkować najważniejsze pojęcia.",
  },
  {
    title: "Sprawdzaj wyniki",
    description: "Po zakończeniu testu możesz szybko zobaczyć rezultat, a prowadzący ma dostęp do zbiorczych podsumowań.",
  },
];

export default function KiaHomePage() {
  const [isLoginOpen, setLoginOpen] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [isSubmitting, setSubmitting] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isLoginOpen) dialogRef.current?.querySelector<HTMLInputElement>("input")?.focus();
  }, [isLoginOpen]);

  useEffect(() => {
    if (!isLoginOpen) return;

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setLoginOpen(false);
    }

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [isLoginOpen]);

  async function submitLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoginError("");
    setSubmitting(true);
    const form = new FormData(event.currentTarget);

    try {
      await loginInstructor(String(form.get("login") ?? ""), String(form.get("password") ?? ""));
      window.location.href = `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/kia.dr/`;
    } catch (error) {
      setLoginError(error instanceof Error ? error.message : "Logowanie nie powiodło się.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="landing-shell">
      <main id="main" className="landing-main">
        <section className="landing-hero" aria-labelledby="landing-heading">
          <div className="landing-hero-content">
            <span className="landing-mark" aria-hidden="true">K</span>
            <p className="landing-eyebrow">Platforma kia</p>
            <h1 id="landing-heading">Materiały, wejściówki i wyniki zajęć w jednym miejscu</h1>
            <p>
              kia porządkuje dostęp do kursów, instrukcji laboratoryjnych i krótkich testów kontrolnych,
              aby studenci mogli szybciej rozpocząć pracę, a prowadzący sprawniej monitorowali postępy.
            </p>
<div className="landing-actions" role="group" aria-label="Główne akcje">
              <a className="btn" href="#courses">Przejdź do przedmiotów</a>
              <a className="btn secondary" href="#platform-guide">Zobacz instrukcję</a>
            </div>
          </div>
<div className="landing-hero-card" role="group" aria-label="Najważniejsze funkcje platformy">
            <strong>Start zajęć bez chaosu</strong>
            <ul>
              <li>kursy dostępne z jednej strony startowej,</li>
              <li>wejściówki i wyniki w przewidywalnym przepływie,</li>
              <li>panel prowadzącego do obsługi rezultatów.</li>
            </ul>
          </div>
        </section>

        <section id="courses" className="landing-section" aria-labelledby="subjects-heading">
          <div className="landing-section-head">
            <p className="landing-eyebrow">Dostępne kursy</p>
            <h2 id="subjects-heading">Wybierz przedmiot studiów</h2>
            <p>
              Aktywne kafelki prowadzą bezpośrednio do kursów. Pozostałe przedmioty są oznaczone jako przyszłe
              moduły platformy.
            </p>
          </div>
          <div className="subject-grid">
            {subjects.map((subject) => subject.available ? (
              <Link className="subject-button" href={subject.href} key={subject.name}>
                <span>{subject.name}</span><small>Dostępny</small>
              </Link>
            ) : (
              <button className="subject-button unavailable" type="button" disabled key={subject.name}>
                <span>{subject.name}</span><small>Wkrótce</small>
              </button>
            ))}
          </div>
        </section>

        <section id="platform-guide" className="landing-section" aria-labelledby="guide-heading">
          <div className="landing-section-head">
            <p className="landing-eyebrow">Jak działa platforma</p>
            <h2 id="guide-heading">Od wyboru kursu do podglądu wyników</h2>
            <p>Platforma prowadzi użytkownika przez najważniejsze etapy pracy na zajęciach.</p>
          </div>
<ol className="platform-steps" role="list">
            {steps.map((step, index) => (
              <li className="platform-step" key={step.title}>
                <span aria-hidden="true">{index + 1}</span>
                <div>
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="instructor-panel" aria-labelledby="instructor-heading">
          <div>
            <p className="landing-eyebrow">Dla prowadzącego</p>
            <h2 id="instructor-heading">Panel do obsługi wejściówek i rezultatów</h2>
            <p>
              Zalogowany prowadzący może przejść do panelu, w którym dostępne są narzędzia administracyjne,
              podgląd wyników oraz eksport danych potrzebnych do prowadzenia zajęć.
            </p>
          </div>
          <button className="instructor-entry" type="button" onClick={() => setLoginOpen(true)}>
            Otwórz panel prowadzącego
          </button>
        </section>
      </main>

      <Footer />

      {isLoginOpen && (
        <div className="modal-backdrop" role="presentation" onMouseDown={() => setLoginOpen(false)}>
          <div className="login-dialog" role="dialog" aria-modal="true" aria-labelledby="login-heading" ref={dialogRef} onMouseDown={(event) => event.stopPropagation()}>
            <button className="dialog-close" type="button" aria-label="Zamknij okno logowania" onClick={() => setLoginOpen(false)}>×</button>
            <h2 id="login-heading">Logowanie prowadzącego</h2>
            <p>Dane logowania są weryfikowane przez zabezpieczoną usługę uwierzytelniania. W statycznym trybie demo użyj loginu <strong>{DEMO_USERNAME}</strong> i hasła <strong>{DEMO_PASSWORD}</strong>.</p>
            <form onSubmit={submitLogin} className="login-form">
              <label htmlFor="login">Login</label>
              <input id="login" name="login" type="text" autoComplete="username" required />
              <label htmlFor="password">Hasło</label>
              <input id="password" name="password" type="password" autoComplete="current-password" minLength={8} required />
              {loginError && <p className="form-error" role="alert">{loginError}</p>}
              <button className="btn" type="submit" disabled={isSubmitting}>{isSubmitting ? "Logowanie..." : "Zaloguj"}</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
