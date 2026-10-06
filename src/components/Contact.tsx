import { BsLinkedin } from "react-icons/bs";
import { ArrowUpRightIcon } from "lucide-react";
import AnimateOnScroll from "./AnimateOnScroll";
import ContactForm from "./ContactForm";
import CopyEmail from "./CopyEmail";
import { CONTACT_EMAIL, LINKEDIN_URL } from "@/lib/site";

/** The contact act, on ochre: the invitation, the direct lines, and the form on a sheet of bone. */
const ContactComponent = () => {
  return (
    <section
      id="contact"
      data-act="Contact"
      data-field="ochre"
      className="field-ochre grain px-5 py-24 md:py-32 lg:px-10"
    >
      <div className="mx-auto grid max-w-[90rem] grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-10">
        <AnimateOnScroll direction="left" className="lg:col-span-5">
          <h2 className="t-act max-w-[9ch]">Have a web app in mind?</h2>
          <p className="mt-8 max-w-[40ch] text-[18px] leading-relaxed text-[var(--text-primary)]">
            A project, a role, or just a hello. My inbox is open and I usually reply
            within 24 hours.
          </p>

          <div className="mt-10 max-w-md space-y-3">
            <CopyEmail />
            <a
              href={LINKEDIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex h-14 items-center gap-3 px-4 text-[16px] font-medium text-[var(--text-primary)]
                         shadow-[inset_0_0_0_2px_var(--text-primary)] transition-colors duration-100
                         hover:bg-[var(--ink)] hover:text-[var(--bone-ink)]"
            >
              <BsLinkedin size={17} className="shrink-0" />
              <span className="flex-1">Connect on LinkedIn</span>
              <ArrowUpRightIcon
                size={17}
                strokeWidth={2.2}
                className="transition-transform duration-100 group-hover:-translate-y-px group-hover:translate-x-px"
              />
            </a>
          </div>
        </AnimateOnScroll>

        {/* The sheet */}
        <AnimateOnScroll direction="right" className="lg:col-span-7">
          <div className="field-paper cut-a rotate-[0.6deg]">
            <div className="field-ink flex flex-wrap items-center gap-x-4 gap-y-1 px-6 py-4 md:px-8">
              <p className="font-display text-[1.75rem] uppercase leading-none">New message</p>
              <p className="t-label ml-auto truncate text-[var(--text-muted)]">
                To <span className="normal-case tracking-[0.02em] text-[var(--accent)]">{CONTACT_EMAIL}</span>
              </p>
            </div>
            <div className="-rotate-[0.6deg] p-6 md:p-8">
              <ContactForm />
            </div>
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
};

export default ContactComponent;
