"use client";

import { useCallback, useMemo, useState } from "react";
import type { z } from "zod";
import { validate } from "@/lib/documents/schemas";

/**
 * Live validation with the same zod schema the server uses. A field shows
 * its error once it has been blurred, or everywhere after a save attempt.
 */
export function useValidation<T>(schema: z.ZodType<T>, value: unknown) {
  const errors = useMemo(() => validate(schema, value), [schema, value]);
  const [touched, setTouched] = useState<ReadonlySet<string>>(new Set());
  const [revealed, setRevealed] = useState(false);

  const err = (path: string) => (revealed || touched.has(path) ? errors[path] : undefined);
  const touch = useCallback(
    (path: string) => setTouched((s) => (s.has(path) ? s : new Set(s).add(path))),
    [],
  );

  return {
    errors,
    err,
    touch,
    reveal: () => setRevealed(true),
    valid: Object.keys(errors).length === 0,
  };
}

export type Validation = ReturnType<typeof useValidation>;
