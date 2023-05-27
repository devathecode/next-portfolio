import React from 'react';
import Container from "@/app/components/Container";
import Projectcard from "@/app/components/Projectcard/Projectcard";

export const metadata = {
    title: 'Projects | Devanshu Verma',
    description: 'Devanshu verma is a frontend web developer from Gorakhpur',
}

const projectsDataArr = [
    {
        mainImage: `/images/netflix-clone/Netflix-Clone.png`,
        heading: 'Netflix Clone',
        description: `I designed and developed my own portfolio website using React, Sass, and Figma.
                                        The website features a clean and modern design and showcases my skills and
                                        experience as a frontend developer. The website also includes a blog section
                                        where I share my thoughts and insights on web development and design.`,
        url: 'https://netflix-react-ui-clone.netlify.app/',
        modalViewDataArr: [
            {
                id: 1,
                imageUrl: `/images/netflix-clone/Home-Netflix.png`,
                caption: "Image 1",
            }
        ],
        note: `
        We have tried to replicate the UI of netflix using react and tailwindcss. This is not being used for making any competition with netflix or gathering viewers.
        This project is still in progress you can just have the desktop view for now.`
    },
    {
        mainImage: `/images/E-commerce-banner.png`,
        heading: 'E-commerce shoe website',
        description: `I have recently created the frontend of an e-commerce shoe website using Next.js and Tailwind.
         To ensure the website is up-to-date and efficient, I utilized the latest version of Next.js,
          specifically version 13.2. The website has a visually appealing design, with a user-friendly interface,
           making it easy for customers to browse and shop for their desired shoes. Currently, I am working on integrating
            a backend to enhance the website's functionality and provide more advanced features. This backend integration
             will enable me to incorporate payment gateways, improve the search functionality, and manage orders and
              customer data seamlessly. The ultimate goal is to create a high-performance and reliable e-commerce shoe
               website that delivers an exceptional customer experience.`,
        url: 'https://e-commerce-psi-flax.vercel.app/home',
        modalViewDataArr: [
            {
                id: 1,
                imageUrl: `/images/e-commerce/img-desktop.png`,
                caption: "Image 1",
            }
        ]
    },
    {
        mainImage: `/images/calculator-all-view.png`,
        heading: 'GoCalc - Calculator Hub',
        description: `GoCalc - GoCalc is a realtime calculator with no wait time. It currently has two calculators like income tax an
        percentage calculator`,
        url: 'https://tax-calculator-nine.vercel.app/home',
        modalViewDataArr: [
            {
                id: 1,
                imageUrl: `/images/calculator/homepage.png`,
                caption: "Image 1",
            },
            {
                id: 2,
                imageUrl: `/images/calculator/taxCalculator.png`,
                caption: "Image 2",
            }
        ]
    },
]

const Page = () => {
    return (
        <Container>
            <h1 className="mt-16 text-yellow-600 text-center font-bold tracking-wider text-4xl my-6 px-4 md:px-0 underline underline-offset-8 decoration-white decoration-2">Projects</h1>
            <div className="grid grid-cols-12 gap-2 sm:gap-4 md:gap-6 lg:gap-8 mt-10">
                {projectsDataArr.map((data: any) => {
                    return <div key={data.url} className="col-span-12 md:col-span-6 lg:col-span-4 place-self-center">
                        <Projectcard projectName={data.heading}
                                     cardImage={data.mainImage}
                                     desc={data.description}
                                     url={data.url}
                                     note={data.note}
                                     modalImageArr={data.modalViewDataArr}/>
                    </div>
                })}
            </div>
        </Container>
    );
};

export default Page;