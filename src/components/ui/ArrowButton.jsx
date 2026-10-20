import { ArrowRight } from "lucide-react";

const VARIANTS = {
  navy: {
    root: "bg-brand-navy text-white hover:bg-brand-gold hover:text-brand-navy",
    circle: "bg-brand-gold group-hover/arrow:bg-brand-navy",
    arrowHover: "text-brand-gold",
    arrowDefault: "text-brand-navy",
  },
  gold: {
    root: "bg-brand-gold text-brand-navy hover:bg-white",
    circle: "bg-brand-navy group-hover/arrow:bg-brand-gold",
    arrowHover: "text-white",
    arrowDefault: "text-brand-gold",
  },
};

const SIZES = {
  sm: {
    root: "h-10 gap-2.5 pl-5 pr-1.5 text-sm",
    circle: "h-7 w-7",
    track: "h-7 w-14",
    icon: "size-7",
  },
  md: {
    root: "h-12 gap-3 pl-6 pr-2 text-[0.95rem]",
    circle: "h-8 w-8",
    track: "h-8 w-16",
    icon: "size-8",
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
      className={`group/arrow inline-flex items-center justify-center rounded-full font-semibold no-underline transition-colors duration-150 ease-in-out motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-brand-gold ${v.root} ${s.root} ${className}`}
    >
      <span>{children}</span>
      <span
        className={`relative flex shrink-0 items-center justify-center overflow-hidden rounded-full transition-colors duration-150 motion-reduce:transition-none ${v.circle} ${s.circle}`}
        aria-hidden="true"
      >
        <span
          className={`absolute left-0 flex -translate-x-1/2 items-center justify-center transition-transform duration-200 ease-in-out group-hover/arrow:translate-x-0 motion-reduce:transition-none ${s.track}`}
        >
          <ArrowRight
            className={`${s.icon} p-1.5 opacity-0 transition-opacity duration-200 group-hover/arrow:opacity-100 ${v.arrowHover}`}
          />
          <ArrowRight
            className={`${s.icon} p-1.5 opacity-100 transition-opacity duration-200 group-hover/arrow:opacity-0 ${v.arrowDefault}`}
          />
        </span>
      </span>
    </Tag>
  );
}
