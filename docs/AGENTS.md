# Wytyczne dla agentów AI

## 1. Cel dokumentu

Ten plik określa obowiązkowe zasady pracy agentów AI generujących, analizujących lub modyfikujących kod, dokumentację, testy, dane demonstracyjne i konfigurację systemu.

Agent ma wykonywać wyłącznie zmiany potrzebne do realizacji zadania. Nie wolno rozbudowywać architektury bez uzasadnionej potrzeby biznesowej, technicznej lub bezpieczeństwa.

## 2. Zasady nadrzędne

- Stosuj KISS: wybieraj najprostsze rozwiązanie, które spełnia wymagania i jest możliwe do utrzymania.
- Nie stosuj nadmiernego inżynierowania. Nie dodawaj nowych warstw, abstrakcji, bibliotek, usług, wzorców projektowych ani narzędzi, jeżeli istniejący kod pozwala rozwiązać problem prościej.
- Nie twórz funkcjonalności „na przyszłość”, jeżeli nie wynika ona z aktualnego wymagania.
- Zachowuj spójność z istniejącą strukturą repozytorium.
- Najpierw wykorzystuj istniejące komponenty i funkcje. Nowy komponent twórz dopiero wtedy, gdy realnie ogranicza duplikację lub poprawia czytelność.
- Każda zmiana musi być możliwa do wyjaśnienia jednym zdaniem: jaki problem rozwiązuje i dlaczego jest potrzebna.
- Nie używaj emotikon w interfejsie, kodzie, komunikatach, komentarzach, logach ani dokumentacji.

## 3. Poprawne pisanie kodu

Agent ma obowiązek:

- pisać kod czytelny, jednoznaczny i zgodny z konwencjami TypeScript, React, Next.js i NestJS,
- używać trybu ścisłego TypeScript i unikać `any`, chyba że jego użycie jest wyraźnie uzasadnione,
- nadawać funkcjom, zmiennym, typom i komponentom nazwy opisujące ich odpowiedzialność,
- utrzymywać funkcje małe i skupione na jednej odpowiedzialności,
- usuwać kod martwy, nieużywane importy i nieaktualne komentarze,
- obsługiwać błędy w miejscu, w którym mogą zostać sensownie zakomunikowane użytkownikowi albo zalogowane,
- nie umieszczać sekretów, tokenów, haseł ani kluczy API w kodzie źródłowym,
- walidować dane pochodzące od użytkownika i z API,
- nie logować danych osobowych, odpowiedzi studentów ani pełnych identyfikatorów bez uzasadnienia,
- zachować kompatybilność statycznego eksportu frontendu z GitHub Pages,
- uruchomić kontrolę typów i kompilację po zmianach.

## 4. Architektura i zakres zmian

Przed zmianą agent powinien sprawdzić, czy problem można rozwiązać przez:

1. modyfikację istniejącego komponentu,
2. dodanie małej funkcji pomocniczej,
3. dodanie danych konfiguracyjnych,
4. dopiero na końcu - utworzenie nowego modułu lub zależności.

Zabronione bez wyraźnego wymagania:

- wprowadzanie mikroserwisów,
- dodawanie globalnego menedżera stanu,
- tworzenie własnego systemu komponentów,
- dodawanie złożonych wzorców fabryk, repozytoriów, mediatorów lub kontenerów DI po stronie frontendu,
- dodawanie bibliotek tylko dla pojedynczej prostej operacji,
- przebudowa całego projektu podczas realizacji lokalnej poprawki.

## 5. Dostępność

Każdy nowy lub zmodyfikowany element interfejsu musi spełniać co najmniej WCAG 2.2 na poziomie AA w zakresie możliwym dla danej funkcji.

Agent ma obowiązek:

- używać semantycznego HTML,
- zapewnić pełną obsługę klawiaturą,
- zachować widoczny styl fokusu,
- zapewnić poprawne etykiety pól i przycisków,
- nie opierać znaczenia wyłącznie na kolorze,
- zachować odpowiedni kontrast tekstu i elementów interaktywnych,
- stosować komunikaty zrozumiałe bez kontekstu wizualnego,
- używać `aria-*` tylko wtedy, gdy semantyczny HTML nie wystarcza,
- sprawdzić interfejs przy powiększeniu do 200%,
- nie wprowadzać automatycznych animacji utrudniających odbiór treści.

## 6. System wizualny i wartości konfiguracyjne

Kolory, typografia, promienie zaokrągleń, cienie i inne stałe wizualne nie mogą być wpisywane bezpośrednio w komponentach ani w głównym arkuszu stylów.

Obowiązujące źródło wartości:

`apps/web/config/design-tokens.css`

Agent ma obowiązek:

- używać istniejących zmiennych CSS,
- dodawać nowy token wyłącznie wtedy, gdy nie istnieje odpowiednik,
- nie duplikować wartości kolorów i rozmiarów,
- nie stosować stylów inline dla stałych wizualnych,
- dopuszczać style inline tylko dla wartości dynamicznych, np. procentowego postępu,
- opisać nowy token komentarzem, jeżeli jego przeznaczenie nie jest oczywiste.

## 7. Dane, eksporty i prywatność

- Dane demonstracyjne muszą być jednoznacznie oznaczone jako demonstracyjne.
- Eksport CSV powinien używać UTF-8 i separatora zgodnego z dokumentacją projektu.
- Eksport PDF musi zawierać datę wygenerowania, zakres danych i informację, czy dane są demonstracyjne.
- Pliki z wynikami nie mogą być publikowane w repozytorium produkcyjnym z rzeczywistymi danymi studentów.
- Identyfikatory studentów w interfejsie demonstracyjnym powinny być maskowane.
- Telemetria nie może być prezentowana jako automatyczny dowód niesamodzielności.

## 8. Dokumentacja

Każda zmiana wpływająca na uruchomienie, strukturę danych, publikację, bezpieczeństwo lub sposób użycia musi aktualizować odpowiedni plik w `docs/`.

Dokumentacja powinna:

- opisywać stan faktyczny,
- zawierać konkretne komendy i ścieżki,
- rozróżniać prototyp statyczny od wersji produkcyjnej,
- nie obiecywać funkcji, których kod nie implementuje,
- nie używać emotikon.

## 9. Testy i kryteria zakończenia

Zmiana jest zakończona dopiero wtedy, gdy:

- projekt przechodzi kontrolę TypeScript,
- frontend buduje się w trybie statycznego eksportu,
- nie ma nowych błędów konsoli,
- podstawowa nawigacja działa z klawiatury,
- nowe przyciski i odnośniki mają jednoznaczne nazwy,
- dokumentacja odpowiada implementacji,
- w kodzie nie pozostawiono tymczasowych danych lub komentarzy bez oznaczenia.

Minimalne komendy kontrolne:

```bash
npm install
npm run build:pages
```

Dla zmian backendowych dodatkowo:

```bash
npm run build -w apps/api
```

## 10. Format odpowiedzi agenta

Po zakończeniu pracy agent powinien podać:

- listę zmienionych plików,
- krótkie uzasadnienie zmian,
- wynik kompilacji lub testów,
- znane ograniczenia,
- informacje o wymaganych dalszych krokach tylko wtedy, gdy są rzeczywiście konieczne.
