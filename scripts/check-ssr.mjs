import assert from 'node:assert/strict';
import { createRequire } from 'node:module';

// A throwing getter proves imports do not even inspect a browser global.
Object.defineProperty(globalThis, 'window', {
  configurable: true,
  get() {
    throw new Error('Import touched window');
  },
});
const esm = await import('../dist/index.mjs');
const cjs = createRequire(import.meta.url)('../dist/index.cjs');
// Resolve both optional entries too: a stale self-import can break only React after a package rename.
const reactEsm = await import('../dist/react.mjs');
const reactCjs = createRequire(import.meta.url)('../dist/react.cjs');
for (const api of [reactEsm, reactCjs]) {
  assert.ok('AccessiblitWidget' in api);
  assert.equal(typeof api.useAccessiblit, 'function');
}
delete globalThis.window;
assert.equal(typeof document, 'undefined');
for (const api of [esm, cjs]) {
  api.destroy();
  const instance = api.init();
  assert.equal(Object.keys(instance.getState()).length, 18);
  instance.open();
  instance.close();
  instance.toggle();
  instance.reset();
  instance.setFeature('fontSize', 150);
  assert.equal(instance.getState().fontSize, 100);
  instance.destroy();
  api.destroy();
}
console.log(
  'Plain Node: ESM/CJS imports avoid browser globals; SSR lifecycle passed.',
);
