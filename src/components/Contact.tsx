import { MdMap, MdMarkEmailUnread, MdPhone } from "react-icons/md";
import Submitbutton from "./SubmitButton";
import { contactSubmit } from "@/lib/actions";

const ContactComponent = () => {
  return (
    <div
      className="flex flex-col items-center justify-center min-h-[88vh] mt-10 md:mt-0 p-4"
      id="contact"
    >
      <div className="flex flex-col items-center">
        <h2 className="text-2xl md:text-5xl text-center font-bold text-gray-900 dark:text-white mb-4">
          Contact Us
        </h2>
        <div className="h-0.5 w-32 md:w-60 bg-gradient-to-r from-yellow-600 via-yellow-700 to-yellow-800 mb-3"></div>
      </div>
      <p className="text-lg mb-4">We would love to hear from you!</p>
      <div className="grid grid-cols-12 grid-flow-row lg:grid-flow-col gap-5 md:gap-10 pt-4 md:pt-[40px] items-center">
        <div className="col-span-12 lg:col-span-4 border border-yellow-600">
          <div className="grid grid-cols-12 gap-8 p-4">
            <div className="col-span-2">
              <MdPhone className="text-5xl p-1 rounded-md" />
            </div>
            <div className="col-span-8">
              <p className="text-sm text-yellow-600 font-semibold">Phone</p>
              <h6 className="font-medium dark:text-white/70">
                <a
                  className="hover:text-[#FA5252] duration-300 transition"
                  href="tel:+917078146612"
                >
                  +91 7078146612
                </a>
              </h6>
            </div>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-4 border border-yellow-600 ">
          <div className="grid grid-cols-12 gap-8 p-4">
            <div className="col-span-2">
              <MdMap className="text-5xl text-green-500 p-2 rounded-md" />
            </div>
            <div className="col-span-8">
              <p className="text-sm text-yellow-600 font-semibold">Location</p>
              <h6 className="font-medium dark:text-white/70">Noida UP,India</h6>
            </div>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-4 border border-yellow-600">
          <div className="grid grid-cols-12 gap-8 p-4">
            <div className="col-span-2">
              <MdMarkEmailUnread className="text-5xl text-sky-500 p-2 rounded-md" />
            </div>
            <div className="col-span-8">
              <p className="text-sm text-yellow-600 font-semibold">Email</p>
              <h6 className="font-medium dark:text-white/70 text-wrap">
                <a
                  className="hover:text-[#FA5252] duration-300 transition text-wrap "
                  href="mailto:devanshuv1501@gmail@gmail.com"
                >
                  devanshuv1501@gmail.com
                </a>
              </h6>
            </div>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-8 row-auto border border-yellow-600 lg:row-span-3 p-4">
          <p className="text-gray-600 text-2xl font-medium">{`I'm always open to discussing product`}</p>
          <p className=" text-2xl font-medium text-yellow-600">
            design work or partnerships.
          </p>
          <form
            action={async (formData) => {
              "use server";
              await contactSubmit(formData);
            }}
          >
            <div className="relative z-0 w-full mt-[40px] mb-8 group">
              <input
                type="text"
                name="name"
                className="block autofill:bg-transparent py-2.5 px-0 w-full text-sm text-gray-lite bg-transparent border-0
                                     border-b-[2px] border-[#B5B5B5] appearance-none dark:text-white dark:border-[#333333]
                                      dark:focus:border-[#FF6464] focus:outline-none focus:ring-0 focus:border-[#FF6464] peer"
                placeholder=" "
                required
              />
              <label
                htmlFor="name"
                className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-color-910 duration-300
                                     transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-[#FF6464]
                                      peer-focus:dark:text-[#FF6464] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0
                                       peer-focus:scale-75 peer-focus:-translate-y-8"
              >
                Name *
              </label>
            </div>
            <div className="relative z-0 w-full mt-[40px] mb-8 group">
              <input
                type="text"
                name="email"
                className="block autofill:bg-transparent py-2.5 px-0 w-full text-sm text-gray-lite bg-transparent border-0
                                     border-b-[2px] border-[#B5B5B5] appearance-none dark:text-white dark:border-[#333333]
                                      dark:focus:border-[#FF6464] focus:outline-none focus:ring-0 focus:border-[#FF6464] peer"
                placeholder=" "
                required
              />
              <label
                htmlFor="name"
                className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-color-910 duration-300
                                     transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-[#FF6464]
                                      peer-focus:dark:text-[#FF6464] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0
                                       peer-focus:scale-75 peer-focus:-translate-y-8"
              >
                Email *
              </label>
            </div>
            <div className="relative z-0 w-full mt-[40px] mb-8 group">
              <input
                type="text"
                name="message"
                className="block autofill:bg-transparent py-2.5 px-0 w-full text-sm text-gray-lite bg-transparent border-0
                                     border-b-[2px] border-[#B5B5B5] appearance-none dark:text-white dark:border-[#333333]
                                      dark:focus:border-[#FF6464] focus:outline-none focus:ring-0 focus:border-[#FF6464] peer"
                placeholder=" "
                required
              />
              <label
                htmlFor="name"
                className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-color-910 duration-300
                                     transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-[#FF6464]
                                      peer-focus:dark:text-[#FF6464] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0
                                       peer-focus:scale-75 peer-focus:-translate-y-8"
              >
                Message *
              </label>
            </div>
            <Submitbutton buttonText="Submit" redirectUrl="/thankyou" />
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactComponent;
