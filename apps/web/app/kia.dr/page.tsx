"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { logoutInstructor, verifyInstructorSession } from "@/lib/auth";
import { ExportPanel } from "../prowadzacy/ExportPanel";
import { getInstructorDashboard, type InstructorDashboard } from "@/lib/instructor-dashboard";

export default function InstructorPage() {
  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const [dashboard, setDashboard] = useState<InstructorDashboard | null>(null);
  const [dashboardError, setDashboardError] = useState<string | null>(null);

  useEffect(() => {
    verifyInstructorSession().then((valid) => {
      if (!valid) {
        window.location.replace(`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/`);
        return;
      }
      setAuthorized(true);
    });
  }, []);

  useEffect(() => {
    if (authorized !== true) return;

    let cancelled = false;

    getInstructorDashboard()
      .then((data) => {
        if (cancelled) return;
        setDashboard(data);
        setDashboardError(null);
      })
      .catch((error: unknown) => {
        if (cancelled) return;
        setDashboardError(error instanceof Error ? error.message : "Nie udało się pobrać danych panelu prowadzącego.");
      });

    return () => {
      cancelled = true;
    };
  }, [authorized]);

  function logout() {
    logoutInstructor();
  }

  if (authorized !== true) {
    return <main className="auth-check" aria-live="polite">Weryfikowanie sesji prowadzącego...</main>;
  }

  return (
    <div className="shell">
      <Header active="instructor" courseHref="/kia.dr" title="kia.dr" />
      <main id="main" className="container">
        <div className="section-head">
          <div><span className="eyebrow">Panel prowadzącego</span><h1>kia.dr</h1><p>Zestawienie prób, wyników i podstawowej telemetrii.</p></div>
          <Link className="btn secondary" href="/" onClick={logout}>Wyloguj</Link>
        </div>
        {dashboard?.isDemo ? <div className="demo-banner" role="status">Dane demonstracyjne</div> : null}
        <ExportPanel metrics={dashboard?.metrics ?? []} attempts={dashboard?.attempts ?? []} isDemo={dashboard?.isDemo ?? false} />
        {dashboardError ? <div className="card warning-callout" role="alert">{dashboardError}</div> : null}
        {!dashboard && !dashboardError ? <div className="card" aria-live="polite">Ładowanie danych panelu...</div> : null}
        {dashboard ? (
          <>
            <section className="metric-grid">
              {dashboard.metrics.map((metric) => (
                <div className="card metric" key={metric.id}><small>{metric.label}</small><strong>{metric.value}</strong></div>
              ))}
            </section>
            <div className="section-head"><div><h2>Ostatnie podejścia</h2></div></div>
            {dashboard.attempts.length === 0 ? (
              <div className="card" role="status">Brak podejść do wyświetlenia.</div>
            ) : (
              <div className="table-wrap">
                <table>
                  <thead><tr><th>Nr indeksu</th><th>Wejściówka</th><th>Start</th><th>Wynik</th><th>Ukrycia karty</th><th>Akcja</th></tr></thead>
                  <tbody>
                    {dashboard.attempts.map((attempt) => (
                      <tr key={attempt.id}>
                        <td>{attempt.maskedIndex}</td>
                        <td>{attempt.quizTitle}</td>
                        <td>{attempt.startedAt}</td>
                        <td>{attempt.score}</td>
                        <td>{attempt.tabHiddenCount}</td>
                        <td><button className="btn secondary">Szczegóły</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        ) : null}
        <div className="privacy-note">Telemetria nie jest automatycznym dowodem niesamodzielności. Każda decyzja akademicka wymaga oceny prowadzącego i uwzględnienia kontekstu.</div>
      </main>
      <Footer />
    </div>
  );
}
