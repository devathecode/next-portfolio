import type { Metadata } from "next";
import "./globals.css";
import ContentContainer from "./components/ContentContainer";
import { ThemeProvider } from "next-themes";
import { poppins } from "./fonts";


export const metadata: Metadata = {
  title: "Devanshu verma | Frontend developer",
  description: `India's creative craftsman building great web apps. I leverage Angular, React, Vue.js for UIs for businesses & consumers. Keen eye for detail realizes your vision.`,
  keywords: ['Angular', 'Angular developers', 'Nextjs', 'Nextjs developers', 'React', 'React developers', 'Javascript developers', 'Web Development'],
  icons: {
    icon: "/devanshu.png"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={poppins.className}>
        <ThemeProvider attribute="class">
          <ContentContainer>
            {children}
          </ContentContainer>
        </ThemeProvider >
      </body>
    </html>
  );
}
