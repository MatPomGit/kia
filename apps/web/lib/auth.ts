const SESSION_KEY = "ndp_tests_instructor_token";
const DEMO_SESSION_TOKEN = "demo-instructor-session";

export const DEMO_USERNAME = "demo";
export const DEMO_PASSWORD = "demo12345";

function authApiBase(): string | null {
  return process.env.NEXT_PUBLIC_AUTH_API_URL?.replace(/\/$/, "") || null;
}

function apiUrl(base: string, path: string): string {
  return `${base}${path}`;
}

export async function loginInstructor(login: string, password: string): Promise<void> {
  const base = authApiBase();

  if (!base) {
    if (login === DEMO_USERNAME && password === DEMO_PASSWORD) {
      sessionStorage.setItem(SESSION_KEY, DEMO_SESSION_TOKEN);
      return;
    }

    throw new Error(`Tryb demo: użyj loginu ${DEMO_USERNAME} i hasła ${DEMO_PASSWORD}.`);
  }

  const response = await fetch(apiUrl(base, "/auth/login"), {
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
    const base = authApiBase();
    if (!base) return token === DEMO_SESSION_TOKEN;

    const response = await fetch(apiUrl(base, "/auth/verify"), {
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
