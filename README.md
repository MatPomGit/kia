# kia — platforma dydaktyczna

Statyczna platforma dydaktyczna przygotowana w Next.js, React i TypeScript. Aplikacja porządkuje dostęp do przedmiotów, materiałów laboratoryjnych, krótkich wejściówek, wyników oraz panelu prowadzącego. Frontend jest eksportowany do zwykłych plików HTML, CSS i JavaScript, a następnie publikowany automatycznie przez GitHub Actions na GitHub Pages.

## Standardy projektu

- obowiązkowe wytyczne dla agentów AI: [`docs/AGENTS.md`](docs/AGENTS.md),
- system wizualny: [`apps/web/config/design-tokens.css`](apps/web/config/design-tokens.css),
- eksporty panelu prowadzącego: [`docs/11-EKSPORTY-PANELU-PROWADZACEGO.md`](docs/11-EKSPORTY-PANELU-PROWADZACEGO.md),
- zasady dostępności i jakości: [`docs/07-TESTY-I-JAKOSC.md`](docs/07-TESTY-I-JAKOSC.md),
- konfiguracja bezpiecznego logowania: [`docs/14-UWIERZYTELNIANIE.md`](docs/14-UWIERZYTELNIANIE.md).

## Co zawiera projekt

- stronę startową `kia` z kafelkami przedmiotów,
- aktywne kursy: Narzędzia dla programistów, Algorytmy i struktury danych oraz Seminarium dyplomowe,
- materiały dla studiów stacjonarnych i niestacjonarnych,
- demonstracyjny quiz z licznikiem czasu, nawigacją i widokiem wyników,
- panel prowadzącego z uwierzytelnianiem przez zewnętrzne API,
- eksport wyników w formatach przydatnych do obsługi zajęć,
- opcjonalny szkielet backendu NestJS,
- dokumentację wdrożeniową w folderze `docs/`.

## Struktura repozytorium

```text
apps/web/   # frontend Next.js eksportowany statycznie na GitHub Pages
apps/api/   # opcjonalne API NestJS do integracji produkcyjnej
docs/       # dokumentacja projektu, wdrożenia, jakości i bezpieczeństwa
scripts/    # skrypty pomocnicze, m.in. generowanie wersji aplikacji
```

## Uwierzytelnianie

GitHub Pages hostuje statyczny frontend, natomiast dane logowania prowadzącego są weryfikowane przez zewnętrzne API NestJS. Sekret `AUTH_API_URL` konfiguruje adres usługi podczas wdrożenia. Login, skrót hasła, sól oraz klucz podpisujący token pozostają wyłącznie w zmiennych środowiskowych backendu. Szczegóły opisuje [`docs/14-UWIERZYTELNIANIE.md`](docs/14-UWIERZYTELNIANIE.md).

## Wymagania

- Node.js 22 LTS,
- npm 10 lub nowszy,
- repozytorium GitHub z włączonym GitHub Pages w trybie GitHub Actions.

## Szybki start lokalny

Zainstaluj zależności i uruchom frontend:

```bash
npm install
npm run dev -w apps/web
```

Otwórz `http://localhost:3000`.

Aby uruchomić jednocześnie frontend i opcjonalne API:

```bash
npm run dev
```

## Najważniejsze komendy

```bash
npm run dev -w apps/web       # tryb deweloperski frontendu
npm run start:dev -w apps/api # tryb deweloperski opcjonalnego API
npm run dev                  # frontend i API uruchomione równolegle
npm run build:pages          # generowanie wersji i eksport statyczny frontendu
npm run build                # build frontendu i API
npm run lint                 # kontrola typów i lint w workspace'ach
npm run prisma:generate      # generowanie klienta Prisma
npm run prisma:migrate       # uruchomienie migracji deweloperskich bazy danych
```

Wynik eksportu statycznego znajduje się w `apps/web/out`.

## Aktualna nawigacja

- `/` — strona startowa `kia` z listą przedmiotów i wejściem do panelu prowadzącego.
- `/kia.ndp/` — przedmiot „Narzędzia dla programistów”.
- `/kia.asid/` — przedmiot „Algorytmy i struktury danych”.
- `/kia.sd/` — przedmiot „Seminarium dyplomowe”.
- `/kia.dr/` — panel prowadzącego.
- `/quiz/demo/` — demonstracyjna wejściówka.
- `/wyniki/` — widok wyniku po zakończeniu quizu.
- `/materialy/` — statyczne materiały i pliki do pobrania.

## Publikacja na GitHub Pages

1. Utwórz puste repozytorium GitHub.
2. Skopiuj do niego zawartość projektu.
3. Wykonaj commit i push do gałęzi `main`.
4. W repozytorium wybierz `Settings → Pages`.
5. Ustaw `Source` na `GitHub Actions`.
6. Otwórz kartę `Actions` i sprawdź workflow `Deploy frontend to GitHub Pages`.

Workflow automatycznie wykrywa nazwę repozytorium, ustawia `basePath`, buduje stronę i publikuje katalog `apps/web/out`. Wersja aplikacji jest generowana automatycznie jako `1.0.<liczba-commitów>+<hash>`. Workflow wdrożeniowy wykonuje również `npm audit --audit-level=moderate` i przerywa publikację po wykryciu podatności co najmniej umiarkowanej.

## Pierwsze uruchomienie GitHub Pages

Przed pierwszym wdrożeniem ustaw w repozytorium:

```text
Settings -> Pages -> Build and deployment -> Source: GitHub Actions
```

Bez tego krok `actions/configure-pages` zwróci błąd `Get Pages site failed: Not Found`.

Szczegółowa diagnostyka znajduje się w [`docs/15-NAPRAWA-GITHUB-PAGES.md`](docs/15-NAPRAWA-GITHUB-PAGES.md).

## Mapa dokumentacji

- [`docs/01-START.md`](docs/01-START.md) — instalacja i pierwsze uruchomienie.
- [`docs/02-STRUKTURA-PROJEKTU.md`](docs/02-STRUKTURA-PROJEKTU.md) — przeznaczenie katalogów i plików.
- [`docs/03-TRESCI-I-DANE.md`](docs/03-TRESCI-I-DANE.md) — proponowana struktura kursów, materiałów, pytań i wyników.
- [`docs/04-GITHUB-PAGES.md`](docs/04-GITHUB-PAGES.md) — dokładna procedura publikacji i diagnostyka błędów.
- [`docs/05-ROZWOJ-FRONTENDU.md`](docs/05-ROZWOJ-FRONTENDU.md) — zasady rozbudowy interfejsu.
- [`docs/06-INTEGRACJA-BACKENDU.md`](docs/06-INTEGRACJA-BACKENDU.md) — przejście z demonstratora do systemu produkcyjnego.
- [`docs/07-TESTY-I-JAKOSC.md`](docs/07-TESTY-I-JAKOSC.md) — testy funkcjonalne, dostępność i kryteria odbioru.
- [`docs/08-BEZPIECZENSTWO-I-RODO.md`](docs/08-BEZPIECZENSTWO-I-RODO.md) — wymagania bezpieczeństwa i ochrony danych.
- [`docs/09-PLAN-WDROZENIA.md`](docs/09-PLAN-WDROZENIA.md) — kolejne etapy prac i definicje zakończenia.
- [`docs/14-UWIERZYTELNIANIE.md`](docs/14-UWIERZYTELNIANIE.md) — konfiguracja bezpiecznego logowania i sekretów.
- [`docs/15-NAPRAWA-GITHUB-PAGES.md`](docs/15-NAPRAWA-GITHUB-PAGES.md) — diagnostyka pierwszego wdrożenia GitHub Pages.
- [`docs/CHECKLIST.md`](docs/CHECKLIST.md) — skrócona lista kontrolna przed publikacją.
