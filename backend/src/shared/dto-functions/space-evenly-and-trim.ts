export const spaceEvenlyAndTrim = (val: string) =>
  val === null ? null : val.replace(/\s+/g, ' ').trim();
