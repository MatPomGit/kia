# 02. Struktura projektu

## Struktura główna

```text
.
├── .github/workflows/        # automatyzacja publikacji
├── apps/
│   ├── web/                  # frontend statyczny
│   └── api/                  # opcjonalny backend NestJS
├── docs/                     # dokumentacja projektowa
├── packages/database/        # schemat bazy danych, jeżeli zostanie użyty
├── .env.example              # wzór zmiennych środowiskowych
├── docker-compose.yml        # usługi lokalne dla wariantu backendowego
└── package.json              # workspace i komendy główne
```

## Frontend

```text
apps/web/
├── app/
│   ├── page.tsx              # pulpit
│   ├── instrukcja/           # instrukcja użytkownika
│   ├── materialy/            # lista materiałów
│   ├── prowadzacy/           # panel prowadzącego
│   ├── quiz/demo/            # demonstracyjny quiz
│   └── wyniki/               # wyniki studenta
├── components/               # współdzielone komponenty
├── lib/                      # funkcje pomocnicze i statyczne dane kursów
├── public/                   # statyczne pliki publiczne
├── globals.css               # style globalne
└── next.config.mjs           # eksport statyczny i basePath
```

## Zalecana rozbudowa

Przy wzroście projektu dodaj:

```text
apps/web/
├── data/                     # dane demonstracyjne JSON/TS
├── types/                    # typy domenowe TypeScript
├── services/                 # klient API i warstwa dostępu do danych
├── hooks/                    # współdzielone hooki React
├── components/ui/            # elementy interfejsu ogólnego
└── components/domain/        # komponenty kursów, quizów i wyników
```

## Zasady odpowiedzialności

- komponent nie powinien równocześnie pobierać danych, walidować domeny i renderować rozbudowanego interfejsu,
- dane demonstracyjne widoków kursów należy utrzymywać poza plikami `page.tsx`, obecnie w `apps/web/lib/courses.ts`,
- typy domenowe kursów, quizów, pytań, podejść i wyników należy utrzymywać w jednym miejscu,
- konfiguracja adresów API nie może być wpisana na stałe w komponentach.
