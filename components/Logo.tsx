import React from "react";

type LogoProps = {
  size?: "nav" | "hero";
};

export default function Logo({ size = "nav" }: LogoProps) {
  const className =
    size === "hero"
      ? "w-36 sm:w-44 md:w-56 lg:w-64 h-auto"
      : "w-24 sm:w-28 md:w-32 h-auto";

  const logoStyle =
    size === "hero"
      ? { filter: "drop-shadow(0px 4px 10px rgba(0,0,0,0.06))" }
      : { opacity: 0.92, filter: "drop-shadow(0px 1px 2px rgba(0,0,0,0.08))" };

  return (
    <img
      src="/images/logo.svg"
      alt="VERO CAFFÉ logo"
      className={className}
      style={logoStyle}
    />
  );
}
