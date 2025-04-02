import ThemeToggle from "@/components/ThemeToggle";
import { SlideTabsExample } from "./SlideTabs";

export default function Header() {
  return (
    <header className="p-2 md:p-4 min-h-[8vh]">
      <nav className="fixed mt-0 md:mt-3 left-1/2 top-0 z-50 max-w-lg md:max-w-7xl flex w-full md:w-11/12 -translate-x-1/2 flex-col items-center rounded-none md:rounded-full bg-background/20 p-2 px-2 md:px-5 backdrop-blur-lg border border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between w-full max-w-lg md:max-w-7xl gap-0 md:gap-2">
          <div className="h-10 w-10 bg-black dark:bg-white rounded-full flex items-center justify-center text-sm font-bold text-white dark:text-yellow-600 ">
            DV
          </div>

          <SlideTabsExample />
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}
