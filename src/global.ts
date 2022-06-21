declare global {
  const Immutable: typeof import('immutable')
  interface Window {
    Immutable: typeof import('immutable')
  }
}

export {}
