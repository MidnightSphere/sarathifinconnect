import useReveal from "../../../hooks/useAboutReveal";

const delayClasses = {
  0: "delay-0",
  100: "delay-100",
  200: "delay-200",
  300: "delay-300",
  400: "delay-[400ms]",
  500: "delay-[500ms]",
  600: "delay-[600ms]",
};

export default function Reveal({ as: Tag = "div", delay = 0, className = "", children, ...props }) {
  const [ref, isVisible] = useReveal();
  const delayClass = delayClasses[delay] ?? "delay-0";

  return (
    <Tag
      ref={ref}
      className={`transition-all duration-700 ease-out motion-reduce:transition-none motion-reduce:transform-none ${delayClass} ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      } ${className}`}
      {...props}
    >
      {typeof children === "function" ? children(isVisible) : children}
    </Tag>
  );
}
