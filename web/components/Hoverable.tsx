"use client";

import React, { useState } from "react";

type Tag = "div" | "a" | "button" | "span" | "li" | "section";

type HoverableProps = {
  as?: Tag;
  baseStyle?: React.CSSProperties;
  hoverStyle?: React.CSSProperties;
  children?: React.ReactNode;
} & Omit<React.HTMLAttributes<HTMLElement>, "style"> &
  Record<string, unknown>;

/**
 * Reproduces the prototype's `style-hover` attribute: merges `hoverStyle`
 * over `baseStyle` while the pointer is over the element. Works for div / a /
 * button / span / li / section. Extra props (href, target, onClick, type…)
 * are forwarded to the underlying element.
 */
export function Hoverable({
  as = "div",
  baseStyle,
  hoverStyle,
  children,
  onMouseEnter,
  onMouseLeave,
  ...rest
}: HoverableProps) {
  const [hover, setHover] = useState(false);
  const Tag = as as React.ElementType;
  return (
    <Tag
      {...rest}
      style={{ ...baseStyle, ...(hover && hoverStyle ? hoverStyle : null) }}
      onMouseEnter={(e: React.MouseEvent<HTMLElement>) => {
        setHover(true);
        onMouseEnter?.(e);
      }}
      onMouseLeave={(e: React.MouseEvent<HTMLElement>) => {
        setHover(false);
        onMouseLeave?.(e);
      }}
    >
      {children}
    </Tag>
  );
}
