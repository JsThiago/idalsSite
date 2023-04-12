export function todayInStringFormat() {
  return new Date().toISOString().split("T")[0];
}
