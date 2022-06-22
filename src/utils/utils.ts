export const asyncCall = (f: () => void) => setTimeout(() => f(), 0)

export const clone = <T>(x: T): T =>
  Array.isArray(x)
    ? (x.map((t) => clone(t)) as unknown as T)
    : Object.assign({}, x)
