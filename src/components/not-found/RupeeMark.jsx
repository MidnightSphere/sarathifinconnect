import { useCallback, useEffect, useRef, useState } from "react";

const INITIAL_PATHS = [
  [[14, 12], [100, 12]],
  [[14, 34], [100, 34]],
  [
    [40, 12],
    [62, 12, 0, 0, 14, 0],
    [86, 34, 0, -12, 0, 12],
    [62, 56, 14, 0, 0, 0],
    [20, 56],
    [88, 108],
  ],
];
const VIEWBOX = { minX: -30, minY: -30, maxX: 142, maxY: 142 };
const HANDLES = ["nw", "n", "ne", "e", "se", "s", "sw", "w"];
const MIN_SCALE = 0.4;
const MAX_SCALE = 2.5;
const SAFE_PAD = 24;
const MIN_TOP = 96;

function makePath(points) {
  return points
    .map((point, index) => {
      const [x, y] = point;
      if (index === 0) return `M ${x} ${y}`;
      const previous = points[index - 1];
      const [previousX, previousY, , , previousOutX = 0, previousOutY = 0] = previous;
      const [inX = 0, inY = 0] = point.slice(2);
      if (previousOutX || previousOutY || inX || inY) {
        return `C ${previousX + previousOutX} ${previousY + previousOutY} ${x + inX} ${y + inY} ${x} ${y}`;
      }
      return `L ${x} ${y}`;
    })
    .join(" ");
}

function clonePaths(paths) {
  return paths.map((path) => path.map((point) => [...point]));
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function localPointer(wrapper, clientX, clientY) {
  const rect = wrapper.getBoundingClientRect();
  return {
    x: clientX - rect.left - wrapper.clientLeft,
    y: clientY - rect.top - wrapper.clientTop,
  };
}

function handleDirection(handle) {
  return {
    x: handle.includes("w") ? -1 : handle.includes("e") ? 1 : 0,
    y: handle.includes("n") ? -1 : handle.includes("s") ? 1 : 0,
  };
}

function handleStyle(handle) {
  return {
    nw: "left-0 top-0 -translate-x-1/2 -translate-y-1/2",
    n: "left-1/2 top-0 -translate-x-1/2 -translate-y-1/2",
    ne: "right-0 top-0 translate-x-1/2 -translate-y-1/2",
    e: "right-0 top-1/2 translate-x-1/2 -translate-y-1/2",
    se: "right-0 bottom-0 translate-x-1/2 translate-y-1/2",
    s: "bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2",
    sw: "bottom-0 left-0 -translate-x-1/2 translate-y-1/2",
    w: "left-0 top-1/2 -translate-x-1/2 -translate-y-1/2",
  }[handle];
}

export default function RupeeMark({ playAreaRef }) {
  const stageRef = useRef(null);
  const svgRef = useRef(null);
  const gestureRef = useRef(null);
  const pathsRef = useRef(clonePaths(INITIAL_PATHS));
  const transformRef = useRef({ x: 0, y: 0, scale: 1 });
  const animationRef = useRef(0);
  const hoverTimerRef = useRef(0);
  const initializedRef = useRef(false);
  const [paths, setPaths] = useState(() => clonePaths(INITIAL_PATHS));
  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 });
  const [stageSize, setStageSize] = useState(() => window.innerWidth < 640 ? 200 : 260);
  const [selected, setSelected] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [active, setActive] = useState(false);

  const commitTransform = useCallback((next) => {
    transformRef.current = next;
    setTransform(next);
  }, []);

  const commitPaths = useCallback((next) => {
    pathsRef.current = next;
    setPaths(next);
  }, []);

  const getStageSize = useCallback(() => stageRef.current?.offsetWidth || (window.innerWidth < 640 ? 200 : 260), []);

  const clampTransform = useCallback((next, stageSize = getStageSize()) => {
    const wrapper = playAreaRef.current;
    if (!wrapper) return next;
    const width = wrapper.clientWidth;
    const height = wrapper.clientHeight;
    const maxFitScale = Math.max(MIN_SCALE, Math.min(
      MAX_SCALE,
      (width - SAFE_PAD * 2) / stageSize,
      (height - MIN_TOP - SAFE_PAD) / stageSize,
    ));
    const scale = Math.min(next.scale, maxFitScale);
    const renderedSize = stageSize * scale;
    const centerX = width / 2 + next.x;
    const centerY = height / 2 + next.y;
    const minX = SAFE_PAD + renderedSize / 2 - width / 2;
    const maxX = width / 2 - SAFE_PAD - renderedSize / 2;
    const minY = Math.max(SAFE_PAD + renderedSize / 2, MIN_TOP + renderedSize / 2) - height / 2;
    const maxY = height / 2 - SAFE_PAD - renderedSize / 2;
    return {
      ...next,
      scale,
      x: clamp(centerX, minX + width / 2, maxX + width / 2) - width / 2,
      y: clamp(centerY, minY + height / 2, maxY + height / 2) - height / 2,
    };
  }, [getStageSize, playAreaRef]);

  const maxScaleAt = useCallback((centerX, centerY, hx = 0, hy = 0, anchorX = centerX, anchorY = centerY) => {
    const wrapper = playAreaRef.current;
    if (!wrapper) return MAX_SCALE;
    const size = getStageSize();
    const width = wrapper.clientWidth;
    const height = wrapper.clientHeight;
    const maxWidth = hx > 0
      ? (width - SAFE_PAD - anchorX) / size
      : hx < 0
        ? (anchorX - SAFE_PAD) / size
        : 2 * Math.min(anchorX - SAFE_PAD, width - SAFE_PAD - anchorX) / size;
    const maxHeight = hy > 0
      ? (height - SAFE_PAD - anchorY) / size
      : hy < 0
        ? (anchorY - MIN_TOP) / size
        : 2 * Math.min(anchorY - MIN_TOP, height - SAFE_PAD - anchorY) / size;
    return Math.max(MIN_SCALE, Math.min(MAX_SCALE, maxWidth, maxHeight));
  }, [getStageSize, playAreaRef]);

  const initialTransform = useCallback(() => {
    const wrapper = playAreaRef.current;
    if (!wrapper) return { x: 0, y: 0, scale: 1 };
    const size = getStageSize();
    const top = 112;
    return clampTransform({
      x: 0,
      y: top + size / 2 - wrapper.clientHeight / 2,
      scale: 1,
    }, size);
  }, [clampTransform, getStageSize, playAreaRef]);

  useEffect(() => {
    const wrapper = playAreaRef.current;
    if (!wrapper) return undefined;
    let frame = 0;
    const observer = new ResizeObserver(() => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        if (stageRef.current) setStageSize(stageRef.current.offsetWidth);
        if (!initializedRef.current) {
          initializedRef.current = true;
          commitTransform(initialTransform());
          return;
        }
        commitTransform(clampTransform(transformRef.current));
      });
    });
    observer.observe(wrapper);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [clampTransform, commitTransform, initialTransform, playAreaRef]);

  useEffect(() => () => {
    cancelAnimationFrame(animationRef.current);
    window.clearTimeout(hoverTimerRef.current);
  }, []);

  useEffect(() => {
    const onOutsidePointerDown = (event) => {
      if (!stageRef.current?.contains(event.target)) setSelected(false);
    };
    const onKeyDown = (event) => {
      if (event.key === "Escape") setSelected(false);
    };
    document.addEventListener("pointerdown", onOutsidePointerDown, true);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onOutsidePointerDown, true);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  const animateTo = (targetPaths, targetTransform) => {
    cancelAnimationFrame(animationRef.current);
    const startPaths = clonePaths(pathsRef.current);
    const startTransform = { ...transformRef.current };
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      commitPaths(clonePaths(targetPaths));
      commitTransform(clampTransform(targetTransform));
      return;
    }
    let startTime;
    const tick = (now) => {
      startTime ??= now;
      const progress = Math.min((now - startTime) / 500, 1);
      const eased = 1 - (1 - progress) ** 3;
      const nextPaths = targetPaths.map((path, pathIndex) => path.map((point, pointIndex) => point.map((value, valueIndex) => (
        startPaths[pathIndex][pointIndex][valueIndex]
        + (value - startPaths[pathIndex][pointIndex][valueIndex]) * eased
      ))));
      commitPaths(nextPaths);
      commitTransform(clampTransform({
        x: startTransform.x + (targetTransform.x - startTransform.x) * eased,
        y: startTransform.y + (targetTransform.y - startTransform.y) * eased,
        scale: startTransform.scale + (targetTransform.scale - startTransform.scale) * eased,
      }));
      if (progress < 1) animationRef.current = requestAnimationFrame(tick);
    };
    animationRef.current = requestAnimationFrame(tick);
  };

  const onStageDown = (event) => {
    if (event.target.closest("[data-resize-handle], [data-anchor]") || event.button > 0) return;
    const wrapper = playAreaRef.current;
    if (!wrapper) return;
    const pointer = localPointer(wrapper, event.clientX, event.clientY);
    const size = getStageSize();
    const current = transformRef.current;
    const center = { x: wrapper.clientWidth / 2 + current.x, y: wrapper.clientHeight / 2 + current.y };
    gestureRef.current = {
      type: "move",
      pointer,
      offset: { x: pointer.x - center.x, y: pointer.y - center.y },
      start: { ...current },
      size,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
    setSelected(true);
    setActive(true);
  };

  const onDotDown = (event, pathIndex, pointIndex) => {
    event.stopPropagation();
    event.currentTarget.setPointerCapture(event.pointerId);
    gestureRef.current = { type: "dot", pathIndex, pointIndex };
    setSelected(true);
    setActive(true);
  };

  const onHandleDown = (event, handle) => {
    event.stopPropagation();
    const wrapper = playAreaRef.current;
    if (!wrapper) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    const pointer = localPointer(wrapper, event.clientX, event.clientY);
    const current = transformRef.current;
    const size = getStageSize();
    const { x: hx, y: hy } = handleDirection(handle);
    const centerX = wrapper.clientWidth / 2 + current.x;
    const centerY = wrapper.clientHeight / 2 + current.y;
    const rendered = size * current.scale;
    gestureRef.current = {
      type: "resize",
      handle,
      hx,
      hy,
      pointer,
      start: { ...current },
      center: { x: centerX, y: centerY },
      anchor: {
        x: hx ? centerX - hx * rendered / 2 : centerX,
        y: hy ? centerY - hy * rendered / 2 : centerY,
      },
      size,
    };
    setSelected(true);
    setActive(true);
  };

  const onPointerMove = (event) => {
    const gesture = gestureRef.current;
    const wrapper = playAreaRef.current;
    if (!gesture || !wrapper) return;
    if (gesture.type === "dot") {
      const matrix = svgRef.current?.getScreenCTM();
      const svg = svgRef.current;
      if (!matrix || !svg) return;
      const point = svg.createSVGPoint();
      point.x = event.clientX;
      point.y = event.clientY;
      const location = point.matrixTransform(matrix.inverse());
      const nextPaths = clonePaths(pathsRef.current);
      const target = nextPaths[gesture.pathIndex][gesture.pointIndex];
      target[0] = clamp(location.x, VIEWBOX.minX, VIEWBOX.maxX);
      target[1] = clamp(location.y, VIEWBOX.minY, VIEWBOX.maxY);
      commitPaths(nextPaths);
      return;
    }

    const pointer = localPointer(wrapper, event.clientX, event.clientY);
    if (gesture.type === "move") {
      const centerX = pointer.x - gesture.offset.x;
      const centerY = pointer.y - gesture.offset.y;
      commitTransform(clampTransform({
        ...gesture.start,
        x: centerX - wrapper.clientWidth / 2,
        y: centerY - wrapper.clientHeight / 2,
      }, gesture.size));
      return;
    }

    const { hx, hy, pointer: startPointer, anchor, size } = gesture;
    const pointerDeltaX = pointer.x - startPointer.x;
    const pointerDeltaY = pointer.y - startPointer.y;
    const candidates = [];
    if (hx) candidates.push(pointerDeltaX * hx);
    if (hy) candidates.push(pointerDeltaY * hy);
    const scaleDelta = candidates.sort((a, b) => Math.abs(b) - Math.abs(a))[0] || 0;
    const rawScale = gesture.start.scale + scaleDelta / size;
    const allowedScale = maxScaleAt(anchor.x + (hx * size * gesture.start.scale) / 2, anchor.y + (hy * size * gesture.start.scale) / 2, hx, hy, anchor.x, anchor.y);
    const scale = clamp(rawScale, MIN_SCALE, allowedScale);
    const centerX = hx ? anchor.x + (hx * size * scale) / 2 : anchor.x;
    const centerY = hy ? anchor.y + (hy * size * scale) / 2 : anchor.y;
    commitTransform(clampTransform({
      x: centerX - wrapper.clientWidth / 2,
      y: centerY - wrapper.clientHeight / 2,
      scale,
    }, size));
  };

  const endGesture = () => {
    gestureRef.current = null;
    setActive(false);
    setSelected(true);
  };

  const zoomWithWheel = (event) => {
    if (!event.ctrlKey && !event.metaKey) return;
    event.preventDefault();
    const wrapper = playAreaRef.current;
    if (!wrapper) return;
    const current = transformRef.current;
    const centerX = wrapper.clientWidth / 2 + current.x;
    const centerY = wrapper.clientHeight / 2 + current.y;
    const scale = clamp(current.scale * (event.deltaY < 0 ? 1.06 : 0.94), MIN_SCALE, maxScaleAt(centerX, centerY));
    commitTransform(clampTransform({ ...current, scale }));
    setSelected(true);
  };

  const resizeWithKeyboard = (event, handle) => {
    if (!["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.key)) return;
    const { x: hx, y: hy } = handleDirection(handle);
    const xKey = event.key === "ArrowLeft" || event.key === "ArrowRight";
    const direction = xKey ? hx : hy;
    if (!direction) return;
    const along = (event.key === "ArrowRight" || event.key === "ArrowDown" ? 1 : -1) * direction;
    event.preventDefault();
    const wrapper = playAreaRef.current;
    if (!wrapper) return;
    const current = transformRef.current;
    const size = getStageSize();
    const scaleChange = (event.shiftKey ? 20 : 8) * along / size;
    const centerX = wrapper.clientWidth / 2 + current.x;
    const centerY = wrapper.clientHeight / 2 + current.y;
    const rendered = size * current.scale;
    const anchor = {
      x: hx ? centerX - hx * rendered / 2 : centerX,
      y: hy ? centerY - hy * rendered / 2 : centerY,
    };
    const allowedScale = maxScaleAt(centerX, centerY, hx, hy, anchor.x, anchor.y);
    const scale = clamp(current.scale + scaleChange, MIN_SCALE, allowedScale);
    commitTransform(clampTransform({
      x: (hx ? anchor.x + hx * size * scale / 2 : anchor.x) - wrapper.clientWidth / 2,
      y: (hy ? anchor.y + hy * size * scale / 2 : anchor.y) - wrapper.clientHeight / 2,
      scale,
    }));
  };

  const reset = () => animateTo(clonePaths(INITIAL_PATHS), initialTransform());

  const shuffle = () => {
    const nextPaths = clonePaths(INITIAL_PATHS).map((path) => path.map((point) => {
      const changed = [...point];
      changed[0] += (Math.random() - 0.5) * 18;
      changed[1] += (Math.random() - 0.5) * 18;
      return changed;
    }));
    animateTo(nextPaths, transformRef.current);
  };

  const points = paths.flatMap((path, pathIndex) => path.map((point, pointIndex) => ({ pathIndex, pointIndex, point })));
  const renderedSize = stageSize * transform.scale;
  const controlsStyle = {
    left: "50%",
    top: `${112 + stageSize + 24}px`,
  };
  const showSelection = selected || hovered || active;

  return (
    <>
      <div className="h-[268px] sm:h-[328px]" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-0 z-30 overflow-visible" aria-label="Interactive rupee mark controls">
        <div
          ref={stageRef}
          role="application"
          aria-label="Interactive rupee mark. Drag its dots to reshape, the mark to move, or handles to resize."
          tabIndex={0}
          onPointerDown={onStageDown}
          onPointerMove={onPointerMove}
          onPointerUp={endGesture}
          onPointerCancel={endGesture}
          onClick={() => setSelected(true)}
          onFocus={() => setSelected(true)}
          onPointerEnter={() => {
            window.clearTimeout(hoverTimerRef.current);
            setHovered(true);
          }}
          onPointerLeave={() => {
            window.clearTimeout(hoverTimerRef.current);
            hoverTimerRef.current = window.setTimeout(() => setHovered(false), 250);
          }}
          onWheel={zoomWithWheel}
          className={`group pointer-events-auto absolute left-1/2 top-1/2 h-[200px] w-[200px] touch-none select-none sm:h-[260px] sm:w-[260px] ${active ? "z-30 cursor-grabbing" : "z-30 cursor-grab"}`}
          style={{ transform: `translate(calc(-50% + ${transform.x}px), calc(-50% + ${transform.y}px)) scale(${transform.scale})`, transformOrigin: "center" }}
        >
          <svg ref={svgRef} viewBox="-30 -30 172 172" role="img" aria-label="Interactive rupee symbol" className="absolute inset-0 h-full w-full overflow-visible">
            <defs><linearGradient id="rupee-stroke" x1="0" y1="0" x2="1" y2="1"><stop stopColor="var(--color-brand-navy)" /><stop offset="1" stopColor="var(--color-brand-navy-deep)" /></linearGradient></defs>
            {paths.map((path, index) => <path key={index} d={makePath(path)} fill="none" stroke="url(#rupee-stroke)" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round" />)}
            {points.map(({ pathIndex, pointIndex, point }) => <g key={`${pathIndex}-${pointIndex}`} data-anchor="true" onPointerDown={(event) => onDotDown(event, pathIndex, pointIndex)} className="cursor-grab"><circle cx={point[0]} cy={point[1]} r="9" fill="transparent" /><circle cx={point[0]} cy={point[1]} r="3.2" fill={pathIndex === 0 && pointIndex === 0 ? "var(--color-brand-navy)" : "var(--color-surface)"} stroke="var(--color-brand-navy)" strokeWidth="1.5" /></g>)}
          </svg>
          <div aria-hidden="true" className={`pointer-events-none absolute inset-0 border border-brand-navy/35 transition-opacity [@media(hover:none)]:opacity-100 ${showSelection ? "opacity-100" : "opacity-0"}`} />
          {HANDLES.map((handle) => <button key={handle} type="button" data-resize-handle={handle} aria-label={`Resize rupee mark ${handle}. Use arrow keys to resize`} onPointerDown={(event) => onHandleDown(event, handle)} onKeyDown={(event) => resizeWithKeyboard(event, handle)} className={`absolute z-10 h-7 w-7 touch-none rounded-full bg-transparent p-0 before:absolute before:left-1/2 before:top-1/2 before:h-2.5 before:w-2.5 before:-translate-x-1/2 before:-translate-y-1/2 before:rounded-full before:border before:border-brand-navy before:bg-white before:shadow-sm [@media(pointer:coarse)]:h-11 [@media(pointer:coarse)]:w-11 ${handleStyle(handle)} ${showSelection ? "opacity-100" : "opacity-0"} [@media(hover:none)]:opacity-100 ${handle === "n" || handle === "s" ? "cursor-ns-resize" : handle === "e" || handle === "w" ? "cursor-ew-resize" : handle === "ne" || handle === "sw" ? "cursor-nesw-resize" : "cursor-nwse-resize"}`} />)}
          <span className="absolute left-1/2 top-full mt-2 -translate-x-1/2 whitespace-nowrap rounded-full bg-white/90 px-2 py-0.5 font-space text-[10px] text-brand-navy shadow-sm">{Math.round(renderedSize)} × {Math.round(renderedSize)}</span>
        </div>
        <div className="pointer-events-auto absolute z-40 -translate-x-1/2 flex items-center gap-2 rounded-full border border-border bg-white/90 p-1 shadow-sm backdrop-blur" style={controlsStyle}>
          <button type="button" onClick={reset} className="rounded-full px-3 py-1.5 font-space text-xs font-medium text-brand-navy hover:bg-surface-soft focus-visible:outline-2 focus-visible:outline-brand-gold">Reset</button>
          <button type="button" onClick={shuffle} className="rounded-full px-3 py-1.5 font-space text-xs font-medium text-brand-navy hover:bg-surface-soft focus-visible:outline-2 focus-visible:outline-brand-gold">Shuffle</button>
        </div>
      </div>
    </>
  );
}
