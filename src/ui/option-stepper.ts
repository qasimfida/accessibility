import { createStepper } from './stepper';
import { valueText } from './presentation';
import type { ControlContext, RenderedControl } from './control-types';

/** Ordered discrete choices use indices without changing stored feature values or announcements. */
export function createOptionStepper(context: ControlContext): RenderedControl {
  const control = context.feature.control;
  if (
    control.type !== 'select' ||
    control.presentation !== 'stepper' ||
    control.values.length < 2 ||
    control.values.some(
      (value) => typeof value !== 'number' || !Number.isFinite(value),
    ) ||
    new Set(control.values).size !== control.values.length
  )
    throw new Error('Invalid ordered option metadata');
  const indexOf = (value: unknown) =>
    Math.max(0, control.values.indexOf(value as number));
  const renderer = createStepper({
    ...context,
    feature: {
      ...context.feature,
      control: {
        type: 'range',
        min: 0,
        max: control.values.length - 1,
        step: 1,
      },
    },
    getValue: () => indexOf(context.getValue()),
    setValue: (index) => context.setValue(control.values[index as number]),
    formatValue: (index) =>
      valueText(context.feature, control.values[index], context.messages),
  });
  return {
    ...renderer,
    update: (value) => renderer.update(indexOf(value)),
  };
}
