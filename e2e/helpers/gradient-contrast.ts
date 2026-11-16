/** Bound the banner's white-text contrast over every opaque stop and translucent decorative layer. */
export function bannerContrast(backgroundImage: string): number {
  const colors = [...backgroundImage.matchAll(/rgba?\(([^)]+)\)/g)].map(
    (match) => {
      const channels = match[1]!.split(',').map(Number);
      if (
        channels.length < 3 ||
        channels.some((value) => !Number.isFinite(value))
      )
        throw new Error(`Unsupported gradient color: ${match[0]}`);
      return { rgb: channels.slice(0, 3), alpha: channels[3] ?? 1 };
    },
  );
  const stops = colors.filter((color) => color.alpha === 1);
  if (!stops.length) throw new Error('No opaque gradient stops found');
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
  return Math.min(...candidates.map((rgb) => 1.05 / (luminance(rgb) + 0.05)));
}
