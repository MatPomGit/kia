export type TelemetryEvent =
  | {
      type: "pointer_sample";
      timestamp: string;
      questionId?: string;
      payload: { x: number; y: number; buttons: number };
    }
  | {
      type: "key_meta";
      timestamp: string;
      questionId?: string;
      payload: { category: "navigation" | "editing" | "system"; code: string; repeat: boolean };
    }
  | {
      type: "visibility";
      timestamp: string;
      payload: { state: DocumentVisibilityState };
    };

export function classifyKey(event: KeyboardEvent): TelemetryEvent["payload"] | null {
  const navigation = ["Tab", "Enter", "Escape", "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"];
  const editing = ["Backspace", "Delete"];

  if (navigation.includes(event.key)) {
    return { category: "navigation", code: event.code, repeat: event.repeat };
  }
  if (editing.includes(event.key)) {
    return { category: "editing", code: event.code, repeat: event.repeat };
  }

  // Nie zapisujemy klawiszy znakowych ani treści odpowiedzi.
  return null;
}
