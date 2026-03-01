import AboutComponent from "@/components/About";
import ContactComponent from "@/components/Contact";
import HomeComponent from "@/components/Home";
import WorkComponent from "@/components/Work";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main>
      {/* Hero */}
      <div className="max-w-7xl mx-auto">
        <HomeComponent />
      </div>

      {/* About — alternate background */}
      <div className="w-full bg-gray-50 dark:bg-white/[0.02] border-y border-gray-200 dark:border-white/5">
        <div className="max-w-7xl mx-auto">
          <AboutComponent />
        </div>
      </div>

      {/* Work */}
      <div className="max-w-7xl mx-auto">
        <WorkComponent />
      </div>

      {/* Contact — alternate background */}
      <div className="w-full bg-gray-50 dark:bg-white/[0.02] border-y border-gray-200 dark:border-white/5">
        <div className="max-w-7xl mx-auto">
          <ContactComponent />
        </div>
      </div>

      <Footer />
    </main>
  );
}
