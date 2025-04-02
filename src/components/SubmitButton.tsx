"use client";
import { SendIcon } from "lucide-react";
import { FC, useState, useEffect } from "react";
import { useFormStatus } from "react-dom";

interface ButtonData {
  buttonText: string;
  redirectUrl: string;
}

const Submitbutton: FC<ButtonData> = ({ buttonText }) => {
  const { pending } = useFormStatus();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isDisabled, setIsDisabled] = useState(false);

  useEffect(() => {
    if (successMessage) {
      setIsDisabled(true);
      const timer = setTimeout(() => {
        setSuccessMessage(null);
        setIsDisabled(false);
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const handleButtonClick = () => {
    setTimeout(() => {
      setSuccessMessage("Form submitted successfully!");
    }, 1000); // Simulate a delay
  };

  return (
    <>
      <button
        type="submit" // Change to button type button, and use onclick.
        onClick={handleButtonClick}
        disabled={pending || isDisabled}
        className={`relative mt-4 inline-flex items-center justify-center p-4 px-6 py-2 overflow-hidden font-medium
         text-indigo-600 transition duration-300 ease-out border-2 border-yellow-600 rounded-md shadow-md group ${
           isDisabled ? "opacity-50 cursor-not-allowed" : ""
         }`}
      >
        {pending ? (
          <div
            className="w-6 h-6 rounded-full animate-spin mx-auto
                  border-2 border-solid border-primary-500 border-t-transparent"
          ></div>
        ) : (
          <>
            <span className="absolute inset-0 flex items-center justify-center w-full h-full text-white duration-300 -translate-x-full bg-yellow-600 group-hover:translate-x-0 ease">
              <SendIcon />
            </span>
            <span className="absolute flex items-center justify-center w-full h-full text-yellow-600 transition-all duration-300 transform group-hover:translate-x-full ease">
              {buttonText}
            </span>
            <span className="relative invisible">Download Resume</span>
          </>
        )}
      </button>
      {successMessage && (
        <div className="mt-2 text-green-600">{successMessage}</div>
      )}
    </>
  );
};

export default Submitbutton;
