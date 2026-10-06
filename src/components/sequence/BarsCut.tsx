/**
 * Strips of cut paper standing in a row, like the fractured bars of a Bass
 * title. Heights are fixed, so the row reads as one silhouette.
 */
const BARS = [
  { x: 0, h: 62, t: -1.5 },
  { x: 26, h: 100, t: 1 },
  { x: 52, h: 40, t: -0.5 },
  { x: 78, h: 84, t: 2 },
  { x: 104, h: 56, t: -2 },
  { x: 130, h: 92, t: 0.5 },
];

export default function BarsCut({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 150 104" className={className} fill="currentColor">
      {BARS.map((b) => (
        <rect key={b.x} x={b.x} y={104 - b.h} width={16} height={b.h} transform={`rotate(${b.t} ${b.x + 8} 104)`} />
      ))}
    </svg>
  );
}
