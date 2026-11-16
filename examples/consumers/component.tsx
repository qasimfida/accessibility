import {
  AccessiblitWidget,
  useAccessiblit,
} from '@widgets/accessibility/react';
import type { AccessiblitOptions } from '@widgets/accessibility';
const options: AccessiblitOptions = { persist: false };
/** Compile the public React types as an actual consumer, with no source aliases. */
export function Consumer() {
  const instance = useAccessiblit(options);
  instance.current?.getState();
  return <AccessiblitWidget position="bottom-left" features={['fontSize']} />;
}
