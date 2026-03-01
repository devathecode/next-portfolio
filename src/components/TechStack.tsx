"use client";

import { FaReact, FaNodeJs, FaDocker, FaDatabase } from "react-icons/fa";
import {
  SiTailwindcss,
  SiNextdotjs,
  SiGraphql,
  SiTypescript,
  SiAngular,
  SiVuedotjs,
  SiNuxtdotjs,
  SiSalesforce,
} from "react-icons/si";
import { useEffect, useRef, FC, JSX } from "react";

interface Technology {
  name: string;
  icon: JSX.Element;
}

const technologies: Technology[] = [
  { name: "React", icon: <FaReact className="text-blue-500" size={40} /> },
  {
    name: "Next.js",
    icon: <SiNextdotjs className="text-black dark:text-white" size={40} />,
  },
  { name: "Node.js", icon: <FaNodeJs className="text-green-500" size={40} /> },
  {
    name: "Tailwind CSS",
    icon: <SiTailwindcss className="text-blue-400" size={40} />,
  },
  { name: "GraphQL", icon: <SiGraphql className="text-pink-500" size={40} /> },
  {
    name: "TypeScript",
    icon: <SiTypescript className="text-blue-600" size={40} />,
  },
  { name: "Docker", icon: <FaDocker className="text-blue-500" size={40} /> },
  {
    name: "Database",
    icon: <FaDatabase className="text-gray-600" size={40} />,
  },
  { name: "Angular", icon: <SiAngular className="text-red-500" size={40} /> },
  { name: "Vue.js", icon: <SiVuedotjs className="text-green-500" size={40} /> },
  {
    name: "Nuxt.js",
    icon: <SiNuxtdotjs className="text-green-400" size={40} />,
  },
  {
    name: "Salesforce LWC",
    icon: <SiSalesforce className="text-blue-600" size={40} />,
  },
];

const TechStack: FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scroll = () => {
      if (scrollRef.current) {
        scrollRef.current.scrollLeft += 1;
        if (scrollRef.current.scrollLeft >= scrollRef.current.scrollWidth / 2) {
          scrollRef.current.scrollLeft = 0;
        }
      }
    };
    const interval = setInterval(scroll, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-12">
      <div className="container mx-auto text-center px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-center items-center">
          <h2 className="text-3xl text-center font-semibold text-gray-900 dark:text-white mb-4">
            Technologies I Specialize In
          </h2>
          <div className="h-0.5 w-32 md:w-72 bg-gradient-to-r from-yellow-600 via-yellow-700 to-yellow-800 mb-3" />
        </div>

        {/* Carousel with fade masks on both edges */}
        <div className="relative w-full max-w-xs sm:max-w-md md:max-w-lg lg:max-w-6xl mx-auto">
          {/* Left fade */}
          <div className="absolute left-0 top-0 bottom-0 w-16 z-10 bg-gradient-to-r from-gray-50 dark:from-[#0d0d0d] to-transparent pointer-events-none" />
          {/* Right fade */}
          <div className="absolute right-0 top-0 bottom-0 w-16 z-10 bg-gradient-to-l from-gray-50 dark:from-[#0d0d0d] to-transparent pointer-events-none" />

          <div
            className="overflow-hidden whitespace-nowrap"
            ref={scrollRef}
          >
            <div className="flex w-max space-x-6 animate-scroll">
              {[...technologies, ...technologies].map((tech, index) => (
                <div
                  key={index}
                  className="p-6 flex flex-col items-center justify-center rounded-2xl min-w-[120px] sm:min-w-[150px]"
                >
                  {tech.icon}
                  <p className="mt-2 text-sm sm:text-base font-semibold text-gray-700 dark:text-gray-300">
                    {tech.name}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TechStack;
