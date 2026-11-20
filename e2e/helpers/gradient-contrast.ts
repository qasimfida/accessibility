/** Bound actual foreground contrast against every channel range in the banner's gradient layers. */
export function bannerContrast(
  backgroundImage: string,
  foregroundColor: string,
): number {
  const parse = (value: string) => {
    const channels = value.split(',').map(Number);
    if (
      channels.length < 3 ||
      channels.some((channel) => !Number.isFinite(channel))
    )
      throw new Error(`Unsupported gradient color: ${value}`);
    return { rgb: channels.slice(0, 3), alpha: channels[3] ?? 1 };
  };
  const colors = [...backgroundImage.matchAll(/rgba?\(([^)]+)\)/g)].map(
    (match) => parse(match[1]!),
  );
  const stops = colors.filter((color) => color.alpha === 1);
  if (!stops.length) throw new Error('No opaque gradient stops found');
  const foreground = foregroundColor.match(/^rgba?\(([^)]+)\)$/);
  if (!foreground) throw new Error('Unsupported foreground color');
  const ink = parse(foreground[1]!);
  if (ink.alpha !== 1) throw new Error('Foreground must be opaque');
  const overlays = colors.filter((color) => color.alpha > 0 && color.alpha < 1);
  const luminance = (rgb: number[]) =>
    rgb.reduce((sum, value, index) => {
      const channel = value / 255;
      return (
        sum +
        (channel <= 0.04045
          ? channel / 12.92
          : ((channel + 0.055) / 1.055) ** 2.4) *
          [0.2126, 0.7152, 0.0722][index]!
      );
    }, 0);
  const candidates = stops.flatMap((stop) => [
    stop.rgb,
    ...overlays.map((overlay) =>
      stop.rgb.map(
        (value, index) =>
          value * (1 - overlay.alpha) + overlay.rgb[index]! * overlay.alpha,
      ),
    ),
  ]);
  // Channel extrema bound every interpolation, including combinations absent at actual stops.
  const lower = luminance(
    [0, 1, 2].map((index) => Math.min(...candidates.map((rgb) => rgb[index]!))),
  );
  const upper = luminance(
    [0, 1, 2].map((index) => Math.max(...candidates.map((rgb) => rgb[index]!))),
  );
  const text = luminance(ink.rgb);
  if (text >= lower && text <= upper) return 1;
  return text < lower
    ? (lower + 0.05) / (text + 0.05)
    : (text + 0.05) / (upper + 0.05);
}
