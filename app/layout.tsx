import type { Metadata } from "next";
import "./globals.css";
import ContentContainer from "./components/ContentContainer";
import { ThemeProvider } from "next-themes";
import { poppins } from "./fonts";


export const metadata: Metadata = {
  title: "Devanshu verma | Frontend developer",
  description: `I hail from Gorakhpur, a city in the northern part of India, and I see myself as a creative craftsman. I love building things, whether they are digital products or effective teams.
  When it comes to developing user interfaces. I enjoy using the latest technologies such as (Angular, React, Vue etc..) and other modern tools to create visually stunning and highly functional web applications for both businesses and consumers alike.
  With my passion for design and a keen attention to detail, I believe I can help bring your vision to life`,
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
