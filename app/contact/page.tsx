import { FcIphone } from "react-icons/fc";
import Card from "../components/Card";
import { robotoSlab } from "../fonts";
import { FaLocationDot } from "react-icons/fa6";
import { MdMarkEmailUnread } from "react-icons/md";
import { contactSubmit } from "../lib/action";
import { redirect } from "next/navigation";
import Submitbutton from "./components/Submitbutton";

const Contact = () => {
    return (
        <div className="cpm">
            <div className="wrapper">
                <div className="py-6 md:py-12">
                    <div className="flex items-center">
                        <h2 className={`text-4xl md:text-5xl mt-12 lg:mt-0 ${robotoSlab.className}`}>Contact</h2>
                        <div className="ms-5 h-0.5 w-32 md:w-72 bg-gradient-to-r from-yellow-600 via-yellow-700 to-yellow-800 mt-12 lg:mt-0"></div>
                    </div>

                    <div className="grid grid-cols-12 grid-flow-row lg:grid-flow-col gap-5 md:gap-10 pt-4 md:pt-[40px] items-center">
                        <Card classes="col-span-12 lg:col-span-4 border-0 dark:border bg-pink-100/50 dark:bg-gray-700">
                            <div className="grid grid-cols-12 gap-8">
                                <div className="col-span-2">
                                    <FcIphone className="text-5xl p-1 rounded-md" />
                                </div>
                                <div className="col-span-8">
                                    <p className="text-sm text-black/70 dark:text-white">Phone</p>
                                    <h6 className="font-medium dark:text-white/50">
                                        <a className="hover:text-[#FA5252] duration-300 transition" href="tel:+917078146612">+91 7078146612</a>
                                    </h6>
                                </div>
                            </div>
                        </Card>
                        <Card classes="col-span-12 lg:col-span-4 border-0 dark:border bg-sky-100/50 dark:bg-gray-700">
                            <div className="grid grid-cols-12 gap-8">
                                <div className="col-span-2">
                                    <FaLocationDot className="text-5xl  text-green-500 p-2 rounded-md" />
                                </div>
                                <div className="col-span-8">
                                    <p className="text-sm text-black/70 dark:text-white">Location</p>
                                    <h6 className="font-medium dark:text-white/50">Noida UP,India</h6>
                                </div>
                            </div>
                        </Card>
                        <Card classes="col-span-12 lg:col-span-4 border-0 dark:border bg-violet-100/50 dark:bg-gray-700">
                            <div className="grid grid-cols-12 gap-8">
                                <div className="col-span-2">
                                    <MdMarkEmailUnread className="text-5xl text-sky-500 p-2 rounded-md" />
                                </div>
                                <div className="col-span-8">
                                    <p className="text-sm text-black/70 dark:text-white">Email</p>
                                    <h6 className="font-medium dark:text-white/50 text-wrap">
                                        <a className="hover:text-[#FA5252] duration-300 transition text-wrap" href="mailto:devanshuv1501@gmail@gmail.com">devanshuv1501@gmail.com</a>
                                    </h6>
                                </div>
                            </div>
                        </Card>
                        <Card classes="col-span-12 lg:col-span-8 row-auto border-0 dark:border bg-green-50/50 dark:bg-transparent lg:row-span-3">
                            <p className="text-gray-400 text-2xl font-medium">{`I'm always open to discussing product`}</p>
                            <p className="text-black dark:text-white text-2xl font-medium">design work or partnerships.</p>
                            <form action={async (formData) => {
                                "use server";
                                const route = await contactSubmit(formData);
                                route && redirect(route);
                            }}>
                                <div className="relative z-0 w-full mt-[40px] mb-8 group">
                                    <input type="text" name="name"
                                        className="block autofill:bg-transparent py-2.5 px-0 w-full text-sm text-gray-lite bg-transparent border-0
                                     border-b-[2px] border-[#B5B5B5] appearance-none dark:text-white dark:border-[#333333]
                                      dark:focus:border-[#FF6464] focus:outline-none focus:ring-0 focus:border-[#FF6464] peer" placeholder=" "
                                        required />
                                    <label htmlFor="name" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-color-910 duration-300
                                     transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-[#FF6464]
                                      peer-focus:dark:text-[#FF6464] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0
                                       peer-focus:scale-75 peer-focus:-translate-y-8">Name *</label>
                                </div>
                                <div className="relative z-0 w-full mt-[40px] mb-8 group">
                                    <input type="text" name="email"
                                        className="block autofill:bg-transparent py-2.5 px-0 w-full text-sm text-gray-lite bg-transparent border-0
                                     border-b-[2px] border-[#B5B5B5] appearance-none dark:text-white dark:border-[#333333]
                                      dark:focus:border-[#FF6464] focus:outline-none focus:ring-0 focus:border-[#FF6464] peer" placeholder=" "
                                        required />
                                    <label htmlFor="name" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-color-910 duration-300
                                     transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-[#FF6464]
                                      peer-focus:dark:text-[#FF6464] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0
                                       peer-focus:scale-75 peer-focus:-translate-y-8">Email *</label>
                                </div>
                                <div className="relative z-0 w-full mt-[40px] mb-8 group">
                                    <input type="text" name="message"
                                        className="block autofill:bg-transparent py-2.5 px-0 w-full text-sm text-gray-lite bg-transparent border-0
                                     border-b-[2px] border-[#B5B5B5] appearance-none dark:text-white dark:border-[#333333]
                                      dark:focus:border-[#FF6464] focus:outline-none focus:ring-0 focus:border-[#FF6464] peer" placeholder=" "
                                        required />
                                    <label htmlFor="name" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-color-910 duration-300
                                     transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-[#FF6464]
                                      peer-focus:dark:text-[#FF6464] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0
                                       peer-focus:scale-75 peer-focus:-translate-y-8">Message *</label>
                                </div>
                                <Submitbutton buttonText="Submit" redirectUrl="/thankyou" />
                            </form>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Contact;