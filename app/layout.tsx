import './globals.css'
import { Inter } from 'next/font/google'
import Header from "@/app/components/Header";
import ContentContainer from "@/app/components/ContentContainer";

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
    title: 'Devanshu Verma',
    description: 'Devanshu verma is a frontend web developer from Gorakhpur',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
      <ContentContainer>
        {children}
      </ContentContainer>
      </body>
    </html>
  )
}
