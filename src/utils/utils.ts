export const asyncCall = (f: () => void) => setTimeout(() => f(), 0)
