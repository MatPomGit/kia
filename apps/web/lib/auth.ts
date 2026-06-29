const SESSION_KEY = "ndp_tests_instructor_token";

function apiUrl(path: string): string {
  const base = process.env.NEXT_PUBLIC_AUTH_API_URL?.replace(/\/$/, "");
  if (!base) throw new Error("Brak konfiguracji NEXT_PUBLIC_AUTH_API_URL.");
  return `${base}${path}`;
}

export async function loginInstructor(login: string, password: string): Promise<void> {
  const response = await fetch(apiUrl("/auth/login"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ login, password }),
  });

  if (!response.ok) {
    const message = response.status === 401
      ? "Nieprawidłowy login lub hasło."
      : "Nie udało się połączyć z usługą logowania.";
    throw new Error(message);
  }

  const data = await response.json() as { token?: string };
  if (!data.token) throw new Error("Usługa logowania zwróciła nieprawidłową odpowiedź.");
  sessionStorage.setItem(SESSION_KEY, data.token);
}

export async function verifyInstructorSession(): Promise<boolean> {
  const token = sessionStorage.getItem(SESSION_KEY);
  if (!token) return false;

  try {
    const response = await fetch(apiUrl("/auth/verify"), {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) sessionStorage.removeItem(SESSION_KEY);
    return response.ok;
  } catch {
    return false;
  }
}

export function logoutInstructor(): void {
  sessionStorage.removeItem(SESSION_KEY);
}
