import Image from "next/image";
import { robotoSlab } from "../fonts";
import { MdDesignServices } from "react-icons/md";
import { MdDeveloperMode } from "react-icons/md";
import { FaCode } from "react-icons/fa";
import { FcIphone } from "react-icons/fc";
import { FaLocationDot } from "react-icons/fa6";
import { MdMarkEmailUnread } from "react-icons/md";
import { SlCalender } from "react-icons/sl";
import Card from "../components/Card";

const About = () => {
    return (
        <div className="cpm">
            <div className="wrapper">
                <div className="py-6 md:py-12">
                    <div className="flex items-center">
                        <h2 className={`text-4xl md:text-5xl mt-12 lg:mt-0 ${robotoSlab.className}`}>About Me</h2>
                        <div className="ms-5 h-0.5 w-32 md:w-72 bg-gradient-to-r from-yellow-600 via-yellow-700 to-yellow-800 mt-12 lg:mt-0"></div>
                    </div>
                    <div className="grid grid-cols-12 md:gap-10 pt-4 md:pt-[40px] items-center">
                        <div className="col-span-12 md:col-span-4">
                            <Image width="400" height="500" src="https://firebasestorage.googleapis.com/v0/b/dev-cms-46756.appspot.com/o/devanshuv1501%40gmail.com%2FWhatsApp%20Image%202024-03-29%20at%2011.45.36%20PM.jpeg?alt=media&token=9db92477-b6c9-4a51-adf9-3df15828b3d1"
                                priority={true}
                                className="w-full md:w-[330px] md:h-[400px] object-cover overflow-hidden rounded-[35px] mb-3 md:mb-0"
                                alt="Main-image" />
                        </div>
                        <div className="col-span-12 md:col-span-8 space-y-2.5">
                            <div className=" text-pretty">
                                <h3 className="text-2xl md:text-3xl font-medium dark:text-white mb-2.5 ">Who am i?</h3>
                                <p className="text-gray-500 dark:text-gray-400 leading-7">
                                    I hail from Gorakhpur, a city in the northern part of India, and I see myself as a creative craftsman. I love building things, whether they are digital products or effective teams.
                                    When it comes to developing user interfaces. <br /> I enjoy using the latest technologies such as (Angular, React, Vue etc..) and other modern tools to create visually stunning and highly functional web applications for both businesses and consumers alike.
                                    With my passion for design and a keen attention to detail, I believe I can help bring your vision to life.</p>
                                <p className="text-gray-500 dark:text-gray-400 leading-7 mt-2.5">My aim is to bring across your message and identity in the most creative way. I created web design for many famous brand companies.</p></div>
                            <div>
                                <h3 className="text-4xl font-medium my-5 dark:text-white">Personal Info</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div className="flex">
                                        <FcIphone className="text-4xl bg-gray-700 p-1 rounded-md" />
                                        <div className="space-y-1 ms-2">
                                            <p className="text-sm text-black/70 dark:text-white">Phone</p>
                                            <h6 className="font-medium dark:text-white/50">
                                                <a className="hover:text-[#FA5252] duration-300 transition" href="tel:+917078146612">+91 7078146612</a>
                                            </h6>
                                        </div>
                                    </div>
                                    <div className="flex">
                                        <FaLocationDot className="text-4xl text-green-700 bg-gray-700 p-1 rounded-md" />
                                        <div className="space-y-1 ms-2">
                                            <p className="text-sm text-black/70 dark:text-white">Location</p>
                                            <h6 className="font-medium dark:text-white/50">Noida UP,India</h6>
                                        </div>
                                    </div>
                                    <div className="flex">
                                        <MdMarkEmailUnread className="text-4xl text-sky-400 bg-gray-700 p-1 rounded-md" />
                                        <div className="space-y-1 ms-2">
                                            <p className="text-sm text-black/70 dark:text-white">Email</p>
                                            <h6 className="font-medium dark:text-white/50">
                                                <a className="hover:text-[#FA5252] duration-300 transition" href="mailto:devanshuv1501@gmail@gmail.com">devanshuv1501@gmail.com</a>
                                            </h6>
                                        </div>
                                    </div>
                                    <div className="flex">
                                        <SlCalender className="text-4xl text-gray-500 bg-gray-700 p-1 rounded-md" />
                                        <div className="space-y-1 ms-2">
                                            <p className="text-sm text-black/70 dark:text-white">Birthday</p>
                                            <h6 className="font-medium dark:text-white/50">April 15, 1999</h6>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="py-6 md:py-12">
                    <h3 className="text-3xl md:text-4xl font-medium dark:text-white mb-2.5 ">What I do!</h3>
                    <div className="grid grid-cols-12 gap-4 mt-5">
                        <Card classes="col-span-12 lg:col-span-4">
                            <div className="flex items-center">
                                <MdDesignServices className="text-4xl text-pink-600" />
                                <h4 className="text-xl md:text-2xl font-medium dark:text-white/80 mb-2 ms-4">UI/UX Design</h4>
                            </div>
                            <p className="text-black/70 dark:text-gray-500 ps-14">
                                Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam euismod volutpat.
                            </p>
                        </Card>
                        <Card classes="col-span-12 lg:col-span-4">
                            <div className="flex items-center">
                                <FaCode className="text-4xl text-blue-500" />
                                <h4 className="text-xl md:text-2xl font-medium dark:text-white/80 mb-2 ms-4">Web Development</h4>
                            </div>
                            <p className="text-black/70 dark:text-gray-500 ps-14">
                                Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam euismod volutpat.
                            </p>
                        </Card>
                        <Card classes="col-span-12 lg:col-span-4">
                            <div className="flex items-center">
                                <MdDeveloperMode className="text-4xl text-yellow-500" />
                                <h4 className="text-xl md:text-2xl font-medium dark:text-white/80 mb-2 ms-4">App Development</h4>
                            </div>
                            <p className="text-black/70 dark:text-gray-500 ps-14">
                                Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam euismod volutpat.
                            </p>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default About;