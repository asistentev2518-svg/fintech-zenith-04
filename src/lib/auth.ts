// Demo-only auth: credenciales fijas validadas en cliente.
// Para producción real: migrar a Lovable Cloud + Supabase Auth.

export const OPERATORS = [
  { id: "impulso26", password: "252627", name: "Operador Impulso" },
] as const;

export type Operator = {
  id: string;
  name: string;
};

const SESSION_KEY = "ig.session";

export function login(id: string, password: string): Operator | null {
  const match = OPERATORS.find((o) => o.id === id && o.password === password);
  if (!match) return null;
  const operator: Operator = { id: match.id, name: match.name };
  try {
    sessionStorage.setItem(
      SESSION_KEY,
      JSON.stringify({ ...operator, at: Date.now() }),
    );
  } catch {
    /* ignore */
  }
  return operator;
}

export function getSession(): Operator | null {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return { id: parsed.id, name: parsed.name };
  } catch {
    return null;
  }
}

export function logout() {
  try {
    sessionStorage.removeItem(SESSION_KEY);
  } catch {
    /* ignore */
  }
}
