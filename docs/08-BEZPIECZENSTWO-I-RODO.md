# 08. Bezpieczeństwo i ochrona danych

## Ograniczenia wersji statycznej

Wszystko, co trafia do JavaScriptu przeglądarki, może zostać odczytane lub zmodyfikowane przez użytkownika. Dlatego frontend statyczny nie może przechowywać:

- klucza poprawnych odpowiedzi,
- sekretów API,
- prywatnych danych studentów,
- wiarygodnego wyniku końcowego,
- reguł uprawnień wymagających ochrony.

## Dane osobowe

Przed wdrożeniem produkcyjnym określ:

- administratora danych,
- podstawę prawną przetwarzania,
- zakres danych,
- okres retencji,
- odbiorców danych,
- procedurę realizacji praw osób,
- zasady obsługi incydentów.

## Telemetria

Telemetria nie powinna być automatycznym dowodem niesamodzielności. Należy:

- ograniczyć zakres do minimum,
- poinformować użytkownika przed rozpoczęciem,
- ustalić retencję,
- zapewnić kontrolę prowadzącego,
- nie rejestrować treści wpisywanych znaków,
- udokumentować cel i proporcjonalność przetwarzania.

## Wymagania techniczne backendu

- TLS dla całej komunikacji,
- OIDC/OAuth2 lub bezpieczne sesje,
- autoryzacja per kurs i próba,
- rate limiting,
- walidacja danych wejściowych,
- centralne logowanie błędów,
- backup i test odtwarzania,
- rotacja sekretów,
- aktualizacje zależności.
