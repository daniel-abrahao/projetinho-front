import { setupZoneTestEnv } from 'jest-preset-angular/setup-env/zone';
class LocalStorageMock {
  store: {[key: string]: string} = {};

  clear() {
    this.store = {};
  }

  getItem(key: string): string | null {
    return this.store[key] || null;
  }

  setItem(key: string, value: string) {
    this.store[key] = String(value);
  }

  removeItem(key: string) {
    delete this.store[key];
  }
}

Object.defineProperty(window, 'localStorage', {
  value: new LocalStorageMock
});
setupZoneTestEnv();
