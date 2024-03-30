"use client";

import { FC } from "react";
import { useFormStatus } from "react-dom";

interface ButtonData {
    buttonText: string;
    redirectUrl: string;
}

const Submitbutton: FC<ButtonData> = ({ buttonText, redirectUrl }) => {
    const { pending } = useFormStatus();

    return (
        <button type="submit"
            className="transition-all duration-300 ease-in-out inline-block hover:text-white font-medium
            hover:bg-gradient-to-r from-yellow-700 to-yellow-800 rounded-lg mt-3 w-32 py-1.5 px-2 border border-gray-400">
            {pending ? <div className="w-6 h-6 rounded-full animate-spin mx-auto
                    border-2 border-solid border-primary-500 border-t-transparent"></div> : buttonText}
        </button>
    )
}

export default Submitbutton;