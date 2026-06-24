"use client";

import { useState } from "react";

function initials(name: string): string {
  return name
    .replace(/^Dr\.\s*/i, "")
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function Avatar({ src, name, size = 64 }: { src: string | null; name: string; size?: number }) {
  const [failed, setFailed] = useState(false);
  const show = src && !failed;
  return (
    <div
      className="flex shrink-0 items-center justify-center overflow-hidden rounded-xl bg-zinc-200 text-zinc-600 dark:bg-zinc-700 dark:text-zinc-200"
      style={{ width: size, height: size }}
    >
      {show ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={name}
          width={size}
          height={size}
          className="h-full w-full object-cover"
          onError={() => setFailed(true)}
        />
      ) : (
        <span className="text-lg font-semibold">{initials(name)}</span>
      )}
    </div>
  );
}
