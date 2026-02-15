import React from "react";
import Image from "next/image";

type LogoProps = {
  size?: "nav" | "hero" | "lg" | "footer";
};

export default function Logo({ size = "nav" }: LogoProps) {
  const width =
    size === "lg" || size === "hero"
      ? 200
      : size === "footer"
        ? 140
        : 120;

  const height =
    size === "lg" || size === "hero"
      ? 200
      : size === "footer"
        ? 140
        : 120;

  return (
    <Image
      src="/logo.svg"
      alt="VERO CAFFÉ"
      width={140}
      height={60}
      priority={size === "hero" || size === "nav"}
      className="object-contain" // Ensures aspect ratio is maintained
      style={{
        width: "auto",
        height: "auto",
        maxWidth: width,
        maxHeight: height
      }}
    />
  );
}
