# Architektura

Aktualny opis struktury znajduje się w:

- `02-STRUKTURA-PROJEKTU.md`,
- `03-TRESCI-I-DANE.md`,
- `06-INTEGRACJA-BACKENDU.md`.

Frontend jest statycznie eksportowaną aplikacją Next.js hostowaną na GitHub Pages. Backend NestJS jest opcjonalnym szkieletem i musi być hostowany poza GitHub Pages.

## Decyzje architektoniczne

### ADR-001: Statyczny frontend jako podstawowy wariant wdrożenia

**Status:** zaakceptowana.

**Decyzja:** aplikacja webowa pozostaje statycznie eksportowaną aplikacją Next.js. Publiczne strony kursów, materiały i demonstracyjne wejściówki muszą działać bez procesu serwerowego po stronie frontendu.

**Uzasadnienie:** GitHub Pages jest docelowym, prostym wariantem publikacji. Ogranicza to koszty utrzymania i pozwala udostępniać materiały dydaktyczne bez infrastruktury serwerowej.

**Konsekwencje:**

- kod wykonywany w przeglądarce nie może zawierać sekretów ani kluczy odpowiedzi,
- funkcje wymagające sekretów, sesji lub zapisu danych muszą korzystać z zewnętrznego API,
- zmiany należy weryfikować komendą `npm run build:pages` albo, dla samego frontendu, `npm run build -w apps/web`.

### ADR-002: Wspólne źródło danych kursów w `apps/web/lib/courses.ts`

**Status:** zaakceptowana.

**Decyzja:** statyczne dane używane przez widoki kursów są utrzymywane w `apps/web/lib/courses.ts`. Moduł eksportuje typy domenowe `Course`, `CourseMaterial`, `CourseQuiz`, `StudyMode` oraz obecne zestawy danych dla strony głównej, `kia.ndp`, `kia.asid` i `kia.sd`.

**Uzasadnienie:** wcześniejsze trzymanie list przedmiotów, materiałów i wejściówek bezpośrednio w plikach `page.tsx` wiązało warstwę danych z widokami. Wspólny moduł zmniejsza duplikację i pozwala później podmienić implementację źródła danych na klienta API bez przebudowy komponentów stron.

**Konsekwencje:**

- strony w `apps/web/app/**/page.tsx` powinny importować dane kursów z `@/lib/courses`, a nie definiować lokalne tablice materiałów lub wejściówek,
- nowe statyczne dane kursów należy dopisywać do `apps/web/lib/courses.ts`, dopóki projekt nie ma osobnej warstwy API lub repozytorium danych,
- przy podłączeniu backendu należy zachować obecne typy albo wprowadzić adapter mapujący odpowiedzi API na `Course`, `CourseMaterial`, `CourseQuiz` i `StudyMode`,
- komponenty widoków powinny pozostać odpowiedzialne za renderowanie, a nie za modelowanie danych.

### ADR-003: Backend tylko dla funkcji wymagających zaufanego środowiska

**Status:** zaakceptowana.

**Decyzja:** backend NestJS jest używany dla uwierzytelniania, walidacji sesji, zapisu wyników i operacji wymagających sekretów. Publiczne treści kursów pozostają możliwe do statycznego renderowania.

**Uzasadnienie:** rozdzielenie publicznych materiałów od funkcji wymagających zaufanego środowiska zachowuje prostotę GitHub Pages i jednocześnie umożliwia bezpieczne rozwijanie panelu prowadzącego.

**Konsekwencje:**

- sekrety muszą być przechowywane wyłącznie w zmiennych środowiskowych backendu,
- frontend może otrzymywać tylko publiczne adresy usług, na przykład `NEXT_PUBLIC_AUTH_API_URL`,
- dane wrażliwe i odpowiedzi studentów nie mogą trafiać do katalogu `public` ani statycznego bundla.
