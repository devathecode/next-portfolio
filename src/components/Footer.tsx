import { BsLinkedin } from "react-icons/bs";

const Footer = () => {
  return (
    <footer className="w-full border-t border-[var(--border)] bg-[var(--bg-secondary)]">
      {/* Bottom bar */}
      <div className="border-t border-[var(--border)] px-6 py-5">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-[var(--text-muted)] font-mono">
            © {new Date().getFullYear()}{" "}
            <span className="text-[var(--accent)]">Devanshu Verma</span> —
            designed &amp; built by me
          </p>

          <div className="flex items-center gap-4">
            <a
              href="https://www.linkedin.com/in/devthecoder/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors duration-200"
            >
              <BsLinkedin size={18} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
