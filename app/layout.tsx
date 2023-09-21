import './globals.css'
import {Inter} from 'next/font/google'
import ContentContainer from "@/app/components/ContentContainer";

const inter = Inter({subsets: ['latin']});

export const metadata = {
    title: 'Devanshu Verma | Frontend developer',
    description: 'Devanshu Verma, Gorakhpur-based frontend developer, crafts visually stunning web apps with Angular, React, Vue, Nextjs and modern tools.',
    keywords: ['Angular', 'React', 'Nextjs', 'Vue', 'Gorakhpur']
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
