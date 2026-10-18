import { useEffect, useRef, useState } from "react";
import "./split-reveal.css";

const LOGO_URL = "/logo/sarathi-finconnect-only-logo.svg";
const MIN_VISIBLE_MS = 700;
const MAX_PRELOAD_MS = 1800;
const FADE_MS = 150;
const HOLD_MS = 200;
const REVEAL_MS = 800;

function loadImage(url) {
  return new Promise((resolve) => {
    const image = new Image();
    image.onload = async () => {
      try {
        await image.decode();
      } catch {
        // A successful load is enough when decode is unavailable.
      }
      resolve();
    };
    image.onerror = resolve;
    image.src = url;
    if (image.complete) resolve();
  });
}

async function preloadSplashAssets(report) {
  const tasks = [
    loadImage(LOGO_URL),
    document.fonts.load('750 24px "Bricolage Grotesque"'),
    document.fonts.load('900 52px "Space Grotesk"'),
    document.fonts.load('400 16px Inter'),
    document.fonts.ready,
  ];
  let loaded = 0;
  const settledTasks = tasks.map((task) =>
    Promise.resolve(task)
      .catch(() => {})
      .then(() => {
        loaded += 1;
        report({ loaded, total: tasks.length });
      }),
  );
  await Promise.all(settledTasks);
}

export default function SplitRevealSplash({ onComplete }) {
  const [phase, setPhase] = useState("loading");
  const [progress, setProgress] = useState({ loaded: 0, total: 5 });
  const startTimeRef = useRef(0);
  const completedRef = useRef(false);

  useEffect(() => {
    let disposed = false;
    startTimeRef.current = performance.now();
    const timers = new Set();
    const previousBodyOverflow = document.body.style.overflow;
    const previousRootOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    const handlePageShow = (event) => {
      if (event.persisted && !completedRef.current) {
        completedRef.current = true;
        onComplete();
      }
    };
    window.addEventListener("pageshow", handlePageShow);
    const later = (callback, delay) => {
      const timer = window.setTimeout(() => {
        timers.delete(timer);
        if (!disposed) callback();
      }, delay);
      timers.add(timer);
      return timer;
    };

    const startReveal = () => {
      if (completedRef.current || disposed) return;
      completedRef.current = true;
      const minimumWait = Math.max(
        0,
        MIN_VISIBLE_MS - (performance.now() - startTimeRef.current),
      );
      later(() => {
        setPhase("fade");
        later(() => {
          setPhase("reveal");
          later(onComplete, REVEAL_MS);
        }, FADE_MS + HOLD_MS);
      }, minimumWait);
    };

    const timeout = later(startReveal, MAX_PRELOAD_MS);
    preloadSplashAssets((nextProgress) => {
      if (!disposed) setProgress(nextProgress);
    }).then(() => {
      if (!completedRef.current) {
        window.clearTimeout(timeout);
        timers.delete(timeout);
        startReveal();
      }
    });

    return () => {
      disposed = true;
      timers.forEach(window.clearTimeout);
      timers.clear();
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousRootOverflow;
      window.removeEventListener("pageshow", handlePageShow);
      window.scrollTo(0, 0);
    };
  }, [onComplete]);

  const ratio = progress.total ? progress.loaded / progress.total : 0;

  return (
    <div
      className={`split-reveal fixed inset-0 z-[100] overflow-hidden ${phase === "reveal" ? "bg-transparent" : "bg-white"}`}
      data-phase={phase}
      role="status"
      aria-label="Loading"
      aria-live="polite"
    >
      <div className="split-reveal__shutter split-reveal__shutter--top" aria-hidden="true" />
      <div className="split-reveal__shutter split-reveal__shutter--bottom" aria-hidden="true" />
      <div className="split-reveal__content absolute inset-0 z-[2] flex flex-col items-center justify-center gap-3 px-4 text-center">
        <img
          src={LOGO_URL}
          alt=""
          aria-hidden="true"
          className="h-14 w-auto object-contain sm:h-16 md:h-20"
        />
        <p className="m-0 font-bricolage text-2xl font-[750] leading-none tracking-wide text-brand-navy sm:text-3xl">
          sa<span className="text-[1.15em]">&#8377;</span>athi finconnect
        </p>
        <div
          className="mt-1 h-0.5 w-40 overflow-hidden rounded-full bg-brand-navy/10 sm:w-56"
          role="progressbar"
          aria-label="Loading site assets"
          aria-valuemin={0}
          aria-valuemax={progress.total}
          aria-valuenow={progress.loaded}
        >
          <div
            className="h-full origin-left rounded-full bg-brand-gold transition-transform duration-200 ease-out"
            style={{ transform: `scaleX(${ratio})` }}
          />
        </div>
      </div>
      <span className="sr-only">Loading Sarathi FinConnect</span>
    </div>
  );
}
