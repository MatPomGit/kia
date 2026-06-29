# Nawigacja i wersjonowanie kia

## Widoki

- `/` — strona startowa `kia`, zawiera wyłącznie wybór przedmiotu i wejście do panelu prowadzącego.
- `/kia.ndp/` — przedmiot „Narzędzia dla programistów”.
- `/kia.dr/` — panel prowadzącego; w demonstratorze formularz logowania działa lokalnie.

Pozostałe przedmioty są widoczne jako zablokowane. Odblokowanie wymaga ustawienia `available: true` i wskazania docelowej trasy w `apps/web/app/page.tsx`.

## Wersja aplikacji

Przed każdym buildem skrypt `scripts/generate-version.mjs` tworzy wersję:

```text
1.0.<liczba-commitów>+<skrót-hash>
```

Przykład: `1.0.42+a1b2c3d`. Liczba commitów zwiększa się automatycznie po każdym commicie. Workflow GitHub Actions pobiera pełną historię (`fetch-depth: 0`), dlatego licznik jest wiarygodny.

## Logowanie

Logowanie na statycznym GitHub Pages jest wyłącznie demonstracyjne. Nie wolno umieszczać prawdziwych haseł, tokenów ani list użytkowników w kodzie frontendu. Wdrożenie produkcyjne wymaga backendu, bezpiecznych sesji i kontroli uprawnień.
