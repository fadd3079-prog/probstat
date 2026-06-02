export function createJsonContent(value: unknown): string {
  return JSON.stringify(value, null, 2);
}
