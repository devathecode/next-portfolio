import AnimateOnScroll from "./AnimateOnScroll";
import ContactForm from "./ContactForm";
import { MailIcon } from "lucide-react";

const ContactComponent = () => {
  return (
    <section
      id="contact"
      className="relative overflow-hidden py-24 px-5 lg:px-10"
    >
      {/* Ambient orb */}
      <div
        aria-hidden="true"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                   w-[600px] h-[400px] bg-amber-500/4 dark:bg-amber-400/5
                   rounded-full blur-[150px] pointer-events-none"
      />

      <div className="max-w-7xl mx-auto">
        {/* Section heading */}
        <AnimateOnScroll direction="up" className="mb-16">
          <p className="section-label mb-4">Get in touch</p>
          <div className="flex items-end gap-6">
            <h2
              className="font-display font-bold leading-none tracking-tight
                         text-[clamp(2.4rem,5vw,4rem)] text-[var(--text-primary)]"
            >
              Contact
            </h2>
            <div className="h-px flex-1 max-w-xs bg-[var(--border)] mb-3" />
          </div>
          <p className="text-[var(--text-secondary)] text-base mt-4 max-w-lg">
            Whether you have a project in mind, a role to discuss, or just want
            to say hello — my inbox is always open.
          </p>
        </AnimateOnScroll>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">

          {/* Left: direct email card */}
          <AnimateOnScroll direction="fade" delay={0.1} className="lg:col-span-4">
            <div
              className="rounded-2xl border border-[var(--border)] bg-[var(--bg-card)]
                         p-6 space-y-5"
            >
              <div
                className="inline-flex items-center justify-center w-10 h-10 rounded-xl
                           bg-[var(--accent-muted)] text-[var(--accent)]"
              >
                <MailIcon size={18} />
              </div>

              <div>
                <p className="font-mono text-xs text-[var(--text-muted)] mb-1">Email me directly</p>
                <a
                  href="mailto:code.devanshu@gmail.com"
                  className="font-medium text-[var(--text-primary)] hover:text-[var(--accent)]
                             transition-colors duration-200 break-all text-sm"
                >
                  code.devanshu@gmail.com
                </a>
              </div>

              <div className="h-px bg-[var(--border)]" />

              <div>
                <p className="font-mono text-xs text-[var(--text-muted)] mb-2">Also on</p>
                <a
                  href="https://www.linkedin.com/in/devthecoder/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-sm text-[var(--text-secondary)]
                             hover:text-[var(--accent)] transition-colors duration-200"
                >
                  LinkedIn →
                </a>
              </div>
            </div>
          </AnimateOnScroll>

          {/* Right: form */}
          <AnimateOnScroll direction="up" delay={0.15} className="lg:col-span-8">
            <div
              className="rounded-2xl border border-[var(--border)] bg-[var(--bg-card)]
                         p-6 md:p-8"
            >
              <p className="font-display text-xl font-semibold text-[var(--text-primary)] mb-1">
                Send a message
              </p>
              <p className="text-sm text-[var(--text-secondary)] mb-6">
                I&apos;ll get back to you within 24 hours.
              </p>
              <ContactForm />
            </div>
          </AnimateOnScroll>
        </div>
      </div>
    </section>
  );
};

export default ContactComponent;
