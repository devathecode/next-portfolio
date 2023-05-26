import React from 'react';
import Container from "@/app/components/Container";
import Progressbar from "@/app/components/Progressbar/Progressbar";
import Image from "next/image";

const Page = () => {
    const cubeClasses = 'bg-yellow-600 text-white h-16 md:h-24 w-20 md:w-28 flex justify-center items-center';
    const skillsArr = [
        {
            title: 'HTML',
            percentage: '80',
            experience: '2'
        },
        {
            title: 'CSS',
            percentage: '70',
            experience: '2'
        },
        {
            title: 'Javascript',
            percentage: '80',
            experience: '2'
        },
        {
            title: 'Angular',
            percentage: '80',
            experience: '2'
        },
        {
            title: 'React',
            percentage: '60',
            experience: '1'
        },
        {
            title: 'Tailwind',
            percentage: '80',
            experience: '1.5'
        },
        {
            title: 'Vue Js',
            percentage: '60',
            experience: '.5'
        },
        {
            title: 'Next Js',
            percentage: '60',
            experience: '1'
        },
        {
            title: 'Node',
            percentage: '80',
            experience: '1.5'
        }
    ];

    const cubesArr = [
        {
            heading: 'Fast',
            subHeading: 'Fast load times and lag free interaction, my highest priority.',
            icon: 'https://i.postimg.cc/j27hTpMB/speedometer.png'
        },
        {
            heading: 'Responsive',
            subHeading: 'My layouts will work on any device, big or small.',
            icon: 'https://i.postimg.cc/XJQQZ30h/responsive.png'
        },
        {
            heading: 'Intuitive',
            subHeading: 'Strong preference for easy to use, intuitive UX/UI.',
            icon: 'https://i.postimg.cc/TPPcZFbJ/intuitive.png'
        },
        {
            heading: 'Dynamic',
            subHeading: 'Websites don\'t have to be static, I love making pages come to life.',
            icon: 'https://i.postimg.cc/Dyymdh36/dynamic.png'
        }
    ]
    return (
        <Container>
            <h1 className="mt-16 text-yellow-600 uppercase text-center font-bold tracking-widest text-3xl md:text-4xl my-6 px-4 md:px-0 underline underline-offset-8 decoration-white decoration-2">Skills</h1>
            <div className="grid grid-cols-12 gap-2 md:gap-10">
                <div className="col-span-12 my-6">
                    <div className="grid grid-cols-12 gap-2 md:gap-10">
                        {cubesArr.map((data) => {
                            return <div
                                key={data.subHeading}
                                className="col-span-6 md:col-span-3 flex justify-center items-center flex-col text-center">
                                <div className={`${cubeClasses}`}
                                     style={{clipPath: "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)"}}>
                                    <Image src={data.icon} width="100" height="80" className="aspect-[7/3] object-contain invert" alt={`icon-${data.heading}`} priority={true}/>
                                </div>
                                <h1 className="text-xl md:text-2xl text-white tracking-widest mt-4">{data.heading}</h1>
                                <h2 className="text-gray-500 text-xs md:text-sm max-w-[17rem]">{data.subHeading}</h2>
                            </div>
                        })}
                    </div>
                </div>
                <div className="col-span-12 md:col-span-6 flex justify-center items-center flex-col">
                    {/*<img src="https://i.postimg.cc/6p4SHbrG/skills.png" className="max-w-full h-auto" alt=""/>*/}
                    {/*<img src="https://i.postimg.cc/8c1c4rxj/skills.png" className="max-w-full h-auto" alt=""/>*/}
                    {/*<img src="https://i.postimg.cc/nrzZMK6Y/skills.png" className="max-w-full h-auto" alt=""/>*/}
                    <div
                        className={`bg-yellow-600 text-white h-72 md:h-96 w-76 md:w-[27rem] flex justify-center items-center p-10`}
                        style={{clipPath: "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)"}}>
                        <Image width="400" height="400" src="https://i.postimg.cc/Ss0BbCmK/new.png" className="max-w-full h-auto object-contain" priority={true} alt="My-image"/>
                    </div>
                    <div className="mt-5">
                        <h1 className="text-white text-center">
                            As a <span className="text-yellow-600">frontend developer</span> I am
                            passionate about creating user-friendly and engaging interfaces that elevate the user
                            experience. My experience in designing and developing <span className="text-yellow-600">responsive, </span>
                            <span className="text-yellow-600">cross-platform web </span>
                            applications has allowed me to develop a strong ability to balance creative and technical
                            aspects in order to produce visually appealing and functional applications.
                        </h1>
                    </div>
                </div>
                <div className="col-span-12 md:col-span-6 my-auto">
                    <div className="grid grid-cols-12 gap-y-3">
                        {skillsArr.sort((a, b) => +b.percentage - +a.percentage).map((data) => {
                            return <div className="col-span-12" key={data.title}>
                                <Progressbar data={data}/>
                            </div>
                        })}
                    </div>
                </div>
                {/*<div className="col-span-12 md:col-span-6 my-auto">*/}
                {/*    /!*<img src="https://i.postimg.cc/3xJfHJkR/skills.png" alt=""/>*!/*/}
                {/*    <img src="https://i.postimg.cc/8k7rx8kS/skills-2.png" alt=""/>*/}
                {/*    /!*<p className="text-white">*!/*/}
                {/*    /!*    Here are the skills that i worked on and still couting..*!/*/}
                {/*    /!*</p>*!/*/}
                {/*</div>*/}
            </div>
        </Container>
    );
};

export default Page;