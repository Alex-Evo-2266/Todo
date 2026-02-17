export function splitPrivilege(privilege: string): string[] {
  return privilege.split(",").map(p => p.trim());
}
