# Agenci AI i standardy wytwarzania

## Cel

Dokument opisuje sposób używania agentów AI w repozytorium `ndp_tests`. Nadrzędne i obowiązujące reguły znajdują się w pliku [`../agents.md`](../agents.md).

## Procedura przed rozpoczęciem zadania

1. Przeczytaj `agents.md`.
2. Zidentyfikuj najmniejszy zestaw plików wymagających zmiany.
3. Sprawdź istniejące komponenty, funkcje i tokeny wizualne.
4. Nie dodawaj zależności, dopóki nie wykażesz, że rozwiązanie bez zależności jest niewystarczające.
5. Zapisz kryteria ukończenia zadania.

## Procedura implementacji

1. Wprowadź najmniejszą poprawną zmianę.
2. Zachowaj typowanie ścisłe TypeScript.
3. Używaj semantycznego HTML.
4. Korzystaj z tokenów w `apps/web/config/design-tokens.css`.
5. Nie umieszczaj danych rzeczywistych studentów w repozytorium.
6. Nie używaj emotikon.
7. Zaktualizuj dokumentację, jeżeli zmienia się sposób użycia lub uruchomienia.

## Procedura odbioru

Uruchom:

```bash
npm install
npm run build:pages
```

Dla backendu:

```bash
npm run build -w apps/api
```

Następnie sprawdź:

- obsługę klawiaturą,
- widoczność fokusu,
- brak nowych błędów konsoli,
- działanie odnośników pod ścieżką bazową GitHub Pages,
- zgodność dokumentacji z kodem.

## Zakazane praktyki

- przebudowa architektury bez potrzeby,
- dodawanie abstrakcji dla pojedynczego przypadku,
- kopiowanie tych samych wartości kolorów i rozmiarów do komponentów,
- dodawanie bibliotek dla prostych operacji możliwych w standardowym API przeglądarki,
- tworzenie pozornie działających funkcji bez wyraźnego oznaczenia trybu demonstracyjnego.
