"use client";

import React, { useEffect, useRef, useState } from "react";

type Tag = "div" | "a" | "button" | "span" | "li" | "section";

type RevealProps = {
  as?: Tag;
  delay?: number; // ms, matches the prototype's data-reveal value
  style?: React.CSSProperties; // base style of the element
  hoverStyle?: React.CSSProperties; // optional style-hover merge
  children?: React.ReactNode;
} & Omit<React.HTMLAttributes<HTMLElement>, "style"> &
  Record<string, unknown>;

const REVEAL_TRANSITION =
  "opacity .9s cubic-bezier(.2,.75,.2,1), transform .9s cubic-bezier(.2,.75,.2,1)";

/**
 * Reproduces the prototype's `data-reveal` scroll-in animation on any tag,
 * with optional `style-hover` support. Starts faded + shifted down, then
 * eases into place when scrolled into view (per-element delay). Once shown,
 * the element's own transition (for hover) takes over. Falls back to visible
 * after 4.8s and immediately when IntersectionObserver is unavailable.
 */
export function Reveal({
  as = "div",
  delay = 0,
  style,
  hoverStyle,
  children,
  onMouseEnter,
  onMouseLeave,
  ...rest
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [shown, setShown] = useState(false);
  const [hover, setHover] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let timer: ReturnType<typeof setTimeout>;
    const safety = setTimeout(() => setShown(true), 4800);

    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              timer = setTimeout(() => setShown(true), delay);
              io.unobserve(e.target);
            }
          });
        },
        { threshold: 0.12, rootMargin: "0px 0px -7% 0px" },
      );
      io.observe(el);
      return () => {
        io.disconnect();
        clearTimeout(timer);
        clearTimeout(safety);
      };
    }
    setShown(true);
    return () => clearTimeout(safety);
  }, [delay]);

  const ownTransition = style?.transition;
  const hv = hover && hoverStyle ? hoverStyle : null;
  const Tag = as as React.ElementType;

  return (
    <Tag
      {...rest}
      ref={ref}
      style={{
        ...style,
        opacity: shown ? (style?.opacity ?? 1) : 0,
        transform: hv?.transform
          ? hv.transform
          : shown
            ? (style?.transform ?? "none")
            : "translateY(38px)",
        transition: shown ? (ownTransition ?? "none") : REVEAL_TRANSITION,
        ...(hv ?? null),
      }}
      onMouseEnter={(e: React.MouseEvent<HTMLElement>) => {
        if (hoverStyle) setHover(true);
        onMouseEnter?.(e);
      }}
      onMouseLeave={(e: React.MouseEvent<HTMLElement>) => {
        if (hoverStyle) setHover(false);
        onMouseLeave?.(e);
      }}
    >
      {children}
    </Tag>
  );
}
