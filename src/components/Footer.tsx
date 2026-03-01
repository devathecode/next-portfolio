import { BsGithub, BsLinkedin } from "react-icons/bs";

const Footer = () => {
  return (
    <footer className="w-full border-t border-gray-200 dark:border-white/5 py-8 px-4">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          © {new Date().getFullYear()}{" "}
          <span className="text-yellow-600 font-medium">Devanshu Verma</span>.
          All rights reserved.
        </p>

        <div className="flex items-center gap-4">
          <span
            aria-label="GitHub (coming soon)"
            title="GitHub (coming soon)"
            className="text-gray-300 dark:text-gray-600 cursor-not-allowed"
          >
            <BsGithub size={20} />
          </span>
          <a
            href="https://www.linkedin.com/in/devthecoder/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="text-gray-500 dark:text-gray-400 hover:text-yellow-600 dark:hover:text-yellow-600 transition-colors duration-200"
          >
            <BsLinkedin size={20} />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
