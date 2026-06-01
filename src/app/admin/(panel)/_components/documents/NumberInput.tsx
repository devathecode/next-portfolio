"use client";

import { useState, type InputHTMLAttributes } from "react";

type Props = Omit<InputHTMLAttributes<HTMLInputElement>, "value" | "onChange" | "type"> & {
  value: number;
  /** NaN while the field is empty, so validation can flag it. */
  onChange: (n: number) => void;
};

const show = (n: number) => (Number.isFinite(n) ? String(n) : "");

/** A number field that can be cleared and typed into ("1.", "") without snapping to 0. */
export function NumberInput({ value, onChange, ...rest }: Props) {
  const [text, setText] = useState(show(value));
  const [synced, setSynced] = useState(value);

  // Follow outside changes (e.g. a reset) without fighting the user's typing.
  if (!Object.is(value, synced)) {
    setSynced(value);
    if (!Object.is(parse(text), value)) setText(show(value));
  }

  return (
    <input
      {...rest}
      type="text"
      inputMode="decimal"
      value={text}
      onChange={(e) => {
        const next = e.target.value.replace(/[^\d.]/g, "");
        setText(next);
        const n = parse(next);
        setSynced(n);
        onChange(n);
      }}
    />
  );
}

function parse(text: string) {
  return text.trim() === "" || text === "." ? Number.NaN : Number(text);
}
