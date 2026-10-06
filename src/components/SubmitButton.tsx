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
      className="btn btn-plate"
    >
      {pending ? (
        <>
          <span aria-hidden="true" className="h-3.5 w-3.5 animate-spin border-2 border-current border-t-transparent" />
          Sending…
        </>
      ) : (
        <>
          {buttonText}
          <SendIcon size={15} strokeWidth={2.2} />
        </>
      )}
    </button>
  );
};

export default Submitbutton;
