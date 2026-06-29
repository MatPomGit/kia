# Wytyczne dla agentów AI pracujących nad systemem `ndp_tests`

## 1. Zakres

Dokument określa obowiązkowe zasady dla agentów AI modyfikujących kod, dokumentację, testy, konfigurację i dane demonstracyjne systemu `ndp_tests`.

## 2. Zasady nadrzędne

- Stosuj KISS. Wybieraj najprostsze rozwiązanie spełniające wymaganie.
- Nie stosuj nadmiernego inżynierowania. Nie dodawaj warstw, bibliotek, usług lub abstrakcji bez rzeczywistej potrzeby.
- Nie twórz funkcji „na przyszłość”, jeżeli nie wynikają z bieżącego zadania.
- Najpierw modyfikuj istniejący komponent lub funkcję; nowy moduł twórz dopiero, gdy wyraźnie poprawia czytelność albo usuwa duplikację.
- Nie używaj emotikon w interfejsie, kodzie, logach, komentarzach ani dokumentacji.

## 3. Poprawne pisanie kodu

Agent ma obowiązek:

- stosować ścisłe typowanie TypeScript i unikać `any`,
- używać jednoznacznych nazw i małych funkcji o pojedynczej odpowiedzialności,
- usuwać kod martwy, nieużywane importy i nieaktualne komentarze,
- walidować dane wejściowe i obsługiwać błędy,
- nigdy nie umieszczać sekretów, haseł, tokenów ani kluczy API w repozytorium lub statycznym bundlu,
- nie logować danych osobowych ani odpowiedzi studentów bez uzasadnienia,
- zachować zgodność frontendu z eksportem statycznym GitHub Pages,
- uruchomić kompilację i audyt zależności po zmianach.

## 4. Architektura

Kolejność preferowanych rozwiązań:

1. modyfikacja istniejącego kodu,
2. mała funkcja pomocnicza,
3. dane konfiguracyjne,
4. nowy moduł lub zależność tylko przy uzasadnionej potrzebie.

Bez wyraźnego wymagania zabronione są mikroserwisy, globalny menedżer stanu, własny framework komponentów i złożone wzorce projektowe.

## 5. Dostępność

Każdy element interfejsu ma spełniać WCAG 2.2 AA w zakresie właściwym dla funkcji:

- semantyczny HTML,
- pełna obsługa klawiaturą,
- widoczny fokus,
- poprawne etykiety formularzy,
- znaczenie niezależne od samego koloru,
- odpowiedni kontrast,
- czytelność przy powiększeniu 200%,
- komunikaty błędów dostępne dla technologii asystujących.

## 6. System wizualny

Kolory, typografia, rozmiary, odstępy, promienie i cienie muszą pochodzić z:

`apps/web/config/design-tokens.css`

Nie wolno wpisywać stałych wizualnych bezpośrednio w komponentach. Nowy token dodawaj tylko wtedy, gdy nie istnieje odpowiednik.

## 7. Uwierzytelnianie i sekrety

- GitHub Pages jest hostingiem statycznym i nie udostępnia sekretów w czasie działania strony.
- Nie wolno porównywać loginu lub hasła w kodzie przeglądarki ani osadzać skrótu hasła w bundlu.
- Formularz logowania ma wywoływać zabezpieczone API.
- Login, skrót hasła, sól i klucz podpisujący token muszą znajdować się wyłącznie w zmiennych środowiskowych backendu.
- GitHub Actions może przekazać do frontendu jedynie publiczny adres API. Zmienna `NEXT_PUBLIC_AUTH_API_URL` nie jest sekretem po kompilacji.
- Panel `kia.dr` musi weryfikować token sesji przez API przed wyświetleniem danych.

## 8. Dane, eksporty i prywatność

- Dane demonstracyjne oznaczaj jednoznacznie.
- Nie publikuj rzeczywistych wyników studentów w repozytorium ani katalogu `public`.
- Identyfikatory demonstracyjne maskuj.
- Telemetrii nie przedstawiaj jako automatycznego dowodu niesamodzielności.

## 9. Dokumentacja

Zmiana dotycząca uruchomienia, bezpieczeństwa, danych, publikacji lub architektury musi aktualizować odpowiedni plik w `docs/`. Dokumentacja ma opisywać stan faktyczny i zawierać konkretne komendy.

## 10. Kryteria zakończenia

```bash
npm ci
npm audit --audit-level=moderate
npm run build:pages
npm run build -w apps/api
```

Zmiana jest zakończona, gdy komendy przechodzą, dokumentacja odpowiada implementacji, a w kodzie nie ma sekretów ani nieoznaczonych rozwiązań tymczasowych.
