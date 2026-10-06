const STACK: { name: string; role: string }[] = [
  { name: "React", role: "UI library" },
  { name: "Next.js", role: "Framework" },
  { name: "TypeScript", role: "Language" },
  { name: "Angular", role: "Framework" },
  { name: "Vue.js", role: "Framework" },
  { name: "Nuxt", role: "Framework" },
  { name: "Tailwind CSS", role: "Styling" },
  { name: "GraphQL", role: "Data layer" },
  { name: "Node.js", role: "Runtime" },
  { name: "Docker", role: "Tooling" },
  { name: "Salesforce LWC", role: "Platform" },
];

/**
 * The stack as a credits roll: the part on the left, the name in caps on
 * the right, three ragged columns, the way end titles are set.
 */
export default function TechStack() {
  return (
    <div className="mt-28 md:mt-36">
      <h3 className="t-card">The stack I ship with</h3>
      <ul
        aria-label="Technologies"
        className="mt-8 border-t-2 border-[var(--text-primary)] pt-8 sm:columns-2 sm:gap-x-12 lg:columns-3 lg:gap-x-16"
      >
        {STACK.map(({ name, role }) => (
          <li key={name} className="flex break-inside-avoid items-baseline gap-4 pb-4">
            <span className="t-label w-24 shrink-0 text-right text-[var(--text-muted)]">{role}</span>
            <span className="font-display text-[2.1rem] uppercase leading-[0.95] text-[var(--text-primary)] md:text-[2.5rem]">
              {name}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
