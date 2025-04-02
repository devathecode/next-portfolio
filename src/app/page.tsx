import AboutComponent from "@/components/About";
import ContactComponent from "@/components/Contact";
import HomeComponent from "@/components/Home";
import WorkComponent from "@/components/Work";

export default function Home() {
  return (
    <main className="max-w-7xl mx-auto">
      <HomeComponent />
      <AboutComponent />
      <WorkComponent />
      <ContactComponent />
    </main>
  );
}
