# 07. Testy i jakość

## Testy minimalne przed publikacją

- strona główna otwiera się bez błędów konsoli,
- wszystkie pozycje menu działają,
- quiz umożliwia wybór i zmianę odpowiedzi,
- licznik czasu maleje co sekundę,
- widok jest czytelny przy szerokości 375 px,
- eksport statyczny kończy się powodzeniem,
- strona działa pod ścieżką repozytorium.

## Zalecane poziomy testów

### Jednostkowe

Testuj funkcje niezależne, np. formatowanie czasu, klasyfikację klawiszy i mapowanie statusów.

### Komponentowe

Testuj przyciski, formularze odpowiedzi, nawigację pytań i komunikaty.

### E2E

Zastosuj Playwright dla scenariuszy:

1. wejście na pulpit,
2. uruchomienie quizu,
3. odpowiedź na wszystkie pytania,
4. przejście do ostatniego pytania,
5. zakończenie próby.

## Dostępność

Docelowo spełnij WCAG 2.2 AA. Sprawdź:

- pełną obsługę klawiaturą,
- widoczny fokus,
- kontrast tekstu,
- poprawną hierarchię nagłówków,
- etykiety pól formularzy,
- tekst alternatywny dla grafik,
- zachowanie przy powiększeniu 200%.

## Wydajność

Uruchom Lighthouse dla wersji opublikowanej. Cel dla demonstratora:

- Performance ≥ 85,
- Accessibility ≥ 95,
- Best Practices ≥ 90,
- SEO ≥ 90.
