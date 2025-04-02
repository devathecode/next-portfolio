import { Link2Icon } from "lucide-react";
import { FC } from "react";
import { BsGithub } from "react-icons/bs";

interface Project {
  title: string;
  description: string;
  image: string;
  liveUrl: string;
  githubUrl?: string;
  techStack: string[];
}

const projects: Project[] = [
  {
    title: "NPM Library",
    description:
      "It is a simple and easy-to-use library for creating tables with pagination in Angular.",
    image: "/portfolio.png",
    liveUrl: "https://www.npmjs.com/package/ngx-table-with-pagination",
    techStack: ["Angular", "Tailwind CSS"],
  },
  {
    title: "Web app",
    description:
      "GoCalc - Calculator Hub is a web app that provides a collection of calculators for various purposes.",
    image: "/ecommerce.png",
    liveUrl: "https://go-calc.vercel.app/",
    techStack: ["Next.js", "Tailwind CSS"],
  },
  {
    title: "Web app",
    description:
      "E-commerce shoes store is a web app that provides a collection of shoes.",
    image: "/taskmanager.png",
    liveUrl: "https://e-commerce-psi-flax.vercel.app/home",
    techStack: ["Next.js", "Tailwind CSS"],
  },
  {
    title: "Web app",
    description:
      "Netflix clone is a web app that provides a collection of movies and TV shows.",
    image: "/taskmanager.png",
    liveUrl: "https://netflix-react-ui-clone.netlify.app/",
    techStack: ["Next.js", "Tailwind CSS"],
  },
];

const WorkComponent: FC = () => {
  return (
    <section
      className="flex flex-col items-center justify-center min-h-[40vh]"
      id="work"
    >
      <div className="text-center px-6 sm:px-8 lg:px-12">
        <div className="flex flex-col items-center">
          <h2 className="text-2xl md:text-5xl text-center font-bold text-gray-900 dark:text-white mb-4">
            Featured Projects
          </h2>
          <div className="h-0.5 w-32 md:w-72 bg-gradient-to-r from-yellow-600 via-yellow-700 to-yellow-800 mb-3"></div>
        </div>

        <div className="flex flex-row justify-center md:justify-self-auto gap-y-4 gap-2 flex-wrap pt-4 md:pt-[40px]">
          {projects.map((project) => {
            return (
              <div
                key={project.liveUrl}
                className="max-w-72 dark:bg-gray-900 p-6 border border-yellow-600 font-mono"
              >
                <div className="flex flex-row justify-between">
                  <div></div>

                  <div className="flex flex-row gap-2 items-center">
                    <BsGithub className="text-2xl" />
                    <a href={project.liveUrl} target="_blank">
                      <Link2Icon className="text-green-600" />
                    </a>
                  </div>
                </div>

                <h2 className="light-slate mt-4 font-semibold text-lg text-yellow-600">
                  {project.title}
                </h2>
                <p className="slate font-sans py-2 text-sm line-clamp-3 text-gray-500 dark:text-gray-400">
                  {project.description}
                </p>
                <hr />
                <div className="py-2 text-sm flex flex-row gap-2 slate">
                  {project.techStack.map((tech) => {
                    return (
                      <div
                        key={tech}
                        className="bg-gray-200 dark:bg-gray-800 text-yellow-600 rounded-full text-xs px-2 py-1"
                      >
                        {tech}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WorkComponent;
