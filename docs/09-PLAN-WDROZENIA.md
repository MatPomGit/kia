# 09. Plan wdrożenia

## Etap 1 — demonstrator statyczny

Zakres:

- uzupełnienie treści,
- dodanie materiałów,
- dopracowanie identyfikacji wizualnej,
- publikacja na GitHub Pages.

Definicja zakończenia:

- wszystkie strony działają,
- brak martwych odnośników,
- instrukcja jest kompletna,
- workflow wdrożeniowy przechodzi poprawnie.

## Etap 2 — uporządkowanie modelu danych

Zakres:

- przeniesienie danych demonstracyjnych do `data/`,
- utworzenie typów domenowych,
- przygotowanie klienta API,
- usunięcie danych wpisanych bezpośrednio w komponentach.

## Etap 3 — backend i baza danych

Zakres:

- PostgreSQL,
- migracje Prisma,
- API kursów, materiałów, quizów i prób,
- logowanie użytkowników,
- role student, prowadzący i administrator.

## Etap 4 — bezpieczne wejściówki

Zakres:

- serwerowy timer,
- losowanie pytań po stronie serwera,
- autosave,
- idempotentne zakończenie próby,
- klucz odpowiedzi wyłącznie w backendzie.

## Etap 5 — pilotaż

Zakres:

- test z małą grupą,
- pomiar błędów i obciążenia,
- test dostępności,
- analiza ryzyk i procedur awaryjnych,
- korekta instrukcji.

## Etap 6 — produkcja

Warunki wejścia:

- pozytywny wynik testów bezpieczeństwa,
- polityka retencji i backupu,
- monitoring,
- procedura awarii podczas wejściówki,
- wskazany właściciel systemu i administrator techniczny.
