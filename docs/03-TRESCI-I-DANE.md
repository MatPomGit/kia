# 03. Struktura treści i danych

## Cel

Ujednolicenie danych tak, aby demonstrator można było później podłączyć do API bez przepisywania całego interfejsu.

## Aktualne źródło danych kursów

Statyczne dane widoków kursów znajdują się w jednym module:

```text
apps/web/lib/courses.ts
```

Moduł zawiera:

- listę przedmiotów używaną na stronie głównej,
- tryby studiów,
- materiały, symulatory i wejściówki dla `kia.ndp`,
- wymagania ocen, materiały i wejściówki dla `kia.asid`,
- materiały i wejściówki dla `kia.sd`.

Eksportowane typy bazowe to:

```ts
export type StudyMode = "fullTime" | "partTime";

export type Course = {
  name: string;
  href: string;
  available: boolean;
};

export type CourseQuiz = {
  label: string;
  title: string;
  time: string;
  status: string;
  available: boolean;
  sampleQuestions?: string[];
};

export type CourseMaterial = {
  label: string;
  title: string;
  description: string;
  href?: string;
  links?: Array<{ label: string; href: string }>;
};
```

Strony kursów powinny importować te dane z `@/lib/courses`. Nie należy ponownie definiować list materiałów, wejściówek ani przedmiotów bezpośrednio w `page.tsx`. Dzięki temu późniejsze podłączenie backendu powinno polegać na podmianie źródła danych albo dodaniu adaptera API, a nie na przebudowie widoków.

W statycznym frontendzie nie zapisuj pola wskazującego poprawną odpowiedź. Klucz odpowiedzi powinien istnieć wyłącznie w backendzie.

## Docelowy podział przy rozbudowie backendu

Jeżeli liczba danych wzrośnie lub pojawi się pełna integracja z API, można rozdzielić obecny moduł na:

```text
apps/web/lib/course-types.ts      # typy domenowe używane przez widoki
apps/web/lib/courses.ts           # aktualne źródło danych lub adapter
apps/web/services/courses-api.ts  # klient API, gdy backend przejmie dane
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
