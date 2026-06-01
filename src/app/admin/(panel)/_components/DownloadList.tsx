"use client";

import { Fragment, useMemo, useState } from "react";
import type { PdfDownload } from "@/lib/supabase";
import {
  MonitorIcon,
  SmartphoneIcon,
  TabletIcon,
  ChevronDownIcon,
  DownloadCloudIcon,
} from "lucide-react";
import { EmptyState, StatTile, formatDate } from "./ui";

type DeviceFilter = "All" | "Desktop" | "Mobile" | "Tablet";
const FILTERS: DeviceFilter[] = ["All", "Desktop", "Mobile", "Tablet"];

function DeviceIcon({ device }: { device: string | null }) {
  const cls = "text-adm-subtle";
  if (device === "Mobile") return <SmartphoneIcon size={15} className={cls} />;
  if (device === "Tablet") return <TabletIcon size={15} className={cls} />;
  return <MonitorIcon size={15} className={cls} />;
}

function Details({ d }: { d: PdfDownload }) {
  const fields = [
    ["IP", d.ip],
    ["Device", d.device],
    ["Screen", d.screen_resolution],
    ["Viewport", d.viewport],
    ["Language", d.language],
    ["Timezone", d.timezone],
    ["Connection", d.connection_type],
    ["Referrer", d.referrer],
    ["UTM source", d.utm_source],
    ["UTM medium", d.utm_medium],
    ["UTM campaign", d.utm_campaign],
    ["Page URL", d.page_url],
  ] as const;

  return (
    <dl className="grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-3 lg:grid-cols-4">
      {fields.map(([label, value]) => (
        <div key={label} className="min-w-0">
          <dt className="text-xs text-adm-subtle">{label}</dt>
          <dd className="break-all text-sm text-adm-text">
            {value ?? <span className="text-adm-subtle">Not recorded</span>}
          </dd>
        </div>
      ))}
    </dl>
  );
}

export function DownloadList({ downloads }: { downloads: PdfDownload[] }) {
  const [filter, setFilter] = useState<DeviceFilter>("All");
  const [openId, setOpenId] = useState<string | null>(null);

  const counts = useMemo(
    () => ({
      Desktop: downloads.filter((d) => d.device === "Desktop").length,
      Mobile: downloads.filter((d) => d.device === "Mobile").length,
      Tablet: downloads.filter((d) => d.device === "Tablet").length,
    }),
    [downloads]
  );

  if (downloads.length === 0) {
    return (
      <EmptyState
        icon={DownloadCloudIcon}
        title="No downloads yet"
        body="Downloads of the CSS Tips PDF will be listed here."
      />
    );
  }

  const rows = filter === "All" ? downloads : downloads.filter((d) => d.device === filter);

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatTile label="Total downloads" value={downloads.length} tone="accent" />
        <StatTile label="Desktop" value={counts.Desktop} />
        <StatTile label="Mobile" value={counts.Mobile} />
        <StatTile label="Tablet" value={counts.Tablet} />
      </div>

      <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by device">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            aria-pressed={filter === f}
            className={`h-8 rounded-lg border px-3 text-sm font-medium transition ${
              filter === f
                ? "border-adm-accent bg-adm-accent/15 text-adm-accent-text"
                : "border-adm-border bg-adm-surface text-adm-muted hover:text-adm-text"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto rounded-xl border border-adm-border bg-adm-surface">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-adm-border text-left text-xs text-adm-subtle">
              <th className="px-4 py-2.5 font-medium">Date</th>
              <th className="px-4 py-2.5 font-medium">Browser and OS</th>
              <th className="hidden px-4 py-2.5 font-medium md:table-cell">Screen</th>
              <th className="hidden px-4 py-2.5 font-medium lg:table-cell">Language</th>
              <th className="w-10 px-4 py-2.5" />
            </tr>
          </thead>
          <tbody className="divide-y divide-adm-border">
            {rows.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-adm-muted">
                  No {filter.toLowerCase()} downloads.
                </td>
              </tr>
            )}
            {rows.map((d) => {
              const open = openId === d.id;
              return (
                <Fragment key={d.id}>
                  <tr
                    onClick={() => setOpenId(open ? null : d.id)}
                    className="cursor-pointer transition hover:bg-adm-raised"
                  >
                    <td className="whitespace-nowrap px-4 py-3">
                      <p className="text-adm-text">{formatDate(d.created_at)}</p>
                      <p className="text-xs text-adm-subtle">
                        {new Date(d.created_at).toLocaleTimeString("en-IN", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <span className="flex items-center gap-2 text-adm-text">
                        <DeviceIcon device={d.device} />
                        {d.browser ?? "Unknown"}
                        <span className="text-adm-subtle">on {d.os ?? "unknown OS"}</span>
                      </span>
                    </td>
                    <td className="hidden px-4 py-3 text-adm-muted md:table-cell">
                      {d.screen_resolution ?? "-"}
                    </td>
                    <td className="hidden px-4 py-3 text-adm-muted lg:table-cell">
                      {d.language ?? "-"}
                    </td>
                    <td className="px-4 py-3 text-adm-subtle">
                      <button
                        aria-label={open ? "Hide details" : "Show details"}
                        aria-expanded={open}
                        className="inline-flex"
                      >
                        <ChevronDownIcon
                          size={16}
                          className={`transition-transform ${open ? "rotate-180" : ""}`}
                        />
                      </button>
                    </td>
                  </tr>
                  {open && (
                    <tr className="bg-adm-raised">
                      <td colSpan={5} className="px-4 py-4">
                        <Details d={d} />
                      </td>
                    </tr>
                  )}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
