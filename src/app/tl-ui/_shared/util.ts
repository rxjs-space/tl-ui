export function isUndefined(v) {
  return typeof v === 'undefined';
}

export function isNullOrUndefined(v) {
  return (typeof v === 'undefined') || (v === null)
}

export function isNull(v) {
  return v === null;
}