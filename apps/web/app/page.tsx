"use client";

import Link from "next/link";
import { FormEvent, useEffect, useRef, useState } from "react";
import { Footer } from "@/components/Footer";
import { DEMO_PASSWORD, DEMO_USERNAME, loginInstructor } from "@/lib/auth";

const subjects = [
  { name: "Narzędzia dla programistów", href: "/kia.ndp", available: true },
  { name: "Algorytmy i struktury danych", href: "#", available: false },
  { name: "Programowanie aplikacji mobilnych", href: "#", available: false },
  { name: "Programowanie gier komputerowych", href: "#", available: false },
  { name: "Informatyka afektywna", href: "#", available: false },
  { name: "Robotyka afektywna", href: "#", available: false },
  { name: "Seminarium dyplomowe", href: "#", available: false },
];

export default function KiaHomePage() {
  const [isLoginOpen, setLoginOpen] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [isSubmitting, setSubmitting] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isLoginOpen) dialogRef.current?.querySelector<HTMLInputElement>("input")?.focus();
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
        <header className="landing-header">
          <span className="landing-mark" aria-hidden="true">K</span>
          <h1>kia</h1>
          <p>Wybierz przedmiot studiów lub przejdź do panelu prowadzącego.</p>
        </header>

        <section className="subject-grid" aria-labelledby="subjects-heading">
          <h2 id="subjects-heading" className="sr-only">Przedmioty studiów</h2>
          {subjects.map((subject) => subject.available ? (
            <Link className="subject-button" href={subject.href} key={subject.name}>
              <span>{subject.name}</span><small>Dostępny</small>
            </Link>
          ) : (
            <button className="subject-button unavailable" type="button" disabled key={subject.name}>
              <span>{subject.name}</span><small>Wkrótce</small>
            </button>
          ))}
        </section>

        <button className="instructor-entry" type="button" onClick={() => setLoginOpen(true)}>
          Panel prowadzącego
        </button>
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
