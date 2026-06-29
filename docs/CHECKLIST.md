# Checklista publikacji i wdrożenia

## GitHub Pages

- [ ] Repozytorium ma gałąź `main`.
- [ ] `Settings → Pages → Source` ustawiono na `GitHub Actions`.
- [ ] Workflow kończy się powodzeniem.
- [ ] Strona działa pod właściwym adresem.
- [ ] Style i skrypty ładują się poprawnie.
- [ ] Wszystkie odnośniki wewnętrzne działają.

## Treść

- [ ] Usunięto dane osobowe i przypadkowe dane testowe.
- [ ] Opisy kursów i wejściówek są aktualne.
- [ ] Materiały mają poprawne nazwy i formaty.
- [ ] Instrukcja studenta jest zgodna z rzeczywistym procesem.
- [ ] Wyraźnie oznaczono tryb demonstracyjny.

## Jakość

- [ ] `npm run build:pages` przechodzi lokalnie.
- [ ] Brak istotnych błędów w konsoli.
- [ ] Widok mobilny został sprawdzony.
- [ ] Nawigacja działa z klawiatury.
- [ ] Fokus jest widoczny.
- [ ] Kontrast jest wystarczający.

## Przed użyciem produkcyjnym

- [ ] OIDC/SSO i mapowanie ról.
- [ ] Autoryzacja per kurs, próba i student.
- [ ] Klucz odpowiedzi wyłącznie po stronie serwera.
- [ ] Serwerowy timer i atomowe zakończenie próby.
- [ ] Idempotentny autosave.
- [ ] Rate limiting i walidacja API.
- [ ] CSP, HSTS, ochrona CSRF i bezpieczne cookies.
- [ ] Polityka retencji danych i dokumentacja RODO.
- [ ] Testy jednostkowe, integracyjne i E2E.
- [ ] Backup, monitoring i procedura incydentowa.
