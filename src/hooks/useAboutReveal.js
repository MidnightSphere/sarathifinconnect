import { useEffect, useState } from "react";

function prefersReducedMotion() {
  return typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export default function useReveal(threshold = 0.15) {
  const [ref, setRef] = useState(null);
  const [isVisible, setIsVisible] = useState(
    () => prefersReducedMotion() || typeof IntersectionObserver === "undefined",
  );

  useEffect(() => {
    if (!ref || isVisible) return undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold },
    );

    observer.observe(ref);
    return () => observer.disconnect();
  }, [isVisible, ref, threshold]);

  return [setRef, isVisible];
}
