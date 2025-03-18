export function commaSplitString(value: string): string[] {
  if (typeof value === 'string') {
    return value.split(',');
  } else {
    return value;
  }
}
