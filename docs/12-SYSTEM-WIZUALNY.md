# System wizualny i tokeny projektowe

## Źródło wartości

Wszystkie wspólne wartości wyglądu frontendu znajdują się w:

```text
apps/web/config/design-tokens.css
```

Plik jest importowany przez:

```text
apps/web/app/globals.css
```

## Kategorie tokenów

- kolory tła, tekstu, obramowań i stanów,
- kolory fokusu i kontrastowe warianty komunikatów,
- rodziny i rozmiary czcionek,
- grubości tekstu,
- wysokości linii,
- promienie zaokrągleń,
- cienie,
- maksymalna szerokość treści,
- wysokość nagłówka.

## Zasady modyfikacji

1. Najpierw znajdź istniejący token o właściwym znaczeniu.
2. Nie twórz tokenu tylko dlatego, że pojedynczy komponent potrzebuje nieznacznie innej wartości.
3. Nowy token nazwij według funkcji, nie według miejsca użycia.
4. Nie wpisuj kolorów i stałych rozmiarów bezpośrednio w komponentach.
5. Style inline są dopuszczalne wyłącznie dla wartości dynamicznych, na przykład szerokości paska postępu.
6. Po zmianie koloru sprawdź kontrast WCAG 2.2 AA.
7. Po zmianie typografii sprawdź interfejs przy powiększeniu 200%.

## Przykład

Poprawnie:

```css
.alert {
  color: var(--color-warning);
  background: var(--color-warning-soft);
}
```

Niepoprawnie:

```css
.alert {
  color: #87520f;
  background: #fff4df;
}
```

## Kryteria odbioru

- brak powielonych wartości kolorów poza plikiem tokenów,
- nagłówki i tekst używają zdefiniowanej skali,
- fokus jest widoczny,
- elementy nie tracą czytelności przy powiększeniu,
- zmiana tokenu wpływa spójnie na wszystkie używające go elementy.
