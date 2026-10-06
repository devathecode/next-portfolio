/**
 * The hand-drawn line that marks whatever is live: an active act, a hovered
 * link. Three drawn frames swap on a hard step (see .jitter in globals.css);
 * `boil` makes it shiver on arrival, and any `.jitter-host` ancestor makes it
 * shiver while hovered or focused.
 */
const FRAMES = [
  "M1 3.4 C 14 2.2, 27 4.6, 41 3.1 S 68 2.4, 82 3.9 S 95 2.8, 99 3.2",
  "M0.5 3 C 12 4.4, 29 2, 43 3.6 S 66 4.2, 80 2.7 S 94 3.9, 99.5 2.9",
  "M1.5 2.8 C 16 3.9, 25 2.5, 39 3.8 S 70 2.2, 84 3.3 S 96 4.1, 98.5 3.5",
];

export default function JitterLine({
  boil = false,
  className = "",
  thickness = 2.5,
}: {
  boil?: boolean;
  className?: string;
  thickness?: number;
}) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 100 6"
      preserveAspectRatio="none"
      data-boil={boil}
      className={`jitter h-[6px] w-full ${className}`}
    >
      {FRAMES.map((d) => (
        <path
          key={d}
          d={d}
          fill="none"
          stroke="currentColor"
          strokeWidth={thickness}
          strokeLinecap="square"
          vectorEffect="non-scaling-stroke"
        />
      ))}
    </svg>
  );
}
