export function dashToCamelCase(input: string) {
  return input.replace(/-([a-z])/g, (group) => group[1].toUpperCase());
}
