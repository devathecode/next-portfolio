"use client";

import { useState } from "react";
import { PdfDownload } from "@/lib/supabase";
import { Monitor, Smartphone, Tablet, Globe, ChevronDown, ChevronUp } from "lucide-react";

const DeviceIcon = ({ device }: { device: string | null }) => {
  if (device === "Mobile")  return <Smartphone  size={13} className="text-sky-400"     />;
  if (device === "Tablet")  return <Tablet       size={13} className="text-violet-400"  />;
  return                           <Monitor      size={13} className="text-emerald-400" />;
};

function Row({ d }: { d: PdfDownload }) {
  const [open, setOpen] = useState(false);
  const date = new Date(d.created_at);

  return (
    <>
      <tr
        className="border-b border-gray-800 hover:bg-white/[0.02] cursor-pointer transition-colors"
        onClick={() => setOpen((v) => !v)}
      >
        {/* Date */}
        <td className="py-3 px-4 text-xs text-gray-400 whitespace-nowrap">
          <span className="text-gray-200">{date.toLocaleDateString()}</span>
          <span className="block text-gray-600">{date.toLocaleTimeString()}</span>
        </td>

        {/* Device + Browser + OS */}
        <td className="py-3 px-4">
          <div className="flex items-center gap-2">
            <DeviceIcon device={d.device} />
            <span className="text-xs text-gray-300">{d.browser ?? "—"}</span>
            <span className="text-gray-700 text-xs">/</span>
            <span className="text-xs text-gray-500">{d.os ?? "—"}</span>
          </div>
        </td>

        {/* Screen */}
        <td className="py-3 px-4 text-xs text-gray-500 hidden md:table-cell">
          {d.screen_resolution ?? "—"}
        </td>

        {/* Language */}
        <td className="py-3 px-4 text-xs text-gray-500 hidden lg:table-cell">
          {d.language ?? "—"}
        </td>

        {/* IP */}
        <td className="py-3 px-4 text-xs font-mono text-gray-600 hidden xl:table-cell">
          {d.ip ?? "—"}
        </td>

        {/* Expand toggle */}
        <td className="py-3 px-4 text-right text-gray-600">
          {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </td>
      </tr>

      {open && (
        <tr className="border-b border-gray-800 bg-white/[0.015]">
          <td colSpan={6} className="px-4 py-4">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {[
                { label: "IP",           value: d.ip },
                { label: "Browser",      value: d.browser },
                { label: "OS",           value: d.os },
                { label: "Device",       value: d.device },
                { label: "Screen",       value: d.screen_resolution },
                { label: "Viewport",     value: d.viewport },
                { label: "Language",     value: d.language },
                { label: "Timezone",     value: d.timezone },
                { label: "Connection",   value: d.connection_type },
                { label: "Referrer",     value: d.referrer },
                { label: "UTM Source",   value: d.utm_source },
                { label: "UTM Medium",   value: d.utm_medium },
                { label: "UTM Campaign", value: d.utm_campaign },
                { label: "Page URL",     value: d.page_url },
              ].map(({ label, value }) => (
                <div key={label} className="bg-gray-900 rounded-lg px-3 py-2 border border-gray-800">
                  <p className="text-[10px] text-gray-600 uppercase tracking-wider mb-0.5">{label}</p>
                  <p className="text-xs text-gray-300 break-all font-mono">{value ?? <span className="text-gray-700">—</span>}</p>
                </div>
              ))}
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

export function DownloadList({ downloads }: { downloads: PdfDownload[] }) {
  if (downloads.length === 0) {
    return (
      <div className="text-center py-20 text-gray-700">
        <Globe size={40} className="mx-auto mb-3 opacity-40" />
        <p className="text-sm">No downloads yet.</p>
        <p className="text-xs mt-1 text-gray-600">
          PDF downloads from the CSS Tips page will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-800">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-800 bg-white/[0.02]">
            <th className="text-left py-2.5 px-4 text-[10px] uppercase tracking-widest text-gray-600 font-semibold">Date</th>
            <th className="text-left py-2.5 px-4 text-[10px] uppercase tracking-widest text-gray-600 font-semibold">Browser / OS</th>
            <th className="text-left py-2.5 px-4 text-[10px] uppercase tracking-widest text-gray-600 font-semibold hidden md:table-cell">Screen</th>
            <th className="text-left py-2.5 px-4 text-[10px] uppercase tracking-widest text-gray-600 font-semibold hidden lg:table-cell">Language</th>
            <th className="text-left py-2.5 px-4 text-[10px] uppercase tracking-widest text-gray-600 font-semibold hidden xl:table-cell">IP</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {downloads.map((d) => <Row key={d.id} d={d} />)}
        </tbody>
      </table>
    </div>
  );
}
