# 03. Struktura treści i danych

## Cel

Ujednolicenie danych tak, aby demonstrator można było później podłączyć do API bez przepisywania całego interfejsu.

## Proponowane typy

```ts
export interface Course {
  id: string;
  code: string;
  name: string;
  semester: string;
  description: string;
  instructor: string;
}

export interface Material {
  id: string;
  courseId: string;
  title: string;
  description: string;
  type: "pdf" | "slides" | "code" | "link";
  url: string;
  publishedAt: string;
  week: number;
}

export interface Question {
  id: string;
  text: string;
  type: "single-choice" | "multiple-choice" | "open";
  options?: { id: string; text: string }[];
  points: number;
  tags: string[];
  difficulty: 1 | 2 | 3 | 4 | 5;
}
```

W statycznym frontendzie nie zapisuj pola wskazującego poprawną odpowiedź. Klucz odpowiedzi powinien istnieć wyłącznie w backendzie.

## Proponowane pliki demonstracyjne

```text
apps/web/data/
├── courses.ts
├── materials.ts
├── quizzes.ts
├── questions.demo.ts
└── results.demo.ts
```

## Materiały dydaktyczne

Pliki PDF, prezentacje i przykłady można przechowywać w:

```text
apps/web/public/materials/NAZWA_KURSU/
```

Przykład:

```text
apps/web/public/materials/aio/
├── 01-wprowadzenie.pdf
├── 02-histogram.pdf
└── kod/
    └── histogram.py
```

Odwołanie w kodzie powinno uwzględniać bazową ścieżkę GitHub Pages. Najbezpieczniej używać komponentu `Link` dla stron wewnętrznych oraz helpera do zasobów publicznych.

## Minimalne reguły jakości pytań

- jedna jednoznaczna treść problemu,
- brak wskazówek gramatycznych ujawniających odpowiedź,
- dystraktory podobnej długości i tego samego typu,
- jawna liczba poprawnych odpowiedzi,
- przypisana punktacja i poziom trudności,
- wersjonowanie zmian pytania,
- przegląd merytoryczny przez drugą osobę przed użyciem ocenianym.
