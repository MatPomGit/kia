# 05. Rozwój frontendu

## Dodanie nowej podstrony

1. Utwórz katalog w `apps/web/app/`, np. `regulamin/`.
2. Dodaj plik `page.tsx`.
3. Użyj komponentu `Header`.
4. Nadaj głównemu elementowi `id="main"`.
5. Dodaj odnośnik do nawigacji, jeżeli widok ma być globalnie dostępny.
6. Uruchom `npm run build:pages`.

Przykład:

```tsx
import { Header } from "@/components/Header";

export default function RegulationsPage() {
  return (
    <div className="shell">
      <Header />
      <main id="main" className="container">
        <h1>Regulamin</h1>
      </main>
    </div>
  );
}
```

## Dodanie materiału

1. Skopiuj plik do `apps/web/public/materials/...`.
2. Dodaj metadane do źródła danych.
3. Uzupełnij tytuł, format, datę publikacji i opis.
4. Sprawdź działanie odnośnika po eksporcie statycznym.

## Zasady komponentów

- nazwy komponentów zapisuj w PascalCase,
- preferuj komponenty krótsze niż około 200 linii,
- nie duplikuj nagłówków, przycisków, tabel i komunikatów,
- elementy interaktywne muszą być dostępne z klawiatury,
- każdy formularz musi mieć etykiety i czytelne komunikaty błędów.

## Zarządzanie stanem

Dla demonstratora wystarcza `useState`. Po podłączeniu API rozważ:

- React Query lub SWR do danych serwerowych,
- Context tylko dla niewielkiego stanu globalnego,
- osobny mechanizm autosave dla odpowiedzi quizowych.

## Kryteria odbioru nowej funkcji

- działa lokalnie,
- działa po eksporcie statycznym,
- nie zawiera sekretów,
- obsługuje urządzenia mobilne,
- jest dostępna klawiaturowo,
- ma opis w dokumentacji.
