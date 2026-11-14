const assert = require('node:assert/strict');
const { init, destroy } = require('@qasimfida/accessibility-widget');
const metadata = require('@qasimfida/accessibility-widget/package.json');
assert.equal(metadata.name, '@qasimfida/accessibility-widget');
assert.equal(typeof document, 'undefined');
init({ position: 'bottom-left' }).destroy();
destroy();
assert.throws(() => require.resolve('react'), { code: 'MODULE_NOT_FOUND' });
console.log('Packed CJS consumer works without the optional React peer.');
