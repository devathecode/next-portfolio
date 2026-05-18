"use client";

import { useEffect } from "react";

export function CopyCodeButtons() {
  useEffect(() => {
    const blocks = document.querySelectorAll<HTMLPreElement>(".blog-prose pre");

    blocks.forEach((pre) => {
      if (pre.querySelector("[data-copy-btn]")) return;

      pre.style.position = "relative";

      const btn = document.createElement("button");
      btn.setAttribute("data-copy-btn", "true");
      btn.setAttribute("aria-label", "Copy code");
      btn.innerHTML = copyIcon();
      btn.style.cssText = `
        position: absolute;
        top: 10px;
        right: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 30px;
        height: 30px;
        border-radius: 6px;
        border: 1px solid rgba(255,255,255,0.12);
        background: rgba(255,255,255,0.07);
        color: rgba(255,255,255,0.6);
        cursor: pointer;
        transition: background 0.15s, color 0.15s;
        padding: 0;
      `;

      btn.addEventListener("mouseenter", () => {
        btn.style.background = "rgba(255,255,255,0.14)";
        btn.style.color = "rgba(255,255,255,0.9)";
      });
      btn.addEventListener("mouseleave", () => {
        btn.style.background = "rgba(255,255,255,0.07)";
        btn.style.color = "rgba(255,255,255,0.6)";
      });

      btn.addEventListener("click", async () => {
        const code = pre.querySelector("code");
        const text = code?.innerText ?? "";
        try {
          await navigator.clipboard.writeText(text);
          btn.innerHTML = checkIcon();
          btn.style.color = "#4ade80";
          setTimeout(() => {
            btn.innerHTML = copyIcon();
            btn.style.color = "rgba(255,255,255,0.6)";
          }, 1500);
        } catch {
          // clipboard not available
        }
      });

      pre.appendChild(btn);
    });
  }, []);

  return null;
}

function copyIcon() {
  return `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
  </svg>`;
}

function checkIcon() {
  return `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>`;
}
