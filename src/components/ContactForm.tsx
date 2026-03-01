"use client";

import { useActionState } from "react";
import { contactSubmit } from "@/lib/actions";
import Submitbutton from "./SubmitButton";

export default function ContactForm() {
  const [state, action] = useActionState(contactSubmit, null);

  return (
    <form action={action} className="mt-8 space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="relative z-0 w-full group">
          <input
            id="name"
            type="text"
            name="name"
            className="block autofill:bg-transparent py-2.5 px-0 w-full text-sm bg-transparent border-0
                       border-b-2 border-gray-300 dark:border-gray-700 appearance-none dark:text-white
                       dark:focus:border-yellow-600 focus:outline-none focus:ring-0 focus:border-yellow-600 peer"
            placeholder=" "
            required
          />
          <label
            htmlFor="name"
            className="peer-focus:font-medium absolute text-sm text-gray-400 duration-300
                       transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0
                       peer-focus:text-yellow-600 peer-placeholder-shown:scale-100
                       peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            Name *
          </label>
        </div>

        <div className="relative z-0 w-full group">
          <input
            id="email"
            type="email"
            name="email"
            className="block autofill:bg-transparent py-2.5 px-0 w-full text-sm bg-transparent border-0
                       border-b-2 border-gray-300 dark:border-gray-700 appearance-none dark:text-white
                       dark:focus:border-yellow-600 focus:outline-none focus:ring-0 focus:border-yellow-600 peer"
            placeholder=" "
            required
          />
          <label
            htmlFor="email"
            className="peer-focus:font-medium absolute text-sm text-gray-400 duration-300
                       transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0
                       peer-focus:text-yellow-600 peer-placeholder-shown:scale-100
                       peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            Email *
          </label>
        </div>
      </div>

      <div className="relative z-0 w-full group">
        <input
          id="message"
          type="text"
          name="message"
          className="block autofill:bg-transparent py-2.5 px-0 w-full text-sm bg-transparent border-0
                     border-b-2 border-gray-300 dark:border-gray-700 appearance-none dark:text-white
                     dark:focus:border-yellow-600 focus:outline-none focus:ring-0 focus:border-yellow-600 peer"
          placeholder=" "
          required
        />
        <label
          htmlFor="message"
          className="peer-focus:font-medium absolute text-sm text-gray-400 duration-300
                     transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0
                     peer-focus:text-yellow-600 peer-placeholder-shown:scale-100
                     peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
        >
          Message *
        </label>
      </div>

      {/* Real error from the server */}
      {state?.error && (
        <p className="text-sm text-red-500 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-2.5">
          {state.error}
        </p>
      )}

      <Submitbutton buttonText="Send Message" />
    </form>
  );
}
