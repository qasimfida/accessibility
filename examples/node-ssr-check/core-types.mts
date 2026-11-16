import { init } from '@widgets/accessibility';
import type { FeatureId } from '@widgets/accessibility';
const id: FeatureId = 'fontSize';
init({ features: [id], position: 'top-right' }).destroy();
