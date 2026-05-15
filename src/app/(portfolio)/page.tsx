import AboutComponent from "@/components/About";
import ContactComponent from "@/components/Contact";
import HomeComponent from "@/components/Home";
import WorkComponent from "@/components/Work";
import Footer from "@/components/Footer";
import HireMeCTA from "@/components/HireMeCTA";

export default function Home() {
  return (
    <main>
      <HireMeCTA />
      {/* Hero */}
      <div className="max-w-full mx-auto">
        <HomeComponent />
      </div>

      {/* About — alternate background */}
      <div
        className="w-full border-y"
        style={{
          background: "linear-gradient(135deg, var(--bg-secondary) 0%, var(--accent-muted) 100%)",
          borderColor: "var(--border)",
        }}
      >
        <div className="max-w-7xl mx-auto">
          <AboutComponent />
        </div>
      </div>

      {/* Work */}
      <div className="max-w-7xl mx-auto">
        <WorkComponent />
      </div>

      {/* Contact — alternate background */}
      <div
        className="w-full border-y"
        style={{
          background: "linear-gradient(135deg, var(--bg-secondary) 0%, var(--accent-muted) 100%)",
          borderColor: "var(--border)",
        }}
      >
        <div className="max-w-7xl mx-auto">
          <ContactComponent />
        </div>
      </div>

      <Footer />
    </main>
  );
}
