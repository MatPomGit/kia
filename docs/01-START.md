# 01. Instalacja i pierwsze uruchomienie

## Cel

Uruchomienie demonstratora lokalnie oraz sprawdzenie, czy projekt może zostać poprawnie wyeksportowany jako statyczna strona.

## Wymagania

- Git 2.40 lub nowszy,
- Node.js 22 LTS,
- npm 10 lub nowszy,
- system Windows, Linux albo macOS.

Sprawdzenie wersji:

```bash
node --version
npm --version
git --version
```

## Instalacja

```bash
git clone ADRES_REPOZYTORIUM
cd NAZWA_REPOZYTORIUM
npm install
```

Nie dodawaj katalogów `node_modules` do repozytorium.

## Uruchomienie frontendu

```bash
npm run dev -w apps/web
```

Otwórz `http://localhost:3000` i sprawdź kolejno:

1. pulpit,
2. materiały,
3. wyniki,
4. panel prowadzącego,
5. instrukcję,
6. quiz demonstracyjny.

## Test eksportu statycznego

```bash
npm run build:pages
```

Kryterium powodzenia:

- komenda kończy się kodem `0`,
- istnieje katalog `apps/web/out`,
- w katalogu znajduje się `index.html`,
- podstrony mają własne katalogi i pliki `index.html`.

## Test ścieżki repozytorium

Dla repozytorium projektowego, np. `wejsciowki`, wykonaj:

```bash
NEXT_PUBLIC_BASE_PATH=/wejsciowki npm run build:pages
```

Na Windows PowerShell:

```powershell
$env:NEXT_PUBLIC_BASE_PATH="/wejsciowki"
npm run build:pages
```

## Definicja zakończenia etapu

Etap jest zakończony, gdy wszystkie widoki otwierają się lokalnie, nawigacja działa, a eksport statyczny nie zgłasza błędów.
