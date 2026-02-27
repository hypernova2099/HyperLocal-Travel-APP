// Lightweight pub/sub to notify AuthContext about unauthorized responses.
// This avoids importing navigation into the API layer.

const listeners = new Set();

export function onUnauthorized(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function emitUnauthorized() {
  listeners.forEach((listener) => {
    try {
      listener();
    } catch (e) {
      // Ignore listener errors to avoid breaking API flow
    }
  });
}

