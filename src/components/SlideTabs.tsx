"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { HomeIcon, UserIcon, LaptopIcon, Contact2Icon } from "lucide-react";

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
  const [position, setPosition] = useState<Position>({
    left: 0,
    width: 0,
    opacity: 1,
  });
  const [activeIndex, setActiveIndex] = useState(0);
  const isClickScrolling = useRef(false);
  const tabsRef = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    const handleScroll = () => {
      if (isClickScrolling.current) return;

      for (let i = navigationItems.length - 1; i >= 0; i--) {
        const section = document.querySelector(navigationItems[i].href);
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
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <ul
      onMouseLeave={() => {
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
      className="relative mx-auto flex w-fit rounded-full p-1"
    >
      {navigationItems.map((item, index) => (
        <Tab
          key={item.href}
          setPosition={setPosition}
          onClick={() => {
            isClickScrolling.current = true;
            setActiveIndex(index);
            const section = document.querySelector(item.href);
            if (section) {
              const offset = (10 * window.innerHeight) / 90; // 10vh offset
              const top =
                section.getBoundingClientRect().top + window.scrollY - offset;
              window.scrollTo({ top, behavior: "smooth" });
              setTimeout(() => (isClickScrolling.current = false), 500); // Prevent flickering during scroll
            }
          }}
          ref={(el) => {
            if (el) tabsRef.current[index] = el;
          }}
        >
          <div
            className={`flex group-hover:text-yellow-600 ${
              index === activeIndex ? "text-yellow-600" : ""
            }`}
          >
            <item.icon className="text-xs" />
            <span className="ms-2 hidden lg:block">{item.title}</span>
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
}

const Tab = React.forwardRef<HTMLLIElement, TabProps>(function TabComponent(
  { children, setPosition, onClick },
  ref
) {
  return (
    <li
      ref={ref}
      onMouseEnter={(e) => {
        const { width } = e.currentTarget.getBoundingClientRect();
        setPosition({
          left: e.currentTarget.offsetLeft,
          width,
          opacity: 1,
        });
      }}
      onClick={onClick}
      className={`relative cursor-pointer z-10 md:block group px-3 rounded-full flex justify-center items-center text-xs uppercase md:px-5 md:py-3 md:text-base h-12 

      `}
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
      className="absolute z-0 h-12 rounded-full border border-yellow-600 text-white"
    />
  );
};
