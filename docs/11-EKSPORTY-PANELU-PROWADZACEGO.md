# Eksport wyników, logów i instrukcji projektu

## Stan obecny

Statyczny frontend udostępnia w panelu prowadzącego trzy pliki demonstracyjne:

- `ndp_tests_wyniki_demo.csv`,
- `ndp_tests_wyniki_demo.pdf`,
- `ndp_tests_instrukcja_projektowa.pdf`.

Pliki znajdują się w:

```text
apps/web/public/downloads/
```

Komponent odpowiedzialny za odnośniki:

```text
apps/web/app/prowadzacy/ExportPanel.tsx
```

## Format CSV

CSV ma kodowanie UTF-8 z BOM i separator średnikowy. Zalecane kolumny:

```text
student_id_masked;course;quiz;started_at;finished_at;score;max_score;duration_seconds;tab_hidden_count;status
```

Nie należy eksportować pełnych danych osobowych bez wyraźnej podstawy prawnej i kontroli uprawnień.

## Format PDF

Raport PDF powinien zawierać:

- nazwę systemu,
- datę wygenerowania,
- kurs i zakres danych,
- informację, czy dane są demonstracyjne,
- tabelę wyników,
- objaśnienie pól telemetrii,
- zastrzeżenie, że telemetria nie jest automatycznym dowodem niesamodzielności.

## Wersja produkcyjna

W systemie produkcyjnym plików z wynikami nie należy przechowywać w publicznym katalogu GitHub Pages. Powinny być generowane po stronie backendu po sprawdzeniu uprawnień.

Rekomendowane endpointy:

```text
GET /api/courses/:courseId/exports/results.csv
GET /api/courses/:courseId/exports/results.pdf
GET /api/project-guide.pdf
```

Backend powinien:

1. zweryfikować sesję użytkownika,
2. sprawdzić rolę prowadzącego,
3. sprawdzić przypisanie do kursu,
4. ograniczyć zakres danych,
5. zarejestrować pobranie w dzienniku audytowym,
6. zwrócić plik z poprawnym `Content-Type` i `Content-Disposition`.

## Kryteria odbioru

- plik otwiera się po wdrożeniu pod ścieżką repozytorium,
- nazwa pliku jest czytelna,
- CSV poprawnie otwiera się w arkuszu kalkulacyjnym,
- PDF nie ma uciętych treści,
- pliki demonstracyjne są jednoznacznie oznaczone,
- publiczne repozytorium nie zawiera rzeczywistych wyników studentów.
