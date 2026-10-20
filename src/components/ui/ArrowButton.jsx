import { ArrowRight } from "lucide-react";

const VARIANTS = {
  navy: {
    // root: "border-brand-navy/10 bg-white",
    root: "bg-none",
    circle: "bg-brand-navy",
    arrow: "text-white",
    label: "text-brand-navy group-hover/slide:text-white",
  },
  gold: {
    root: "border-white bg-white",
    // root: "bg-none",
    circle: "bg-brand-gold",
    arrow: "text-brand-navy",
    label: "text-brand-navy",
  },
};

const SIZES = {
  sm: {
    root: "h-10 pl-[2.9rem] pr-5 text-sm",
    circle: "w-8 pr-[7px]",
    icon: 18,
    shift: "group-hover/slide:-translate-x-6",
  },
  md: {
    root: "h-12 pl-14 pr-6 text-[0.95rem]",
    circle: "w-10 pr-[10px]",
    icon: 20,
    shift: "group-hover/slide:-translate-x-7",
  },
};

export default function ArrowButton({
  children,
  href,
  variant = "navy",
  size = "md",
  className = "",
  ...props
}) {
  const v = VARIANTS[variant];
  const s = SIZES[size];
  const Tag = href ? "a" : "button";
  const tagProps = href ? { href } : { type: "button" };

  return (
    <Tag
      {...tagProps}
      {...props}
      className={`group/slide relative inline-flex items-center rounded-full border font-semibold no-underline shadow-sm focus-visible:outline-2 focus-visible:outline-brand-gold ${v.root} ${s.root} ${className}`}
    >
      <span
        aria-hidden="true"
        className={`absolute bottom-1 left-1 top-1 flex items-center justify-end rounded-full transition-[width] duration-200 ease-in-out group-hover/slide:w-[calc(100%-0.5rem)] motion-reduce:transition-none ${v.circle} ${s.circle}`}
      >
        <ArrowRight size={s.icon} className={v.arrow} />
      </span>
      <span
        className={`relative z-10 whitespace-nowrap transition-[transform,color] duration-200 ease-in-out motion-reduce:transition-none ${v.label} ${s.shift}`}
      >
        {children}
      </span>
    </Tag>
  );
}
