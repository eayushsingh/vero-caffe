"use client";
import { ReactNode } from "react";
import { motion, Variants } from "framer-motion";

type Props = {
  children: ReactNode;
  className?: string;
  id?: string;
};

const variants: Variants = {
  hidden: { opacity: 0, y: 50 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1] } },
};

export default function SectionWrapper({ children, className = "", id }: Props) {
  return (
    <motion.section
      id={id}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.18 }}
      variants={variants}
      className={`w-full max-w-6xl mx-auto px-6 py-12 ${className}`}
    >
      {children}
    </motion.section>
  );
}
