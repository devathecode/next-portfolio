import AnimateOnScroll from "./AnimateOnScroll";
import ProfilePanel from "./ProfilePanel";
import TechStack from "./TechStack";
import { PROFILE } from "@/lib/profile";

const focusAreas = [
  "Component architecture",
  "Performance",
  "Design systems",
  "UI animation",
  "TypeScript",
  "Cross-team collaboration",
];

/**
 * The about act on paper: the story, the profile card, then the credits,
 * every role from profile.ts set like the end titles of a film.
 */
const AboutComponent = () => {
  return (
    <section id="about" data-act="About" data-field="paper" className="field-paper px-5 py-24 md:py-32 lg:px-10">
      <div className="mx-auto max-w-[90rem]">
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-10">
          {/* Story */}
          <AnimateOnScroll direction="left" className="lg:col-span-7">
            <h2 className="t-act max-w-[17ch]">
              Building for the web,{" "}
              <span className="offset-word text-[var(--accent)]">obsessing</span> over the craft.
            </h2>

            <div className="mt-10 max-w-[60ch] space-y-5 text-[18px] leading-relaxed text-[var(--text-secondary)]">
              <p>
                I&apos;m a frontend developer sitting at the intersection of design and
                engineering, turning complex requirements into clean, fast, intuitive
                interfaces.
              </p>
              <p>
                With{" "}
                <strong className="font-semibold text-[var(--text-primary)]">5+ years of production experience</strong>{" "}
                across React, Next.js, Angular and Vue, I care deeply about code that
                scales.
              </p>
            </div>

            <p className="t-label mt-10 max-w-[44rem] leading-loose text-[var(--text-primary)]">
              <span className="sr-only">Focus areas: </span>
              {focusAreas.map((area, i) => (
                <span key={area}>
                  {area}
                  {i < focusAreas.length - 1 && (
                    <span aria-hidden="true" className="mx-2.5 text-[var(--accent)]">
                      /
                    </span>
                  )}
                </span>
              ))}
            </p>
          </AnimateOnScroll>

          {/* Profile card */}
          <AnimateOnScroll direction="right" className="lg:col-span-5 lg:pt-4">
            <ProfilePanel />
          </AnimateOnScroll>
        </div>

        {/* Credits */}
        <div className="mt-28 md:mt-36">
          <h3 className="t-card">Experience</h3>
          <ol className="mt-8 border-t-2 border-[var(--text-primary)]">
            {PROFILE.experience.map((job) => (
              <li
                key={job.company}
                className="grid grid-cols-1 gap-x-10 gap-y-3 border-b border-[var(--border)] py-7 md:grid-cols-12 md:items-baseline"
              >
                <p className="font-display text-[2.6rem] uppercase leading-[0.9] md:col-span-4 md:text-[3.2rem]">
                  {job.company}
                </p>
                <div className="md:col-span-3">
                  <p className="text-[17px] font-semibold text-[var(--text-primary)]">{job.role}</p>
                  <p className="t-label mt-1.5 text-[var(--text-muted)]">{job.period}</p>
                </div>
                <div className="md:col-span-5">
                  <p className="text-[16px] leading-relaxed text-[var(--text-secondary)]">{job.summary}</p>
                  <p className="mt-1.5 text-sm text-[var(--text-muted)]">{job.location}</p>
                </div>
              </li>
            ))}
            <li className="grid grid-cols-1 gap-x-10 gap-y-3 py-7 md:grid-cols-12 md:items-baseline">
              <p className="font-display text-[2.6rem] uppercase leading-[0.9] text-[var(--text-muted)] md:col-span-4 md:text-[3.2rem]">
                KIET
              </p>
              <div className="md:col-span-3">
                <p className="text-[17px] font-semibold text-[var(--text-primary)]">{PROFILE.education.degree}</p>
                <p className="t-label mt-1.5 text-[var(--text-muted)]">{PROFILE.education.years}</p>
              </div>
              <p className="text-[16px] leading-relaxed text-[var(--text-secondary)] md:col-span-5">
                {PROFILE.education.school}
              </p>
            </li>
          </ol>
        </div>

        <TechStack />
      </div>
    </section>
  );
};

export default AboutComponent;
