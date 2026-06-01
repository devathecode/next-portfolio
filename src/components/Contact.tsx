import { BsLinkedin } from "react-icons/bs";
import { ArrowUpRightIcon } from "lucide-react";
import AnimateOnScroll from "./AnimateOnScroll";
import ContactForm from "./ContactForm";
import CopyEmail from "./CopyEmail";
import { CONTACT_EMAIL, LINKEDIN_URL } from "@/lib/site";

const ContactComponent = () => {
  return (
    <section
      id="contact"
      className="border-t border-[var(--border)] px-5 py-24 md:py-32 lg:px-10"
    >
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
        {/* Intro + direct channels */}
        <AnimateOnScroll direction="up" className="lg:col-span-5">
          <h2
            className="max-w-[14ch] text-balance text-[clamp(2rem,4.2vw,3.25rem)] font-semibold leading-[1.05]
                       tracking-[-0.035em] text-[var(--text-primary)]"
          >
            Have a web app in mind?
          </h2>
          <p className="mt-5 max-w-[44ch] text-[17px] leading-relaxed text-[var(--text-secondary)]">
            A project, a role, or just a hello. My inbox is open and I usually reply
            within 24 hours.
          </p>

          <div className="mt-10 max-w-md space-y-3">
            <CopyEmail />
            <a
              href={LINKEDIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--bg-card)]
                         px-4 py-3.5 text-sm text-[var(--text-secondary)] transition-colors duration-200
                         hover:border-[var(--accent-line)] hover:text-[var(--text-primary)]"
            >
              <BsLinkedin size={15} className="shrink-0 text-[var(--text-muted)]" />
              <span className="flex-1">Connect on LinkedIn</span>
              <ArrowUpRightIcon
                size={15}
                className="text-[var(--text-muted)] transition-transform duration-200 group-hover:-translate-y-px group-hover:translate-x-px"
              />
            </a>
          </div>
        </AnimateOnScroll>

        {/* Compose window */}
        <AnimateOnScroll direction="up" delay={0.1} className="lg:col-span-7">
          <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] shadow-[var(--shadow-card)]">
            <div className="flex h-11 items-center border-b border-[var(--border)] bg-[var(--bg-secondary)] px-5">
              <p className="text-sm font-medium text-[var(--text-primary)]">New message</p>
            </div>
            <div className="flex items-center gap-3 border-b border-[var(--border)] px-5 py-3 text-sm">
              <span className="w-6 text-[var(--text-muted)]">To</span>
              <span className="truncate rounded-md bg-[var(--accent-muted)] px-2 py-0.5 font-mono text-[13px] text-[var(--accent)]">
                {CONTACT_EMAIL}
              </span>
            </div>
            <div className="p-5 md:p-7">
              <ContactForm />
            </div>
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
};

export default ContactComponent;
