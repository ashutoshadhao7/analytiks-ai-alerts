export function stringToBoolean(val: string): boolean | any {
  if (val === 'true') return true;
  if (val === 'false') return false;
  return val;
}
