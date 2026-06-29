import Link from "next/link";
import { Header } from "@/components/Header";

const studentSteps = [
  ["1", "Sprawdź status wejściówki", "Na pulpicie zweryfikuj termin, limit czasu i liczbę dostępnych podejść."],
  ["2", "Przygotuj stanowisko", "Zapewnij stabilne połączenie, zamknij zbędne aplikacje i nie odświeżaj strony w trakcie próby."],
  ["3", "Rozwiąż pytania", "Wybierz odpowiedź, przechodź między pytaniami i kontroluj oznaczenia pytań odpowiedzianych."],
  ["4", "Zakończ próbę", "Przed wysłaniem sprawdź kompletność odpowiedzi. W wersji produkcyjnej wynik zapisuje serwer."],
];

export default function GuidePage() {
  return <div className="shell"><Header active="guide" /><main id="main" className="container">
    <section className="page-intro"><span className="eyebrow">Instrukcja użytkownika</span><h1>Jak korzystać z platformy</h1><p>Ta wersja służy do demonstracji interfejsu. Dane, wyniki i terminy są przykładowe, a odpowiedzi nie są wysyłane do centralnej bazy.</p></section>
    <section className="callout warning-callout"><h2>Przed rozpoczęciem</h2><p>Nie używaj wersji statycznej do oficjalnego oceniania. GitHub Pages nie zapewnia bezpiecznego przechowywania klucza odpowiedzi, uwierzytelniania ani serwerowej kontroli czasu.</p></section>
    <div className="section-head"><div><h2>Instrukcja dla studenta</h2><p>Podstawowy przebieg pojedynczej wejściówki.</p></div></div>
    <section className="steps">{studentSteps.map(([n,t,d]) => <article className="step" key={n}><span>{n}</span><div><h3>{t}</h3><p>{d}</p></div></article>)}</section>
    <div className="section-head"><div><h2>Instrukcja dla prowadzącego</h2><p>Wersja demonstracyjna prezentuje układ panelu, nie pełny workflow administracyjny.</p></div></div>
    <section className="grid">
      <article className="card"><h3>1. Zdefiniuj kurs</h3><p>Ustal nazwę, grupę, okres realizacji, zasady zaliczenia i osoby uprawnione do edycji.</p></article>
      <article className="card"><h3>2. Przygotuj bank pytań</h3><p>Dodaj treść, warianty odpowiedzi, poprawny klucz, punktację, tagi i poziom trudności.</p></article>
      <article className="card"><h3>3. Skonfiguruj próbę</h3><p>Określ termin, limit czasu, liczbę pytań, sposób losowania, próg zaliczenia i liczbę podejść.</p></article>
    </section>
    <section className="callout"><h2>Dokumentacja techniczna</h2><p>Szczegółowe instrukcje instalacji, publikacji, struktury danych i integracji znajdują się w folderze <code>docs/</code>.</p><Link className="btn" href="/quiz/demo">Uruchom quiz demonstracyjny</Link></section>
  </main></div>;
}
