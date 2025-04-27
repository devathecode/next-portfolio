import { DownloadIcon } from "lucide-react";
import Image from "next/image";

const HomeComponent = () => {
  return (
    <div
      className="grid grid-cols-12 p-4 lg:gap-20 font-mono mt-10 min-h-[60vh]"
      id="home"
    >
      <div className="col-span-12 lg:col-span-7 my-auto place-self-center order-2 lg:order-1">
        <div className="text-3xl mt-3">
          Hi <div className="animate-wiggle inline-flex">&#128075;</div>, I am{" "}
          <span className="text-yellow-600">Devanshu verma</span>{" "}
        </div>
        <p className="text-base text-gray-500 dark:text-gray-400 max-w-2xl my-1 font-mono">
          As a Frontend developer - My aim is to bring across your message and
          identity in the most creative way. I created web design for many
          famous brand companies.
        </p>
        <p className="text-gray-500 dark:text-gray-400">
          With over 4 years of experience, I take pride in crafting robust and
          scalable frontend products with exceptional user interfaces.
        </p>
        <a
          href="/resume/Resume.pdf"
          className="relative mt-4 inline-flex items-center justify-center p-4 px-6 py-2 overflow-hidden font-medium
             text-indigo-600 transition duration-300 ease-out border-2 border-yellow-600 rounded-md shadow-md group"
        >
          <span className="absolute inset-0 flex items-center justify-center w-full h-full text-white duration-300 -translate-x-full bg-yellow-600 group-hover:translate-x-0 ease">
            <DownloadIcon />
          </span>
          <span className="absolute flex items-center justify-center w-full h-full text-yellow-600 transition-all duration-300 transform group-hover:translate-x-full ease">
            Download Resume
          </span>
          <span className="relative invisible">Download Resume</span>
        </a>
      </div>
      <div className="col-span-12 lg:col-span-5 order-1 lg:order-2 place-self-center">
        <Image
          src="/images/dev.png"
          height="600"
          width="600"
          className="h-96 w-96 object-contain rounded-full bg-yellow-600 dark:bg-gray-900"
          alt="bkjbdskvbk"
        />
      </div>
    </div>
  );
};

export default HomeComponent;
