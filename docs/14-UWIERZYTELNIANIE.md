# Uwierzytelnianie panelu prowadzącego

## Dlaczego sam GitHub Pages nie wystarcza

GitHub Pages publikuje wyłącznie statyczne pliki HTML, CSS i JavaScript. Sekrety GitHub Actions są dostępne podczas buildu, ale każda wartość wpisana do kodu frontendu staje się publiczna po publikacji. Z tego powodu loginu, hasła, skrótu hasła ani klucza tokenu nie wolno przekazywać do `NEXT_PUBLIC_*`.

## Zastosowana struktura

- GitHub Pages hostuje formularz logowania i panel.
- Sekret repozytorium `AUTH_API_URL` wskazuje publiczny adres zabezpieczonego API.
- Backend porównuje login oraz skrót hasła zapisane w jego zmiennych środowiskowych.
- Po poprawnym logowaniu backend wystawia podpisany token ważny 60 minut.
- Frontend przechowuje token w `sessionStorage` i weryfikuje go przed wyświetleniem `kia.dr`.

## Sekret GitHub Pages

W repozytorium GitHub przejdź do `Settings -> Secrets and variables -> Actions` i dodaj:

```text
AUTH_API_URL=https://adres-backendu.example/api
```

Workflow przekazuje tę wartość jako `NEXT_PUBLIC_AUTH_API_URL`. Adres API nie jest poufny; sekret zapobiega jedynie wpisywaniu konfiguracji wdrożeniowej do repozytorium.

## Sekrety backendu

Backend wymaga:

```text
INSTRUCTOR_LOGIN=prowadzacy
INSTRUCTOR_PASSWORD_SALT=<losowa-sól>
INSTRUCTOR_PASSWORD_HASH=<skrót-scrypt-w-hex>
AUTH_TOKEN_SECRET=<co-najmniej-32-losowe-bajty>
CORS_ORIGINS=https://OWNER.github.io
```

Wygenerowanie soli, skrótu i klucza:

```bash
node -e "const c=require('node:crypto'); const salt=c.randomBytes(16).toString('hex'); const password=process.argv[1]; console.log('INSTRUCTOR_PASSWORD_SALT='+salt); console.log('INSTRUCTOR_PASSWORD_HASH='+c.scryptSync(password,salt,64).toString('hex')); console.log('AUTH_TOKEN_SECRET='+c.randomBytes(48).toString('hex'));" 'TU_WPISZ_SILNE_HASLO'
```

Nie zapisuj wygenerowanych wartości w repozytorium.

## Endpointy

```text
POST /api/auth/login
GET  /api/auth/verify
```

`POST /api/auth/login` przyjmuje:

```json
{"login":"prowadzacy","password":"hasło"}
```

`GET /api/auth/verify` wymaga nagłówka:

```text
Authorization: Bearer <token>
```

## Ograniczenie dostępu do danych

Sama kontrola widoku w przeglądarce nie może chronić danych umieszczonych w katalogu `public`. W wersji produkcyjnej rzeczywiste wyniki, logi i raporty muszą być pobierane z chronionych endpointów backendu. Pliki demonstracyjne w repozytorium nie mogą zawierać danych studentów.
