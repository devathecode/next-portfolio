/**
 * A pointer cut from black paper, its tail drawn out into a long arm: the
 * developer's version of the reaching arm in a Bass title. Fills with
 * currentColor. The edges are cut by hand, so no line is quite straight.
 */
export default function CursorCut({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 270 420" className={className} fill="currentColor">
      <path d="M0 0 L3.5 74 L0 152 L41 114.5 L214 420 L266 420 L92.5 102 L148 98.5 L71 44.5 Z" />
    </svg>
  );
}
