"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { HomeIcon, UserIcon, LaptopIcon, Contact2Icon } from "lucide-react";
import { usePathname } from "next/navigation";

interface NavigationItem {
  title: string;
  href: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: React.FC<any>;
}

interface Position {
  left: number;
  width: number;
  opacity: number;
}

export const navigationItems: NavigationItem[] = [
  {
    title: "Home",
    href: "#home",
    icon: HomeIcon,
  },
  {
    title: "About",
    href: "#about",
    icon: UserIcon,
  },
  {
    title: "Work",
    href: "#work",
    icon: LaptopIcon,
  },
  {
    title: "Contact",
    href: "#contact",
    icon: Contact2Icon,
  },
];

export const SlideTabsExample: React.FC = () => {
  return <SlideTabs />;
};

const SlideTabs: React.FC = () => {
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  const [position, setPosition] = useState<Position>({
    left: 0,
    width: 0,
    opacity: isHomePage ? 1 : 0,
  });
  const [activeIndex, setActiveIndex] = useState(isHomePage ? 0 : -1);
  const isClickScrolling = useRef(false);
  const tabsRef = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    // Only run scroll-spy on the home page
    if (!isHomePage) {
      setActiveIndex(-1);
      setPosition((p) => ({ ...p, opacity: 0 }));
      return;
    }

    // Cache section elements once
    const sections = navigationItems.map((item) =>
      document.querySelector(item.href)
    );

    let ticking = false;
    const handleScroll = () => {
      if (isClickScrolling.current) return;
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        for (let i = sections.length - 1; i >= 0; i--) {
          const section = sections[i];
          if (section) {
            const rect = section.getBoundingClientRect();
            if (
              rect.top <= window.innerHeight / 7 &&
              rect.bottom >= window.innerHeight / 3
            ) {
              setActiveIndex(i);
              const tabElement = tabsRef.current[i];
              if (tabElement) {
                const { width } = tabElement.getBoundingClientRect();
                setPosition({
                  left: tabElement.offsetLeft,
                  width,
                  opacity: 1,
                });
              }
              break;
            }
          }
        }
        ticking = false;
      });
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHomePage]);

  return (
    <ul
      onMouseLeave={() => {
        if (!isHomePage) {
          setPosition((p) => ({ ...p, opacity: 0 }));
          return;
        }
        const tabElement = tabsRef.current[activeIndex];
        if (tabElement) {
          const { width } = tabElement.getBoundingClientRect();
          setPosition({
            left: tabElement.offsetLeft,
            width,
            opacity: 1,
          });
        }
      }}
      className="relative mx-auto flex w-fit rounded-full p-0.5"
    >
      {navigationItems.map((item, index) => (
        <Tab
          key={item.href}
          title={item.title}
          setPosition={setPosition}
          onClick={() => {
            if (!isHomePage) {
              // Navigate to home page — for Home go to /, others go to /#section
              window.location.href =
                item.href === "#home" ? "/" : `/${item.href}`;
              return;
            }
            isClickScrolling.current = true;
            setActiveIndex(index);
            const section = document.querySelector(item.href);
            if (section) {
              const offset = (10 * window.innerHeight) / 90;
              const top =
                section.getBoundingClientRect().top + window.scrollY - offset;
              window.scrollTo({ top, behavior: "smooth" });
              setTimeout(() => (isClickScrolling.current = false), 500);
            }
          }}
          ref={(el) => {
            if (el) tabsRef.current[index] = el;
          }}
        >
          <div
            className={`flex items-center transition-colors duration-150 ${
              index === activeIndex
                ? "text-[var(--accent)]"
                : "text-[var(--text-secondary)] group-hover:text-[var(--accent)]"
            }`}
          >
            <item.icon className="w-3.5 h-3.5" />
            <span className="ms-1.5 hidden md:block text-xs font-medium">{item.title}</span>
          </div>
        </Tab>
      ))}

      <Cursor position={position} />
    </ul>
  );
};

interface TabProps {
  children: React.ReactNode;
  setPosition: React.Dispatch<React.SetStateAction<Position>>;
  onClick: () => void;
  title?: string;
}

const Tab = React.forwardRef<HTMLLIElement, TabProps>(function TabComponent(
  { children, setPosition, onClick, title },
  ref
) {
  return (
    <li
      ref={ref}
      title={title}
      onMouseEnter={(e) => {
        const { width } = e.currentTarget.getBoundingClientRect();
        setPosition({
          left: e.currentTarget.offsetLeft,
          width,
          opacity: 1,
        });
      }}
      onClick={onClick}
      className="relative cursor-pointer z-10 group px-3 md:px-4 py-2.5 rounded-full flex justify-center items-center h-9"
    >
      {children}
    </li>
  );
});

interface CursorProps {
  position: Position;
}

const Cursor: React.FC<CursorProps> = ({ position }) => {
  return (
    <motion.li
      animate={{
        ...position,
      }}
      className="absolute z-0 h-9 rounded-full border border-[var(--accent)]/60 bg-[var(--accent-muted)] shadow-[0_0_14px_var(--accent-glow)]"
    />
  );
};
