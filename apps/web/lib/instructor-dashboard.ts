export type InstructorMetric = {
  id: string;
  label: string;
  value: string;
};

export type AttemptSummary = {
  id: string;
  maskedIndex: string;
  quizTitle: string;
  startedAt: string;
  score: string;
  tabHiddenCount: number;
};

export type InstructorDashboard = {
  metrics: InstructorMetric[];
  attempts: AttemptSummary[];
  isDemo: boolean;
};

const dashboardApiUrl = process.env.NEXT_PUBLIC_INSTRUCTOR_DASHBOARD_API_URL?.replace(/\/$/, "") || null;

export function isDemoInstructorDashboard(): boolean {
  return dashboardApiUrl === null;
}

export function getDemoInstructorDashboard(): InstructorDashboard {
  return {
    isDemo: true,
    metrics: [
      { id: "active-courses", label: "Aktywne kursy", value: "1" },
      { id: "students", label: "Studenci", value: "128" },
      { id: "attempts-today", label: "Próby dzisiaj", value: "42" },
      { id: "average-score", label: "Średni wynik", value: "74%" },
    ],
    attempts: [
      {
        id: "demo-1",
        maskedIndex: "*****123",
        quizTitle: "Git i praca zespołowa",
        startedAt: "09:02",
        score: "9/10",
        tabHiddenCount: 0,
      },
      {
        id: "demo-2",
        maskedIndex: "*****914",
        quizTitle: "Git i praca zespołowa",
        startedAt: "09:04",
        score: "7/10",
        tabHiddenCount: 2,
      },
      {
        id: "demo-3",
        maskedIndex: "*****287",
        quizTitle: "Git i praca zespołowa",
        startedAt: "09:06",
        score: "8/10",
        tabHiddenCount: 1,
      },
    ],
  };
}

function isInstructorDashboard(value: unknown): value is Omit<InstructorDashboard, "isDemo"> {
  if (typeof value !== "object" || value === null) return false;
  const candidate = value as Partial<InstructorDashboard>;
  return Array.isArray(candidate.metrics) && Array.isArray(candidate.attempts);
}

export async function getInstructorDashboard(): Promise<InstructorDashboard> {
  if (isDemoInstructorDashboard()) {
    return getDemoInstructorDashboard();
  }

  const response = await fetch(`${dashboardApiUrl}/instructor/dashboard`, {
    credentials: "include",
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    throw new Error("Nie udało się pobrać danych panelu prowadzącego.");
  }

  const data: unknown = await response.json();

  if (!isInstructorDashboard(data)) {
    throw new Error("Usługa zwróciła nieprawidłowy format danych panelu prowadzącego.");
  }

  return { ...data, isDemo: false };
}
