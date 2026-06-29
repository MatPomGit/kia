"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Header } from "@/components/Header";
import { classifyKey, TelemetryEvent } from "@/lib/telemetry";

const questions = [
  {
    id: "q1",
    text: "Która operacja służy do zwiększenia lokalnego kontrastu obrazu?",
    options: ["Binaryzacja globalna", "Wyrównanie histogramu", "Erozja", "Transformacja Hougha"]
  },
  {
    id: "q2",
    text: "Który filtr jest odporny na zakłócenia impulsowe typu sól i pieprz?",
    options: ["Filtr medianowy", "Filtr Laplace’a", "Filtr Sobela", "Filtr Gaussa"]
  },
  {
    id: "q3",
    text: "Co opisuje element strukturalny w morfologii matematycznej?",
    options: ["Model szumu", "Lokalne sąsiedztwo operacji", "Przestrzeń barw", "Rozdzielczość obrazu"]
  }
];

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60).toString().padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

export default function QuizPage() {
  const [current, setCurrent] = useState(0);
  const [remaining, setRemaining] = useState(600);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const queue = useRef<TelemetryEvent[]>([]);
  const lastPointer = useRef(0);

  const question = questions[current];
  const progress = useMemo(() => Math.round(((current + 1) / questions.length) * 100), [current]);

  useEffect(() => {
    const timer = window.setInterval(() => setRemaining(v => Math.max(0, v - 1)), 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const onPointer = (event: PointerEvent) => {
      const now = performance.now();
      if (now - lastPointer.current < 500) return;
      lastPointer.current = now;
      queue.current.push({
        type: "pointer_sample",
        timestamp: new Date().toISOString(),
        questionId: question.id,
        payload: {
          x: Number((event.clientX / window.innerWidth).toFixed(3)),
          y: Number((event.clientY / window.innerHeight).toFixed(3)),
          buttons: event.buttons
        }
      });
    };

    const onKey = (event: KeyboardEvent) => {
      const meta = classifyKey(event);
      if (!meta) return;
      queue.current.push({
        type: "key_meta",
        timestamp: new Date().toISOString(),
        questionId: question.id,
        payload: meta as { category: "navigation" | "editing" | "system"; code: string; repeat: boolean }
      });
    };

    const onVisibility = () => {
      queue.current.push({
        type: "visibility",
        timestamp: new Date().toISOString(),
        payload: { state: document.visibilityState }
      });
    };

    document.addEventListener("pointermove", onPointer, { passive: true });
    document.addEventListener("keydown", onKey);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      document.removeEventListener("pointermove", onPointer);
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [question.id]);

  useEffect(() => {
    const flush = window.setInterval(() => {
      if (!queue.current.length) return;
      // W wersji produkcyjnej: POST /api/attempts/:id/events/batch
      console.info("Telemetry batch:", queue.current.splice(0));
    }, 8000);
    return () => window.clearInterval(flush);
  }, []);

  return (
    <div className="shell">
      <Header />
      <main id="main" className="container">
        <div className="section-head">
          <div>
            <h1>Podstawy analizy obrazu</h1>
            <p>Podejście demonstracyjne — odpowiedzi są zapisywane lokalnie.</p>
          </div>
        </div>

        <div className="quiz-layout">
          <aside className="card quiz-sidebar" aria-label="Nawigacja po wejściówce">
            <small>Pozostały czas</small>
            <div className="timer" aria-live="polite">{formatTime(remaining)}</div>
            <div className="progress" aria-label={`Postęp: ${progress}%`}><span style={{ width: `${progress}%` }} /></div>
            <div className="question-nav">
              {questions.map((q, i) => (
                <button
                  key={q.id}
                  className={`${i === current ? "current" : ""} ${answers[q.id] ? "answered" : ""}`}
                  onClick={() => setCurrent(i)}
                  aria-label={`Pytanie ${i + 1}${answers[q.id] ? ", odpowiedziane" : ""}`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </aside>

          <section className="card question-card" data-question-id={question.id}>
            <span className="badge">Pytanie {current + 1} z {questions.length}</span>
            <fieldset>
              <legend>{question.text}</legend>
              {question.options.map(option => (
                <label className="answer" key={option}>
                  <input
                    type="radio"
                    name={question.id}
                    checked={answers[question.id] === option}
                    onChange={() => setAnswers(prev => ({ ...prev, [question.id]: option }))}
                  />
                  <span>{option}</span>
                </label>
              ))}
            </fieldset>

            <div className="actions">
              <button className="btn secondary" onClick={() => setCurrent(v => Math.max(0, v - 1))} disabled={current === 0}>
                Poprzednie
              </button>
              {current < questions.length - 1 ? (
                <button className="btn" onClick={() => setCurrent(v => Math.min(questions.length - 1, v + 1))}>
                  Następne
                </button>
              ) : (
                <button className="btn danger" onClick={() => alert("W szkielecie produkcyjne zakończenie próby nie jest jeszcze podłączone.")}>
                  Zakończ próbę
                </button>
              )}
            </div>

            <div className="privacy-note">
              System demonstracyjny rejestruje wyłącznie czas, zmianę widoczności karty, próbkowany ruch wskaźnika oraz klasy klawiszy nawigacyjnych. Nie zapisuje wpisywanych znaków.
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
