# 06. Integracja z backendem

## Kiedy backend jest wymagany

Backend jest obowiązkowy, gdy system ma obsługiwać:

- logowanie użytkowników,
- indywidualne uprawnienia,
- bezpieczny bank pytań,
- centralny zapis odpowiedzi i ocen,
- serwerowy limit czasu,
- raportowanie grup,
- log audytowy.

## Zalecana architektura

```text
GitHub Pages frontend
        │ HTTPS
        ▼
API NestJS / serverless
        │
        ├── PostgreSQL
        ├── magazyn plików
        └── dostawca tożsamości OIDC
```

## Minimalne endpointy

```text
GET    /api/me
GET    /api/courses
GET    /api/courses/:id/materials
POST   /api/quizzes/:id/attempts
GET    /api/attempts/:id
PUT    /api/attempts/:id/answers/:questionId
POST   /api/attempts/:id/finish
GET    /api/results
```

## Konfiguracja adresu API

Dodaj zmienną:

```env
NEXT_PUBLIC_API_URL=https://api.example.edu
```

W GitHub ustaw ją jako zmienną repozytorium albo wpisz publiczny adres w kroku build. Nie umieszczaj kluczy prywatnych w zmiennych zaczynających się od `NEXT_PUBLIC_`.

## CORS

Backend powinien dopuszczać wyłącznie właściwe domeny:

```text
https://NAZWA_KONTA.github.io
https://wlasna-domena.example
```

Nie używaj `Access-Control-Allow-Origin: *` dla uwierzytelnionego systemu oceniania.

## Kolejność implementacji

1. endpoint stanu zdrowia,
2. logowanie i `/api/me`,
3. kursy i materiały,
4. rozpoczęcie próby,
5. zapis odpowiedzi,
6. atomowe zakończenie próby,
7. wyniki i panel prowadzącego,
8. logi oraz monitoring.

## Aktualny szkielet zapisu telemetrii

Backend zawiera roboczy, pamięciowy zapis paczek telemetrii pod adresem:

```text
POST /api/attempts/:attemptId/events/batch
```

Implementacja waliduje format identyfikatora próby, limit 500 zdarzeń w paczce oraz monotoniczną sekwencję `seqStart`. Ponowne wysłanie już przyjętej paczki jest traktowane idempotentnie i zwraca bieżący `nextSequence`, a próba dopisania zdarzeń po zakończeniu próby zwraca konflikt.

Zakończenie próby jest dostępne pod adresem:

```text
POST /api/attempts/:attemptId/finish
```

Aktualnie endpoint oznacza próbę jako zakończoną i zwraca liczbę zapisanych zdarzeń telemetrii. Wynik pozostaje `null`, ponieważ klucz odpowiedzi i właściwe obliczanie punktów muszą zostać przeniesione do trwałej warstwy serwerowej przed użyciem produkcyjnym.

Przed wdrożeniem produkcyjnym pamięciowy magazyn należy zastąpić transakcyjnym zapisem w bazie danych z unikalnością po `attemptId` i numerze sekwencji, autoryzacją właściciela próby oraz rate limitingiem.

Rozszerzona walidacja odrzuca pola telemetrii niezgodne z aktualnym kontraktem frontendu:

- `pointer_sample`: `x`, `y`, `buttons`,
- `key_meta`: `category`, `code`, `repeat`,
- `visibility`: `state`.

Dla każdej próby obowiązuje także limit liczby zdarzeń w całej próbie oraz prosty limit liczby paczek w ruchomym oknie czasowym. Limity te chronią demonstracyjne API przed przypadkowym zalaniem telemetrią, ale nie zastępują docelowego limitowania na poziomie bramy API, użytkownika i adresu IP.
