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
