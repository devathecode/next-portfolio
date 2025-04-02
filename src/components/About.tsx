import { MailCheckIcon, PhoneIcon } from "lucide-react";
import Image from "next/image";
import TechStack from "./TechStack";

const AboutComponent = () => {
  return (
    <div
      id="about"
      className="flex flex-col items-center justify-center min-h-[92vh] p-4"
    >
      <div className="py-6 md:py-12">
        <div className="flex flex-col items-center">
          <h2 className="text-2xl md:text-5xl text-center font-bold text-gray-900 dark:text-white mb-4">
            About me
          </h2>
          <div className="h-0.5 w-32 md:w-72 bg-gradient-to-r from-yellow-600 via-yellow-700 to-yellow-800 mb-3"></div>
        </div>
        <div className="grid grid-cols-12 gap-y-5 lg:gap-20 pt-4 md:pt-[40px] items-center">
          <div className="col-span-12 md:col-span-5 place-self-center md:place-self-end my-auto">
            <Image
              src="/images/main.gif"
              height="600"
              width="600"
              className="h-80 sm:h-96 w-80 sm:w-96 object-contain mix-blend-multiply dark:mix-blend-plus-lighter rounded-full"
              alt="bkjbdskvbk"
            />
          </div>
          <div className="col-span-12 md:col-span-7 space-y-2.5">
            <div className=" text-pretty max-w-2xl">
              <h3 className="text-2xl md:text-3xl font-medium dark:text-white mb-2.5 ">
                Who am i?
              </h3>
              <p className="text-gray-500 dark:text-gray-400 leading-2 font-mono">
                I hail from Gorakhpur, a city in the northern part of India, and
                I see myself as a creative craftsman. I love building things,
                whether they are digital products or effective teams. When it
                comes to developing user interfaces. <br /> I enjoy using the
                latest technologies such as{" "}
                <span className="text-yellow-600 font-semibold">
                  (Angular, React, Vue etc..)
                </span>{" "}
                and other modern tools to create visually stunning and highly
                functional web applications for both businesses and consumers
                alike. With my passion for design and a keen attention to
                detail, I believe I can help bring your vision to life.
              </p>
              <p className="text-gray-500 dark:text-gray-400 leading-7 mt-2.5">
                My aim is to bring across your message and identity in the most
                creative way. I created web design for many famous brand
                companies.
              </p>
            </div>
            <div>
              <h3 className="text-4xl font-medium my-5 dark:text-white">
                Personal Info
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex">
                  <PhoneIcon className="text-4xl dark:bg-gray-700 p-1 rounded-md" />
                  <div className="space-y-1 ms-2 font-mono">
                    <p className="text-sm text-black/70 dark:text-white">
                      Phone
                    </p>
                    <h6 className="font-medium dark:text-white/50">
                      <a
                        className="hover:text-[#FA5252] duration-300 transition"
                        href="tel:+917078146612"
                      >
                        +91 7078146612
                      </a>
                    </h6>
                  </div>
                </div>
                <div className="flex">
                  <MailCheckIcon className="text-4xl text-sky-400 dark:bg-gray-700 p-1 rounded-md" />
                  <div className="space-y-1 ms-2 font-mono">
                    <p className="text-sm text-black/70 dark:text-white">
                      Email
                    </p>
                    <h6 className="font-medium dark:text-white/50">
                      <a
                        className="hover:text-[#FA5252] duration-300 transition"
                        href="mailto:code.devanshu@gmail.com"
                      >
                        code.devanshu@gmail.com
                      </a>
                    </h6>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <TechStack />
      </div>
    </div>
  );
};

export default AboutComponent;
