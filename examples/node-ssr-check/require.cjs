const assert = require('node:assert/strict');
const { init, destroy } = require('@widgets/accessibility');
const metadata = require('@widgets/accessibility/package.json');
assert.equal(metadata.name, '@widgets/accessibility');
assert.equal(typeof document, 'undefined');
init({ position: 'bottom-left' }).destroy();
destroy();
assert.throws(() => require.resolve('react'), { code: 'MODULE_NOT_FOUND' });
console.log('Packed CJS consumer works without the optional React peer.');
