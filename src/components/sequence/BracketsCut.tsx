/**
 * A pair of angle brackets cut from flat paper, slightly off true, the left
 * one pasted a little higher than the right. Fills with currentColor.
 */
export default function BracketsCut({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 400 240" className={className} fill="currentColor">
      <path d="M118 6 L150 34 L72 118.5 L152 204 L119 233 L8 121 Z" />
      <path d="M262 22 L384 132 L271 238 L242 207.5 L322 131 L231 51 Z" />
      <path d="M226 0 L249 6 L183 236 L160 230 Z" opacity="0.55" />
    </svg>
  );
}
