export interface Patient {
  token: number;
  name: string;
  status: "called" | "current" | "waiting" | "skipped";
}
