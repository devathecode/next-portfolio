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
        {/* Form */}
        <AnimateOnScroll direction="up" delay={0.2}>
          <div className="border border-yellow-600/40 rounded-lg bg-white dark:bg-gray-900/50 p-6 md:p-8">
            <p className="text-gray-600 dark:text-gray-300 text-xl font-medium">
              Whether it’s a project or a quick hello?{" "}
              <span className="text-yellow-600">I&apos;d love to connect.</span>
            </p>
            <ContactForm />
          </div>
        </AnimateOnScroll>
      </div>
    </div>
  );
};

export default ContactComponent;
