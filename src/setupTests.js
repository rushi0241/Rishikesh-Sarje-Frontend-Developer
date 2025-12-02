import "@testing-library/jest-dom";

// jsdom doesn't implement ResizeObserver, which React Flow relies on.
// Provide a minimal stub so components can mount in tests.
class ResizeObserver {
  callback;
  constructor(callback) {
    this.callback = callback;
  }
  observe() {}
  unobserve() {}
  disconnect() {}
}

window.ResizeObserver = ResizeObserver;
global.ResizeObserver = ResizeObserver;
