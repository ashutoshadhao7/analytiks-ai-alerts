export const removeSpacesAndTrim = (val: string) =>
  val === null ? null : val.replace(/\s/g, '');
