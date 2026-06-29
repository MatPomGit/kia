# Naprawa wdrożenia GitHub Pages

## Objawy

Workflow zatrzymuje się na kroku `actions/configure-pages` z komunikatem:

```text
Get Pages site failed
Not Found
```

## Przyczyna

Repozytorium nie ma jeszcze aktywowanej usługi GitHub Pages albo jako źródło publikacji nie wybrano `GitHub Actions`.

Standardowy `GITHUB_TOKEN` używany przez workflow nie może samodzielnie utworzyć konfiguracji Pages dla repozytorium. Z tego powodu witrynę należy aktywować jednorazowo w ustawieniach repozytorium.

## Jednorazowa konfiguracja repozytorium

1. Otwórz repozytorium na GitHub.
2. Przejdź do `Settings`.
3. W menu bocznym wybierz `Pages`.
4. W sekcji `Build and deployment` ustaw:

```text
Source: GitHub Actions
```

5. Zapisz ustawienie, jeżeli GitHub wyświetli przycisk zapisu.
6. Przejdź do `Actions`.
7. Otwórz workflow `Deploy frontend to GitHub Pages`.
8. Wybierz `Run workflow` albo wykonaj nowy commit do gałęzi `main`.

## Wymagane ustawienia Actions

W `Settings -> Actions -> General` ustaw:

```text
Workflow permissions: Read and write permissions
```

Jeżeli organizacja wymusza bardziej restrykcyjne zasady, workflow nadal wymaga co najmniej:

```yaml
permissions:
  contents: read
  pages: write
  id-token: write
```

## Node.js 24

Workflow używa akcji zgodnych z Node.js 24:

- `actions/checkout@v7`,
- `actions/setup-node@v6`,
- `actions/configure-pages@v6`,
- `actions/upload-pages-artifact@v5`,
- `actions/deploy-pages@v4`.

Nie należy dodawać zmiennej:

```text
ACTIONS_ALLOW_USE_UNSECURE_NODE_VERSION=true
```

Jest to obejście tymczasowe, a nie naprawa.

## Kontrola po wdrożeniu

Workflow powinien wykonać kolejno:

1. checkout repozytorium,
2. konfigurację Pages,
3. instalację Node.js 24,
4. instalację zależności,
5. audyt bezpieczeństwa,
6. statyczny build frontendu,
7. przesłanie artefaktu,
8. publikację środowiska `github-pages`.

Po zakończeniu adres witryny będzie widoczny w:

```text
Settings -> Pages
```

oraz w podsumowaniu zadania `deploy`.

## Alternatywa automatyczna

Akcja `configure-pages` może próbować aktywować Pages przez parametr `enablement: true`, ale wymaga osobnego tokenu PAT albo tokenu GitHub App z uprawnieniami administracyjnymi i Pages. Dla tego projektu nie jest to zalecane. Jednorazowa aktywacja ręczna jest prostsza, bezpieczniejsza i zgodna z zasadą KISS.
