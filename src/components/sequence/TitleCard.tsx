import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowLeftIcon } from "lucide-react";

export type Field = "cardinal" | "ink" | "paper" | "midnight" | "ochre" | "olive";

/**
 * The opening card of an inner page: the page title in skinny caps on its
 * own field, a line of lead, and whatever the page needs under it (meta,
 * filters, actions). The page's body follows on paper.
 */
export default function TitleCard({
  field,
  act,
  title,
  lead,
  back,
  shape,
  children,
  titleClassName = "max-w-[16ch]",
}: {
  field: Field;
  /** Name of this act on the reel */
  act: string;
  title: ReactNode;
  lead?: ReactNode;
  back?: { href: string; label: string };
  /** A cut-paper shape pasted behind the type */
  shape?: ReactNode;
  children?: ReactNode;
  titleClassName?: string;
}) {
  return (
    <header
      data-act={act}
      data-field={field}
      className={`field-${field} grain relative overflow-hidden px-5 pb-14 pt-12 md:pb-20 md:pt-16 lg:px-10`}
    >
      {shape}
      <div className="relative mx-auto max-w-[90rem]">
        {back && (
          <Link
            href={back.href}
            className="t-label group inline-flex h-10 items-center gap-2 text-[var(--text-secondary)] transition-colors duration-100 hover:text-[var(--text-primary)]"
          >
            <ArrowLeftIcon size={15} strokeWidth={2.2} className="transition-transform duration-100 group-hover:-translate-x-0.5" />
            {back.label}
          </Link>
        )}
        <h1 className={`t-title cut-in-up ${back ? "mt-6" : ""} ${titleClassName}`}>{title}</h1>
        {lead && (
          <p className="mt-7 max-w-[48ch] text-[18px] leading-relaxed text-[var(--text-primary)] md:text-[19px]">{lead}</p>
        )}
        {children}
      </div>
    </header>
  );
}
