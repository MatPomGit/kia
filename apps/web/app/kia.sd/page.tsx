"use client";

import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

type Quiz = {
  label: string;
  title: string;
  time: string;
  status: string;
  available: boolean;
  sampleQuestions: string[];
};

const quizzes: Quiz[] = [
  {
    label: "Wejściówka 1",
    title: "Wybór tematu i cel pracy",
    time: "10 min",
    status: "Wkrótce",
    available: false,
    sampleQuestions: [
      "Jak odróżnić temat pracy dyplomowej od samego tytułu pracy?",
      "Jakie cechy powinien mieć poprawnie sformułowany cel główny pracy?",
      "Dlaczego temat pracy powinien być możliwy do zrealizowania w założonym czasie?",
      "Jak wskazać praktyczny lub badawczy problem, który ma rozwiązać praca?",
      "Czym różni się cel główny od celów szczegółowych?",
      "Jak sprawdzić, czy temat pracy jest wystarczająco zawężony?",
      "Jakie kryteria pomagają ocenić aktualność i przydatność tematu?",
      "Dlaczego warto określić spodziewany rezultat pracy już na etapie wyboru tematu?",
      "Jakie ryzyka mogą wynikać z wybrania zbyt szerokiego tematu?",
      "Jak przygotować krótkie uzasadnienie wyboru tematu dla promotora?",
    ],
  },
  {
    label: "Wejściówka 2",
    title: "Przegląd literatury i źródeł",
    time: "10 min",
    status: "Wkrótce",
    available: false,
    sampleQuestions: [
      "Jak rozpoznać wiarygodne źródło naukowe lub techniczne?",
      "Czym różni się literatura przedmiotu od dokumentacji narzędzia?",
      "Jakie informacje bibliograficzne trzeba zapisać podczas pracy ze źródłem?",
      "Dlaczego przegląd literatury powinien prowadzić do wniosków, a nie tylko streszczeń?",
      "Jak unikać plagiatu podczas parafrazowania cudzych treści?",
      "Jak dobrać słowa kluczowe do wyszukiwania literatury?",
      "Po czym poznać, że źródło jest nieaktualne dla danego tematu?",
      "Jak porównać dwa źródła prezentujące odmienne podejścia do problemu?",
      "Jaką rolę pełnią cytowania i przypisy w pracy dyplomowej?",
      "Jak uporządkować znalezione źródła według obszarów tematycznych?",
    ],
  },
  {
    label: "Wejściówka 3",
    title: "Metodyka i harmonogram realizacji",
    time: "10 min",
    status: "Wkrótce",
    available: false,
    sampleQuestions: [
      "Jak dobrać metodykę realizacji do charakteru pracy dyplomowej?",
      "Jakie elementy powinien zawierać realistyczny harmonogram prac?",
      "Dlaczego zadania w harmonogramie powinny mieć mierzalne rezultaty?",
      "Jak zaplanować kamienie milowe dla części teoretycznej i praktycznej?",
      "Jak uwzględnić czas na testowanie, korektę i konsultacje z promotorem?",
      "Jakie ryzyka warto wpisać do planu realizacji pracy?",
      "Jak monitorować postęp prac bez odkładania zadań na koniec semestru?",
      "Czym różni się etap analizy od etapu projektowania rozwiązania?",
      "Jak zaplanować zbieranie danych, eksperyment lub ewaluację rozwiązania?",
      "Jak aktualizować harmonogram, gdy zmienia się zakres pracy?",
    ],
  },
  {
    label: "Wejściówka 4",
    title: "Prezentacja postępów pracy",
    time: "10 min",
    status: "Wkrótce",
    available: false,
    sampleQuestions: [
      "Jak zbudować krótką prezentację pokazującą aktualny stan pracy?",
      "Jakie informacje powinny znaleźć się na slajdzie o celu i zakresie pracy?",
      "Jak przedstawić wykonane zadania bez nadmiernych szczegółów technicznych?",
      "Jak pokazać problemy i ryzyka w sposób rzeczowy i konstruktywny?",
      "Jak dobrać przykłady, diagramy lub zrzuty ekranu do prezentacji postępów?",
      "Dlaczego warto zakończyć prezentację planem kolejnych działań?",
      "Jak przygotować się do pytań promotora lub grupy seminaryjnej?",
      "Jak ocenić, czy prezentacja mieści się w wyznaczonym czasie?",
      "Jak mówić o opóźnieniach w harmonogramie i działaniach naprawczych?",
      "Jak wykorzystać informację zwrotną po prezentacji do poprawy pracy?",
    ],
  },
];

const material = {
  label: "Materiały",
  title: "Seminarium dyplomowe",
  description: "Strona z informacjami organizacyjnymi, wymaganiami i wskazówkami do przygotowania pracy dyplomowej.",
  href: "../materialy/seminarium_dyplomowe.html",
};

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
            {quizzes.map((quiz) => (
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
                    {quiz.sampleQuestions.map((question) => <li key={question}>{question}</li>)}
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
              <span className="badge success">{material.label}</span>
              <h2>{material.title}</h2>
              <p>{material.description}</p>
              <div className="card-actions">
                <a className="btn secondary" href={material.href} target="_blank" rel="noopener noreferrer">Otwórz materiał</a>
              </div>
            </article>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
