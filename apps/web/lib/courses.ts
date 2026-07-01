export type StudyMode = "fullTime" | "partTime";

export type Course = {
  name: string;
  href: string;
  available: boolean;
};

export type CourseQuiz = {
  label: string;
  title: string;
  time: string;
  status: string;
  available: boolean;
  sampleQuestions?: string[];
};

export type CourseMaterial = {
  label: string;
  title: string;
  description: string;
  href?: string;
  links?: Array<{ label: string; href: string }>;
};

export type CourseSimulator = {
  label: string;
  title: string;
  description: string;
  href: string;
};

export type GradeRequirement = {
  grade: string;
  title: string;
  description: string;
};

export const courses: Course[] = [
  { name: "Narzędzia dla programistów", href: "/kia.ndp", available: true },
  { name: "Algorytmy i struktury danych", href: "/kia.asid", available: true },
  { name: "Programowanie aplikacji mobilnych", href: "#", available: false },
  { name: "Programowanie gier komputerowych", href: "#", available: false },
  { name: "Informatyka afektywna", href: "#", available: false },
  { name: "Robotyka afektywna", href: "#", available: false },
  { name: "Seminarium dyplomowe", href: "/kia.sd", available: true },
];

export const studyModes: Array<{ id: StudyMode; label: string }> = [
  { id: "fullTime", label: "Studia stacjonarne" },
  { id: "partTime", label: "Studia niestacjonarne" },
];

export const ndpQuizzesByMode: Record<StudyMode, CourseQuiz[]> = {
  fullTime: [
    { label: "Zajęcia 2", title: "Polecenia powłoki Bash", time: "10 min", status: "Dostępna", available: true },
    { label: "Zajęcia 3", title: "Skrypty powłoki Bash", time: "10 min", status: "Wkrótce", available: false },
    { label: "Zajęcia 4", title: "Tworzenie dokumentów LaTeX", time: "10 min", status: "Wkrótce", available: false },
    { label: "Zajęcia 5", title: "Pakiety LaTeX i własne makra", time: "10 min", status: "Wkrótce", available: false },
    { label: "Zajęcia 6", title: "System kontroli wersji Git", time: "10 min", status: "Wkrótce", available: false },
  ],
  partTime: [
    { label: "Zajęcia 2", title: "Polecenia powłoki Bash", time: "10 min", status: "Dostępna", available: true },
    { label: "Zajęcia 3", title: "Skrypty powłoki Bash", time: "10 min", status: "Wkrótce", available: false },
    { label: "Zajęcia 4", title: "LaTeX i własne makra", time: "12 min", status: "Wkrótce", available: false },
    { label: "Zajęcia 5", title: "System kontroli wersji Git", time: "10 min", status: "Wkrótce", available: false },
  ],
};

export const ndpSimulators: CourseSimulator[] = [
  { label: "Terminal", title: "Symulator terminala", description: "Ćwicz podstawowe polecenia powłoki Bash w bezpiecznym środowisku przeglądarkowym.", href: "../materialy/ndp_terminal.html" },
  { label: "LaTeX", title: "Symulator LaTeX", description: "Sprawdzaj składnię dokumentów LaTeX i obserwuj efekt zmian bez lokalnej instalacji narzędzi.", href: "../materialy/ndp_latex.html" },
  { label: "Git", title: "Symulator Git", description: "Przećwicz komendy kontroli wersji, analizę historii i typowe operacje na repozytorium.", href: "../materialy/ndp_git.html" },
  { label: "VIM", title: "Symulator VIM", description: "Ćwicz podstawową nawigację, tryby pracy i edycję tekstu w edytorze VIM.", href: "../materialy/ndp_vim.html" },
];

export const ndpMaterialsByMode: Record<StudyMode, CourseMaterial[]> = {
  fullTime: [
    { label: "Temat 1", title: "Środowisko pracy programisty", description: "Organizacja pracy, macOS, terminal, konfiguracja narzędzi i odpowiedzialne użycie AI.", links: [{ label: "Otwórz materiał", href: "../materialy/ndp_laboratorium_01.html" }] },
    { label: "Temat 2", title: "Polecenia powłoki Bash", description: "System plików, przekierowania, potoki, kody zakończenia i pierwsze pętle.", links: [{ label: "Otwórz materiał", href: "../materialy/ndp_laboratorium_02.html" }] },
    { label: "Temat 3", title: "Skrypty powłoki Bash", description: "Zmienne, instrukcje warunkowe, pętle, case, sygnały i podstawy edytora Vim.", links: [{ label: "Otwórz materiał", href: "../materialy/ndp_laboratorium_03.html" }] },
    { label: "Temat 4", title: "Tworzenie dokumentów LaTeX", description: "Struktura i skład dokumentu, wzory, odwołania, spisy oraz grafika TikZ.", links: [{ label: "Otwórz materiał", href: "../materialy/ndp_laboratorium_04.html" }] },
    { label: "Temat 5", title: "Pakiety LaTeX i własne makra", description: "Makra, listingi, metadane PDF, bibliografia BibTeX i schematy circuitikz.", links: [{ label: "Otwórz materiał", href: "../materialy/ndp_laboratorium_05.html" }] },
    { label: "Temat 6", title: "System kontroli wersji Git", description: "Repozytoria, historia zmian, synchronizacja, konflikty, gałęzie i praca zespołowa.", links: [{ label: "Otwórz materiał", href: "../materialy/ndp_laboratorium_06.html" }] },
    { label: "Ćwiczenia własne", title: "Interaktywny terminal Bash", description: "Samodzielne ćwiczenie podstawowych poleceń w wirtualnym terminalu Bash.", links: [{ label: "Otwórz terminal", href: "../materialy/ndp_terminal.html" }] },
  ],
  partTime: [
    { label: "Temat 1", title: "Środowisko pracy programisty", description: "Organizacja pracy, macOS, terminal, konfiguracja narzędzi i odpowiedzialne użycie AI.", links: [{ label: "Otwórz materiał", href: "../materialy/ndp_laboratorium_01.html" }] },
    { label: "Temat 2", title: "Polecenia powłoki Bash", description: "System plików, przekierowania, potoki, kody zakończenia i pierwsze pętle.", links: [{ label: "Otwórz materiał", href: "../materialy/ndp_laboratorium_02.html" }] },
    { label: "Temat 3", title: "Skrypty powłoki Bash", description: "Zmienne, instrukcje warunkowe, pętle, case, sygnały i podstawy edytora Vim.", links: [{ label: "Otwórz materiał", href: "../materialy/ndp_laboratorium_03.html" }] },
    { label: "Temat 4", title: "LaTeX i własne makra", description: "Połączona instrukcja dla studiów niestacjonarnych: dokumenty LaTeX, pakiety, makra, listingi i bibliografia.", links: [{ label: "Część 1: LaTeX", href: "../materialy/ndp_laboratorium_04.html" }, { label: "Część 2: makra", href: "../materialy/ndp_laboratorium_05.html" }] },
    { label: "Temat 5", title: "System kontroli wersji Git", description: "Repozytoria, historia zmian, synchronizacja, konflikty, gałęzie i praca zespołowa.", links: [{ label: "Otwórz materiał", href: "../materialy/ndp_laboratorium_06.html" }] },
    { label: "Ćwiczenia własne", title: "Interaktywny terminal Bash", description: "Samodzielne ćwiczenie podstawowych poleceń w wirtualnym terminalu Bash.", links: [{ label: "Otwórz terminal", href: "../materialy/ndp_terminal.html" }] },
  ],
};

const asidQuizzes: CourseQuiz[] = [
  { label: "Wejściówka 1", title: "Projektowanie algorytmów i poprawność", time: "10 min", status: "Wkrótce", available: false },
  { label: "Wejściówka 2", title: "Złożoność obliczeniowa i efektywność", time: "10 min", status: "Wkrótce", available: false },
  { label: "Wejściówka 3", title: "Listy, kolejki i stosy", time: "10 min", status: "Wkrótce", available: false },
  { label: "Wejściówka 4", title: "Drzewa i ich reprezentacje", time: "10 min", status: "Wkrótce", available: false },
  { label: "Wejściówka 5", title: "Grafy i podstawowe zastosowania", time: "10 min", status: "Wkrótce", available: false },
  { label: "Wejściówka 6", title: "Algorytmy sortowania", time: "10 min", status: "Wkrótce", available: false },
];

export const asidQuizzesByMode: Record<StudyMode, CourseQuiz[]> = {
  fullTime: asidQuizzes,
  partTime: asidQuizzes,
};

export const asidGradeRequirements: GradeRequirement[] = [
  { grade: "3", title: "Poziom podstawowy", description: "Student ma podstawową wiedzę o wybranych technikach projektowania algorytmów, ich poprawności, złożoności i wydajności. Rozumie elementarne struktury danych, takie jak listy, kolejki i stosy, potrafi wykonywać na nich podstawowe operacje oraz zna podstawowe reprezentacje i zastosowania drzew, grafów i popularnych algorytmów sortowania." },
  { grade: "4", title: "Poziom pogłębiony", description: "Student spełnia wymagania na ocenę 3, a dodatkowo pisze poprawne programy dzięki rozumieniu zastosowanych rozwiązań, a nie wyłącznie metodą prób i błędów. Ma pogłębioną wiedzę o złożoności, wydajności i poprawności algorytmów, operacjach na strukturach liniowych, reprezentacjach drzew i grafów oraz analizie większej liczby algorytmów sortowania." },
  { grade: "5", title: "Poziom biegły i kreatywny", description: "Student spełnia wymagania na ocenę 4, a ponadto potrafi stosować poznane metody do znanych i nowych problemów. Wykazuje biegłość oraz kreatywność w badaniu złożoności algorytmów, doborze i wykorzystaniu struktur danych, reprezentowaniu drzew i grafów oraz znajomości i zastosowaniach algorytmów sortowania." },
];

export const asidMaterials: CourseMaterial[] = [
  { label: "Laboratorium 1", title: "Techniki projektowania algorytmów", description: "Poprawność, przejrzystość i sposoby usprawniania rozwiązań algorytmicznych." },
  { label: "Laboratorium 2", title: "Złożoność i wydajność", description: "Analiza czasu działania, pamięci oraz znaczenie poprawności algorytmów." },
  { label: "Laboratorium 3", title: "Listy, kolejki i stosy", description: "Elementarne struktury danych i podstawowe operacje wykonywane na tych strukturach." },
  { label: "Laboratorium 4", title: "Drzewa", description: "Sposoby reprezentowania drzew oraz przykładowe zastosowania w rozwiązywaniu problemów." },
  { label: "Laboratorium 5", title: "Grafy", description: "Reprezentacje grafów, podstawowe pojęcia i typowe zastosowania." },
  { label: "Laboratorium 6", title: "Algorytmy sortowania", description: "Działanie popularnych metod sortowania i porównywanie ich złożoności." },
  { label: "Laboratorium 7", title: "Powtórzenie i zadania przekrojowe", description: "Łączenie technik algorytmicznych, struktur danych oraz analizy złożoności w zadaniach problemowych." },
];

export const sdQuizzes: CourseQuiz[] = [
  {
    label: "Wejściówka 1",
    title: "Wybór tematu i cel pracy",
    time: "10 min",
    status: "Wkrótce",
    available: false,
    sampleQuestions: [
      "Jak odróżnić temat pracy dyplomowej od samego tytułu pracy?",
      "Jakie cechy powinien mieć poprawnie sformułowany cel główny pracy?",
      "Dlaczego temat pracy powinien być możliwy do zrealizowania w założonym czasie?",
      "Jak wskazać praktyczny lub badawczy problem, który ma rozwiązać praca?",
      "Czym różni się cel główny od celów szczegółowych?",
      "Jak sprawdzić, czy temat pracy jest wystarczająco zawężony?",
      "Jakie kryteria pomagają ocenić aktualność i przydatność tematu?",
      "Dlaczego warto określić spodziewany rezultat pracy już na etapie wyboru tematu?",
      "Jakie ryzyka mogą wynikać z wybrania zbyt szerokiego tematu?",
      "Jak przygotować krótkie uzasadnienie wyboru tematu dla promotora?",
    ],
  },
  {
    label: "Wejściówka 2",
    title: "Przegląd literatury i źródeł",
    time: "10 min",
    status: "Wkrótce",
    available: false,
    sampleQuestions: [
      "Jak rozpoznać wiarygodne źródło naukowe lub techniczne?",
      "Czym różni się literatura przedmiotu od dokumentacji narzędzia?",
      "Jakie informacje bibliograficzne trzeba zapisać podczas pracy ze źródłem?",
      "Dlaczego przegląd literatury powinien prowadzić do wniosków, a nie tylko streszczeń?",
      "Jak unikać plagiatu podczas parafrazowania cudzych treści?",
      "Jak dobrać słowa kluczowe do wyszukiwania literatury?",
      "Po czym poznać, że źródło jest nieaktualne dla danego tematu?",
      "Jak porównać dwa źródła prezentujące odmienne podejścia do problemu?",
      "Jaką rolę pełnią cytowania i przypisy w pracy dyplomowej?",
      "Jak uporządkować znalezione źródła według obszarów tematycznych?",
    ],
  },
  {
    label: "Wejściówka 3",
    title: "Metodyka i harmonogram realizacji",
    time: "10 min",
    status: "Wkrótce",
    available: false,
    sampleQuestions: [
      "Jak dobrać metodykę realizacji do charakteru pracy dyplomowej?",
      "Jakie elementy powinien zawierać realistyczny harmonogram prac?",
      "Dlaczego zadania w harmonogramie powinny mieć mierzalne rezultaty?",
      "Jak zaplanować kamienie milowe dla części teoretycznej i praktycznej?",
      "Jak uwzględnić czas na testowanie, korektę i konsultacje z promotorem?",
      "Jakie ryzyka warto wpisać do planu realizacji pracy?",
      "Jak monitorować postęp prac bez odkładania zadań na koniec semestru?",
      "Czym różni się etap analizy od etapu projektowania rozwiązania?",
      "Jak zaplanować zbieranie danych, eksperyment lub ewaluację rozwiązania?",
      "Jak aktualizować harmonogram, gdy zmienia się zakres pracy?",
    ],
  },
  {
    label: "Wejściówka 4",
    title: "Prezentacja postępów pracy",
    time: "10 min",
    status: "Wkrótce",
    available: false,
    sampleQuestions: [
      "Jak zbudować krótką prezentację pokazującą aktualny stan pracy?",
      "Jakie informacje powinny znaleźć się na slajdzie o celu i zakresie pracy?",
      "Jak przedstawić wykonane zadania bez nadmiernych szczegółów technicznych?",
      "Jak pokazać problemy i ryzyka w sposób rzeczowy i konstruktywny?",
      "Jak dobrać przykłady, diagramy lub zrzuty ekranu do prezentacji postępów?",
      "Dlaczego warto zakończyć prezentację planem kolejnych działań?",
      "Jak przygotować się do pytań promotora lub grupy seminaryjnej?",
      "Jak ocenić, czy prezentacja mieści się w wyznaczonym czasie?",
      "Jak mówić o opóźnieniach w harmonogramie i działaniach naprawczych?",
      "Jak wykorzystać informację zwrotną po prezentacji do poprawy pracy?",
    ],
  },
];

export const sdMaterial: CourseMaterial = {
  label: "Materiały",
  title: "Seminarium dyplomowe",
  description: "Strona z informacjami organizacyjnymi, wymaganiami i wskazówkami do przygotowania pracy dyplomowej.",
  href: "../materialy/seminarium_dyplomowe.html",
};

