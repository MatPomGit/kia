"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { logoutInstructor, verifyInstructorSession } from "@/lib/auth";
import { ExportPanel } from "../prowadzacy/ExportPanel";

export default function InstructorPage() {
  const [authorized, setAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    verifyInstructorSession().then((valid) => {
      if (!valid) {
        window.location.replace(`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/`);
        return;
      }
      setAuthorized(true);
    });
  }, []);

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
        <ExportPanel />
        <section className="metric-grid">
          <div className="card metric"><small>Aktywne kursy</small><strong>1</strong></div>
          <div className="card metric"><small>Studenci</small><strong>128</strong></div>
          <div className="card metric"><small>Próby dzisiaj</small><strong>42</strong></div>
          <div className="card metric"><small>Średni wynik</small><strong>74%</strong></div>
        </section>
        <div className="section-head"><div><h2>Ostatnie podejścia</h2></div></div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Nr indeksu</th><th>Wejściówka</th><th>Start</th><th>Wynik</th><th>Ukrycia karty</th><th>Akcja</th></tr></thead>
            <tbody>
              <tr><td>*****123</td><td>Git i praca zespołowa</td><td>09:02</td><td>9/10</td><td>0</td><td><button className="btn secondary">Szczegóły</button></td></tr>
              <tr><td>*****914</td><td>Git i praca zespołowa</td><td>09:04</td><td>7/10</td><td>2</td><td><button className="btn secondary">Szczegóły</button></td></tr>
              <tr><td>*****287</td><td>Git i praca zespołowa</td><td>09:06</td><td>8/10</td><td>1</td><td><button className="btn secondary">Szczegóły</button></td></tr>
            </tbody>
          </table>
        </div>
        <div className="privacy-note">Telemetria nie jest automatycznym dowodem niesamodzielności. Każda decyzja akademicka wymaga oceny prowadzącego i uwzględnienia kontekstu.</div>
      </main>
      <Footer />
    </div>
  );
}
