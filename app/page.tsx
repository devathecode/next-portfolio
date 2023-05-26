import Container from "@/app/components/Container";
import React from "react";
import Image from "next/image";
import Typed from "@/app/components/Typed/Typed";

export default function Home() {
    return (
        <Container>
            <div className="grid grid-cols-12 border-b-2 border-gray-400 gap-y-10 lg:gap-y-0 sm:mt-16">
                <div className="col-span-12 lg:col-span-7 order-last lg:order-first px-4 md:px-0 my-auto">
                    <div className="font-semibold">
                        <span className="text-5xl sm:text-6xl md:text-7xl text-white">Nice to meet you!</span>
                        <div className="text-4xl sm:text-5xl md:text-6xl my-2 text-yellow-600">
                            <div className="underline underline-offset-8 decoration-white decoration-2">
                                <Typed/>
                            </div>
                        </div>
                    </div>
                    <div className="text-gray-300 mt-10">
                        <p className="text-sm sm:pr-10">
                            I hail from Gorakhpur, a city in the northern part of India, and I see myself as a creative
                            craftsman. I love building things, whether they are digital products or effective teams.
                            <br/>
                            <br/>
                            When it comes to developing user interfaces.
                            I enjoy using the latest technologies such as <span
                            className="text-yellow-600">(Angular, React, Vue etc..)</span> and other modern tools to
                            create visually stunning and highly
                            functional web applications for both businesses and consumers alike.
                            <br/><br/>
                            With my passion for
                            design and a keen attention to detail, I believe I can help bring your vision to life.
                        </p>
                        <div className="flex flex-row mt-3 space-x-4">
                            <a href="https://www.linkedin.com/in/devthecoder" target="_blank">
                                {/*<FontAwesomeIcon icon={faLinkedin} className="h-8 md:h-10 w-8 md:w-10"/>*/}
                                <Image src="https://i.postimg.cc/SQWzQ925/linkedin.png" alt="linkedin-logo"
                                       width="32" height="32"
                                       priority={true}
                                       className="h-8 md:h-9 w-8 md:w-9"/>
                            </a>
                            <a href="https://instagram.com/dev.thedeveloper?igshid=ZDdkNTZiNTM=" target="_blank">
                                {/*<FontAwesomeIcon icon={faInstagram} className="h-8 md:h-10 w-8 md:w-10"/>*/}
                                <Image src="https://i.postimg.cc/bNJv4Vbz/instagram.png" alt="instagram-logo"
                                       width="32" height="32"
                                       priority={true}
                                       className="h-8 md:h-9 w-8 md:w-9"/>
                            </a>
                        </div>
                        <a href="/resume/Resume.pdf" target="_blank"
                           className="my-12 uppercase text-sm border-b-2 border-yellow-600 pb-2 decoration-2 font-bold tracking-widest inline-flex items-center cursor-pointer overflow-y-hidden">
                            <svg className="animate-download-button mr-2 h-5 w-5 mb-1"
                                 xmlns="http://www.w3.org/2000/svg"
                                 viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path d="M12 16L12 8"></path>
                                <path
                                    d="M9 13L11.913 15.913V15.913C11.961 15.961 12.039 15.961 12.087 15.913V15.913L15 13"></path>
                                <path
                                    d="M3 15L3 16L3 19C3 20.1046 3.89543 21 5 21L19 21C20.1046 21 21 20.1046 21 19L21 16L21 15"></path>
                            </svg>
                            <span>Download Resume</span>
                        </a>
                    </div>
                </div>
                <div className="col-span-12 lg:col-span-5 place-self-center order-first lg:order-last relative">
                    <Image width="400" height="500" src="https://i.postimg.cc/hv7yCfxR/myImg.jpg"
                           priority={true}
                           className="h-72 md:h-80 lg:h-96 xl:h-[80vh] rounded-full shadow-lg shadow-yellow-600 w-auto"
                           alt="Main-image"/>
                </div>
            </div>
        </Container>
    )
}
