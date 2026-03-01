import { MailCheckIcon, PhoneIcon } from "lucide-react";
import Image from "next/image";
import TechStack from "./TechStack";
import AnimateOnScroll from "./AnimateOnScroll";

const AboutComponent = () => {
  return (
    <div
      id="about"
      className="flex flex-col items-center justify-center min-h-[92vh] p-4"
    >
      <div className="py-6 md:py-12 w-full">
        {/* Section heading */}
        <AnimateOnScroll direction="up" className="flex flex-col items-center">
          <h2 className="text-2xl md:text-5xl text-center font-bold text-gray-900 dark:text-white mb-4">
            About me
          </h2>
          <div className="h-0.5 w-32 md:w-72 bg-gradient-to-r from-yellow-600 via-yellow-700 to-yellow-800 mb-3" />
        </AnimateOnScroll>

        <div className="grid grid-cols-12 gap-y-5 lg:gap-20 pt-4 md:pt-[40px] items-center">
          {/* Illustration — slides in from right */}
          <AnimateOnScroll
            direction="right"
            delay={0.1}
            className="col-span-12 md:col-span-5 place-self-center md:place-self-end my-auto"
          >
            <Image
              src="/images/main.gif"
              height={600}
              width={600}
              className="h-80 sm:h-96 w-80 sm:w-96 object-contain mix-blend-multiply dark:mix-blend-plus-lighter rounded-full"
              alt="Developer illustration"
              loading="lazy"
            />
          </AnimateOnScroll>

          {/* Text — slides in from left */}
          <AnimateOnScroll
            direction="left"
            delay={0.2}
            className="col-span-12 md:col-span-7 space-y-4"
          >
            <div className="text-pretty max-w-2xl">
              <h3 className="text-2xl md:text-3xl font-medium dark:text-white mb-3">
                Who am I?
              </h3>
              <p className="text-gray-500 dark:text-gray-400 leading-7">
                I&apos;m a frontend developer based in Noida, India, with a
                passion for building web experiences that are fast, accessible,
                and beautifully crafted. I thrive at the intersection of design
                and engineering — turning complex requirements into clean,
                intuitive interfaces.
              </p>
              <p className="text-gray-500 dark:text-gray-400 leading-7 mt-3">
                With 4+ years in the industry, I&apos;ve shipped
                production-ready applications across fintech, e-commerce, and
                SaaS using{" "}
                <span className="text-yellow-600 font-semibold">
                  React, Next.js, Angular, and Vue.js
                </span>
                . I take pride in writing clean code that scales — and in
                interfaces that users actually enjoy using.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 my-4">
                Personal Info
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-md bg-gray-100 dark:bg-gray-800">
                    <PhoneIcon size={18} className="text-sky-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wide">
                      Phone
                    </p>
                    <a
                      className="text-sm font-medium dark:text-white hover:text-yellow-600 dark:hover:text-yellow-600 transition-colors duration-200"
                      href="tel:+917078146612"
                    >
                      +91 7078146612
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-md bg-gray-100 dark:bg-gray-800">
                    <MailCheckIcon size={18} className="text-sky-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wide">
                      Email
                    </p>
                    <a
                      className="text-sm font-medium dark:text-white hover:text-yellow-600 dark:hover:text-yellow-600 transition-colors duration-200"
                      href="mailto:code.devanshu@gmail.com"
                    >
                      code.devanshu@gmail.com
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </AnimateOnScroll>
        </div>

        <TechStack />
      </div>
    </div>
  );
};

export default AboutComponent;
