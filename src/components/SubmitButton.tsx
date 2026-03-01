"use client";

import { SendIcon } from "lucide-react";
import { FC } from "react";
import { useFormStatus } from "react-dom";

interface ButtonData {
  buttonText: string;
}

const Submitbutton: FC<ButtonData> = ({ buttonText }) => {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="relative mt-4 inline-flex items-center justify-center px-6 py-2 overflow-hidden font-medium
                 transition duration-300 ease-out border-2 border-yellow-600 rounded-md shadow-md group
                 disabled:opacity-60 disabled:cursor-not-allowed"
    >
      {pending ? (
        <div className="w-6 h-6 rounded-full animate-spin mx-auto border-2 border-yellow-600 border-t-transparent" />
      ) : (
        <>
          <span className="absolute inset-0 flex items-center justify-center w-full h-full text-white duration-300 -translate-x-full bg-yellow-600 group-hover:translate-x-0 ease">
            <SendIcon size={18} />
          </span>
          <span className="absolute flex items-center justify-center w-full h-full text-yellow-600 transition-all duration-300 transform group-hover:translate-x-full ease">
            {buttonText}
          </span>
          <span className="relative invisible">{buttonText}</span>
        </>
      )}
    </button>
  );
};

export default Submitbutton;
