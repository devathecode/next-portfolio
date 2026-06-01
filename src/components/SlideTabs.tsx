"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { HomeIcon, UserIcon, LaptopIcon, Contact2Icon, PenLineIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

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
  { title: "Home",    href: "#home",    icon: HomeIcon     },
  { title: "About",   href: "#about",   icon: UserIcon     },
  { title: "Work",    href: "#work",    icon: LaptopIcon   },
  { title: "Contact", href: "#contact", icon: Contact2Icon },
  { title: "Blog",    href: "/blog",    icon: PenLineIcon  },
];

export const SlideTabsExample: React.FC = () => {
  return <SlideTabs />;
};

const SlideTabs: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const isHomePage = pathname === "/";

  const pageTabIndex = navigationItems.findIndex(
    (n) => !n.href.startsWith("#") && pathname.startsWith(n.href)
  );

  const [position, setPosition] = useState<Position>({
    left: 0,
    width: 0,
    opacity: isHomePage ? 1 : 0,
  });
  const [activeIndex, setActiveIndex] = useState(isHomePage ? 0 : pageTabIndex);
  const isClickScrolling = useRef(false);
  const tabsRef = useRef<(HTMLLIElement | null)[]>([]);

  // Highlight the matching page-route tab (e.g. /blog)
  useEffect(() => {
    if (pageTabIndex === -1) return;
    setActiveIndex(pageTabIndex);
    const tabEl = tabsRef.current[pageTabIndex];
    if (tabEl) {
      const { width } = tabEl.getBoundingClientRect();
      setPosition({ left: tabEl.offsetLeft, width, opacity: 1 });
    }
  }, [pageTabIndex]);

  useEffect(() => {
    // Only run scroll-spy on the home page
    if (!isHomePage) {
      if (pageTabIndex === -1) {
        setActiveIndex(-1);
        setPosition((p) => ({ ...p, opacity: 0 }));
      }
      return;
    }

    // Only the href list is stable — re-query elements on every check, since
    // async sections (e.g. Work's Supabase-fetched content) may not exist in
    // the DOM yet at mount time, which would otherwise permanently cache a
    // null and make that section unreachable by scroll-spy forever.
    const hashItems = navigationItems.filter((n) => n.href.startsWith("#"));

    let ticking = false;
    const handleScroll = () => {
      if (isClickScrolling.current) return;
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const line = window.innerHeight / 3;
        for (let i = hashItems.length - 1; i >= 0; i--) {
          const section = document.querySelector(hashItems[i].href);
          if (section) {
            const rect = section.getBoundingClientRect();
            if (rect.top <= line && rect.bottom >= line) {
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
  }, [isHomePage, pageTabIndex]);

  return (
    <ul
      role="menubar"
      aria-label="Primary"
      onMouseLeave={() => {
        if (!isHomePage && pageTabIndex === -1) {
          setPosition((p) => ({ ...p, opacity: 0 }));
          return;
        }
        const tabElement = tabsRef.current[activeIndex];
        if (tabElement) {
          const { width } = tabElement.getBoundingClientRect();
          setPosition({
            left: tabElement.offsetLeft,
            width,
            opacity: activeIndex === -1 ? 0 : 1,
          });
        }
      }}
      className="relative mx-auto flex w-fit rounded-full p-0.5"
    >
      {navigationItems.map((item, index) => (
        <Tab
          key={item.href}
          title={item.title}
          isActive={index === activeIndex}
          setPosition={setPosition}
          onClick={() => {
            const isPageLink = !item.href.startsWith("#");
            if (isPageLink) {
              router.push(item.href);
              return;
            }
            if (!isHomePage) {
              router.push(item.href === "#home" ? "/" : `/${item.href}`);
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
  isActive?: boolean;
}

const Tab = React.forwardRef<HTMLLIElement, TabProps>(function TabComponent(
  { children, setPosition, onClick, title, isActive },
  ref
) {
  return (
    <li
      ref={ref}
      role="menuitem"
      tabIndex={0}
      title={title}
      aria-label={title}
      aria-current={isActive ? "page" : undefined}
      onMouseEnter={(e) => {
        const { width } = e.currentTarget.getBoundingClientRect();
        setPosition({
          left: e.currentTarget.offsetLeft,
          width,
          opacity: 1,
        });
      }}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
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
