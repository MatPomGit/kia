# 04. Publikacja na GitHub Pages

## Konfiguracja zastosowana w projekcie

Frontend korzysta z `output: "export"`. Zmienna `NEXT_PUBLIC_BASE_PATH` określa podkatalog publikacji:

- pusta wartość dla `https://konto.github.io/`,
- `/repozytorium` dla `https://konto.github.io/repozytorium/`.

Workflow `.github/workflows/deploy-pages.yml` ustala tę wartość automatycznie.

## Dokładna procedura

1. Utwórz repozytorium bez automatycznego README.
2. W katalogu projektu wykonaj:

```bash
git init
git add .
git commit -m "Initial GitHub Pages version"
git branch -M main
git remote add origin ADRES_REPOZYTORIUM
git push -u origin main
```

3. W GitHub przejdź do `Settings → Pages`.
4. W sekcji `Build and deployment` wybierz `GitHub Actions`.
5. Przejdź do `Actions` i otwórz ostatnie uruchomienie.
6. Po zakończeniu użyj adresu podanego w kroku `deploy`.

## Aktualizacja strony

Każdy push do `main` uruchamia nowe wdrożenie:

```bash
git add .
git commit -m "Update course content"
git push
```

## Najczęstsze problemy

### Strona wyświetla 404

Sprawdź:

- czy źródłem Pages jest `GitHub Actions`,
- czy workflow zakończył się powodzeniem,
- czy repozytorium ma gałąź `main`,
- czy adres zawiera nazwę repozytorium.

### Brak stylów lub skryptów

Najczęstszą przyczyną jest błędny `basePath`. Nie wpisuj go ręcznie w workflow, chyba że publikujesz pod niestandardową domeną.

### Odnośniki działają lokalnie, ale nie na Pages

- dla podstron używaj `next/link`,
- nie twórz bezwzględnych odnośników zaczynających się od domeny lokalnej,
- po zmianie nazwy repozytorium uruchom ponownie workflow.

### Niestandardowa domena

Dodaj domenę w `Settings → Pages`, skonfiguruj DNS i rozważ usunięcie `basePath`. Wymaga to osobnego testu wdrożeniowego.
