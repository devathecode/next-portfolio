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
      className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full
                 bg-[var(--accent)] text-black text-sm font-semibold
                 hover:opacity-90 hover:-translate-y-0.5
                 transition-all duration-200
                 shadow-[0_0_24px_var(--accent-glow)]
                 disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0"
    >
      {pending ? (
        <>
          <span className="w-4 h-4 rounded-full border-2 border-black/30 border-t-black animate-spin" />
          Sending…
        </>
      ) : (
        <>
          {buttonText}
          <SendIcon size={14} />
        </>
      )}
    </button>
  );
};

export default Submitbutton;
