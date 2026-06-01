"use client";

import { SendIcon } from "lucide-react";
import { FC } from "react";
import { useFormStatus } from "react-dom";

interface ButtonData {
  buttonText: string;
  isPending?: boolean;
}

const Submitbutton: FC<ButtonData> = ({ buttonText, isPending: externalPending }) => {
  const { pending: formPending } = useFormStatus();
  const pending = externalPending ?? formPending;

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex h-11 items-center gap-2.5 rounded-lg bg-[var(--accent)] px-5
                 text-sm font-semibold text-[var(--on-accent)] transition-opacity duration-200
                 hover:opacity-90 active:scale-[0.98]
                 disabled:cursor-not-allowed disabled:opacity-60 disabled:active:scale-100"
    >
      {pending ? (
        <>
          <span aria-hidden="true" className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
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
