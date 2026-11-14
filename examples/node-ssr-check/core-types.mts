import { init } from '@qasimfida/accessibility-widget';
import type { FeatureId } from '@qasimfida/accessibility-widget';
const id: FeatureId = 'fontSize';
init({ features: [id], position: 'top-right' }).destroy();
