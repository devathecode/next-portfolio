import { FaLinkedin } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { IoMdDownload } from "react-icons/io";
import Image from "next/image";

export default function Home() {
  return (
    <div className="cpm">
      <div className="flex flex-col justify-center items-center h-[70vh] mt-10 text-center">
        <div className="h-80 w-80 rounded-full relative">
          <Image width="400" height="500" src="https://firebasestorage.googleapis.com/v0/b/dev-cms-46756.appspot.com/o/devanshuv1501%40gmail.com%2FWhatsApp%20Image%202024-03-29%20at%2011.45.36%20PM.jpeg?alt=media&token=9db92477-b6c9-4a51-adf9-3df15828b3d1"
            priority={true}
            className="absolute inset-0 h-80 w-80 rounded-full object-cover"
            alt="Main-image" />
        </div>
        <h1 className="text-4xl mt-3 dark:text-white/80 text-black/70">Devanshu verma</h1>
        <p className="text-gray-500 my-3">Frontend developer</p>
        <div className="flex justify-between space-x-2">
          <FaLinkedin className="text-3xl" />
          <FaInstagram className="text-[1.970rem]" />
        </div>
        <a href="/resume/Resume.pdf" target="_blank"
          className="mt-5 text-black/70 dark:text-white/80 uppercase text-sm border-b-2 border-yellow-600 pb-2 decoration-2 font-bold tracking-widest inline-flex items-center cursor-pointer overflow-y-hidden">
          <IoMdDownload className="animate-download-button me-3 text-xl text-black/70 dark:text-white/80 " />
          <span>Download Resume</span>
        </a>
      </div>
    </div>
  );
}
