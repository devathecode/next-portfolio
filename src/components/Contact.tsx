import { MdMap, MdMarkEmailUnread, MdPhone } from "react-icons/md";
import AnimateOnScroll from "./AnimateOnScroll";
import ContactForm from "./ContactForm";

const ContactComponent = () => {
  return (
    <div
      className="flex flex-col items-center justify-center min-h-[88vh] mt-10 md:mt-0 p-4"
      id="contact"
    >
      {/* Heading */}
      <AnimateOnScroll direction="up" className="flex flex-col items-center">
        <h2 className="text-2xl md:text-5xl text-center font-bold text-gray-900 dark:text-white mb-4">
          Get In Touch
        </h2>
        <div className="h-0.5 w-32 md:w-60 bg-gradient-to-r from-yellow-600 via-yellow-700 to-yellow-800 mb-3" />
      </AnimateOnScroll>

      <AnimateOnScroll direction="fade" delay={0.15}>
        <p className="text-base text-gray-500 dark:text-gray-400 mb-10 text-center max-w-lg">
          Whether you have a project in mind, a role to discuss, or just want to
          say hello — my inbox is always open.
        </p>
      </AnimateOnScroll>

      <div className="w-full max-w-5xl space-y-6">
        {/* Info cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <AnimateOnScroll direction="up" delay={0.1}>
            <div className="flex items-center gap-4 border border-yellow-600/40 rounded-lg p-4 bg-white dark:bg-gray-900/50 h-full">
              <MdPhone className="text-3xl text-sky-400 shrink-0" />
              <div>
                <p className="text-xs text-yellow-600 font-semibold uppercase tracking-wide">
                  Phone
                </p>
                <a
                  className="text-sm font-medium dark:text-white/80 hover:text-yellow-600 dark:hover:text-yellow-500 transition-colors duration-200"
                  href="tel:+917078146612"
                >
                  +91 7078146612
                </a>
              </div>
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll direction="up" delay={0.2}>
            <div className="flex items-center gap-4 border border-yellow-600/40 rounded-lg p-4 bg-white dark:bg-gray-900/50 h-full">
              <MdMap className="text-3xl text-green-500 shrink-0" />
              <div>
                <p className="text-xs text-yellow-600 font-semibold uppercase tracking-wide">
                  Location
                </p>
                <p className="text-sm font-medium dark:text-white/80">
                  Noida, UP, India
                </p>
              </div>
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll direction="up" delay={0.3}>
            <div className="flex items-center gap-4 border border-yellow-600/40 rounded-lg p-4 bg-white dark:bg-gray-900/50 h-full">
              <MdMarkEmailUnread className="text-3xl text-sky-400 shrink-0" />
              <div>
                <p className="text-xs text-yellow-600 font-semibold uppercase tracking-wide">
                  Email
                </p>
                <a
                  className="text-sm font-medium dark:text-white/80 hover:text-yellow-600 dark:hover:text-yellow-500 transition-colors duration-200 break-all"
                  href="mailto:code.devanshu@gmail.com"
                >
                  code.devanshu@gmail.com
                </a>
              </div>
            </div>
          </AnimateOnScroll>
        </div>

        {/* Form */}
        <AnimateOnScroll direction="up" delay={0.2}>
          <div className="border border-yellow-600/40 rounded-lg bg-white dark:bg-gray-900/50 p-6 md:p-8">
            <p className="text-gray-600 dark:text-gray-300 text-xl font-medium">
              Have an idea or opportunity?{" "}
              <span className="text-yellow-600">
                Let&apos;s talk and make it happen.
              </span>
            </p>
            <ContactForm />
          </div>
        </AnimateOnScroll>
      </div>
    </div>
  );
};

export default ContactComponent;
