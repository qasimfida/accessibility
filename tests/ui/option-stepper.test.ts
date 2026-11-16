import { expect, it, vi } from 'vitest';
import { createOptionStepper } from '../../src/ui/option-stepper';
import { lineHeight } from '../../src/features/line-height';
import { resolveOptions } from '../../src/core/options';

it('steps through real discrete values and restores externally updated selections', () => {
  let value: unknown = 0;
  const setValue = vi.fn((next: unknown) => {
    value = next;
    renderer.update(next);
  });
  const renderer = createOptionStepper({
    document,
    feature: lineHeight,
    messages: resolveOptions().messages,
    prefix: 'ordered',
    getValue: () => value,
    setValue,
  });
  const [minus, plus] = renderer.element.querySelectorAll('button');
  const text = renderer.element.querySelector('.accessiblit-value')!;
  expect(text.textContent).toBe('Off');
  expect(minus!.getAttribute('aria-disabled')).toBe('true');
  for (const expected of [1.5, 1.75, 2]) {
    plus!.click();
    expect(setValue).toHaveBeenLastCalledWith(expected);
    expect(text.textContent).toBe(String(expected));
  }
  expect(plus!.getAttribute('aria-disabled')).toBe('true');
  plus!.click();
  expect(setValue).toHaveBeenCalledTimes(3);
  minus!.click();
  expect(value).toBe(1.75);
  value = 0;
  renderer.update(0);
  expect(text.textContent).toBe('Off');
  renderer.destroy();
  plus!.click();
  expect(value).toBe(0);
});

it('rejects invalid metadata without touching state', () => {
  for (const values of [[0], [0, 0], [0, NaN], [0, 'two']]) {
    expect(() =>
      createOptionStepper({
        document,
        feature: {
          ...lineHeight,
          control: { type: 'select', values, presentation: 'stepper' },
        },
        messages: resolveOptions().messages,
        prefix: 'bad',
        getValue: () => 0,
        setValue: vi.fn(),
      }),
    ).toThrow('Invalid ordered option metadata');
  }
});
