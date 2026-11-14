import {
  AccessiblitWidget,
  useAccessiblit,
} from '@qasimfida/accessibility-widget/react';
import type { AccessiblitOptions } from '@qasimfida/accessibility-widget';
const options: AccessiblitOptions = { persist: false };
/** Compile the public React types as an actual consumer, with no source aliases. */
export function Consumer() {
  const instance = useAccessiblit(options);
  instance.current?.getState();
  return <AccessiblitWidget position="bottom-left" features={['fontSize']} />;
}
