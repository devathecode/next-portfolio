import AnimateOnScroll from "./AnimateOnScroll";
import ProfilePanel from "./ProfilePanel";
import TechStack from "./TechStack";

const focusAreas = [
  "Component architecture",
  "Performance",
  "Design systems",
  "UI animation",
  "TypeScript",
  "Cross-team collaboration",
];

const AboutComponent = () => {
  return (
    <section id="about" className="px-5 py-24 md:py-32 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Story */}
          <AnimateOnScroll className="lg:col-span-7">
            <h2
              className="max-w-[18ch] text-balance pb-1 text-[clamp(2rem,4.2vw,3.25rem)] font-semibold leading-[1.08]
                         tracking-[-0.035em] text-[var(--text-primary)]"
            >
              Building for the web,{" "}
              <span className="text-[var(--accent)]">obsessing</span> over the craft.
            </h2>

            <div className="mt-8 max-w-[62ch] space-y-5 text-[17px] leading-relaxed text-[var(--text-secondary)]">
              <p>
                I&apos;m a frontend developer sitting at the intersection of design and
                engineering, turning complex requirements into clean, fast, intuitive
                interfaces.
              </p>
              <p>
                With{" "}
                <strong className="font-medium text-[var(--text-primary)]">
                  5+ years of production experience
                </strong>{" "}
                across React, Next.js, Angular and Vue, I care deeply about code that
                scales.
              </p>
            </div>

            <ul aria-label="Focus areas" className="mt-8 flex max-w-[62ch] flex-wrap gap-2">
              {focusAreas.map((area) => (
                <li
                  key={area}
                  className="rounded-lg border border-[var(--border)] bg-[var(--bg-card)] px-3 py-1.5
                             text-[13px] text-[var(--text-secondary)]"
                >
                  {area}
                </li>
              ))}
            </ul>
          </AnimateOnScroll>

          {/* Profile panel */}
          <AnimateOnScroll delay={0.1} className="lg:col-span-5">
            <ProfilePanel />
          </AnimateOnScroll>
        </div>

        <TechStack />
      </div>
    </section>
  );
};

export default AboutComponent;
