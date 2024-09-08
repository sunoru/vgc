export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const nullOnZero = (n: number): number | null => (n === 0 ? null : n)
