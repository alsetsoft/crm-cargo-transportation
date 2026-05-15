export type ToastSeverity = "success" | "error" | "info" | "warning";

export type ToastMessage = {
  id: number;
  severity: ToastSeverity;
  text: string;
};

type Listener = (msg: ToastMessage) => void;

let nextId = 1;
const listeners = new Set<Listener>();

function emit(severity: ToastSeverity, text: string): void {
  const msg: ToastMessage = { id: nextId++, severity, text };
  listeners.forEach((fn) => fn(msg));
}

export const toast = {
  success(text: string): void { emit("success", text); },
  error(text: string): void   { emit("error",   text); },
  info(text: string): void    { emit("info",    text); },
  warning(text: string): void { emit("warning", text); },
};

export function subscribe(fn: Listener): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}
