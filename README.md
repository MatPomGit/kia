# ndp_tests — GitHub Pages

Statyczny demonstrator platformy dydaktycznej przygotowany w Next.js, React i TypeScript. Frontend jest eksportowany do zwykłych plików HTML, CSS i JavaScript, a następnie publikowany automatycznie przez GitHub Actions.

## Standardy projektu

- obowiązkowe wytyczne dla agentów AI: [`docs/AGENTS.md`](docs/AGENTS.md),
- system wizualny: [`apps/web/config/design-tokens.css`](apps/web/config/design-tokens.css),
- eksporty panelu prowadzącego: [`docs/11-EKSPORTY-PANELU-PROWADZACEGO.md`](docs/11-EKSPORTY-PANELU-PROWADZACEGO.md),
- zasady dostępności i jakości: [`docs/07-TESTY-I-JAKOSC.md`](docs/07-TESTY-I-JAKOSC.md).


## Co zawiera projekt

- pulpit studenta z listą wejściówek i materiałów,
- demonstracyjny quiz z licznikiem czasu i nawigacją,
- widok wyników,
- panel prowadzącego z uwierzytelnianiem przez zewnętrzne API,
- instrukcję dla studenta i prowadzącego,
- opcjonalny szkielet backendu NestJS,
- dokumentację wdrożeniową w folderze `docs/`.

## Uwierzytelnianie

GitHub Pages hostuje statyczny frontend, natomiast dane logowania są weryfikowane przez zewnętrzne API NestJS. Sekret `AUTH_API_URL` konfiguruje adres usługi podczas wdrożenia. Login, skrót hasła, sól oraz klucz podpisujący token pozostają wyłącznie w zmiennych środowiskowych backendu. Szczegóły: `docs/14-UWIERZYTELNIANIE.md`.

## Szybki start lokalny

Wymagania: Node.js 22 LTS i npm 10 lub nowszy.

```bash
npm install
npm run dev -w apps/web
```

Otwórz `http://localhost:3000`.

## Publikacja na GitHub Pages

1. Utwórz puste repozytorium GitHub.
2. Skopiuj do niego zawartość paczki.
3. Wykonaj commit i push do gałęzi `main`.
4. W repozytorium wybierz `Settings → Pages`.
5. Ustaw `Source` na `GitHub Actions`.
6. Otwórz kartę `Actions` i sprawdź workflow `Deploy frontend to GitHub Pages`.

Workflow automatycznie wykrywa nazwę repozytorium, ustawia `basePath`, buduje stronę i publikuje katalog `apps/web/out`.

## Mapa dokumentacji

- `docs/01-START.md` — instalacja i pierwsze uruchomienie.
- `docs/02-STRUKTURA-PROJEKTU.md` — przeznaczenie katalogów i plików.
- `docs/03-TRESCI-I-DANE.md` — proponowana struktura kursów, materiałów, pytań i wyników.
- `docs/04-GITHUB-PAGES.md` — dokładna procedura publikacji i diagnostyka błędów.
- `docs/05-ROZWOJ-FRONTENDU.md` — zasady rozbudowy interfejsu.
- `docs/06-INTEGRACJA-BACKENDU.md` — przejście z demonstratora do systemu produkcyjnego.
- `docs/07-TESTY-I-JAKOSC.md` — testy funkcjonalne, dostępność i kryteria odbioru.
- `docs/08-BEZPIECZENSTWO-I-RODO.md` — wymagania bezpieczeństwa i ochrony danych.
- `docs/09-PLAN-WDROZENIA.md` — kolejne etapy prac i definicje zakończenia.
- `docs/14-UWIERZYTELNIANIE.md` — konfiguracja bezpiecznego logowania i sekretów.
- `docs/CHECKLIST.md` — skrócona lista kontrolna przed publikacją.

## Najważniejsze komendy

```bash
npm run dev -w apps/web       # tryb deweloperski
npm run build:pages           # eksport statyczny
npm run build -w apps/api     # kompilacja opcjonalnego API
```

Wynik eksportu statycznego znajduje się w `apps/web/out`.

## Aktualna nawigacja

- `/` — strona startowa `kia`.
- `/kia.ndp/` — przedmiot „Narzędzia dla programistów”.
- `/kia.dr/` — panel prowadzącego.

Wersja aplikacji jest generowana automatycznie jako `1.0.<liczba-commitów>+<hash>`. Workflow wdrożeniowy wykonuje również `npm audit --audit-level=moderate` i przerywa publikację po wykryciu podatności co najmniej umiarkowanej.

## Pierwsze uruchomienie GitHub Pages

Przed pierwszym wdrożeniem ustaw w repozytorium:

```text
Settings -> Pages -> Build and deployment -> Source: GitHub Actions
```

Bez tego krok `actions/configure-pages` zwróci błąd `Get Pages site failed: Not Found`.

Szczegółowa diagnostyka znajduje się w `docs/15-NAPRAWA-GITHUB-PAGES.md`.
