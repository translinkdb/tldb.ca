export function optionalClass(condition: any, className: string): string {
  return condition ? className : "";
}
