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

function maxMarkSize() {
  return Math.max(Math.min(650, window.innerWidth, document.documentElement.scrollHeight), 104);
}

export default function RupeeMark() {
  const svgRef = useRef(null);
  const frameRef = useRef(null);
  const dragRef = useRef(null);
  const animationRef = useRef(0);
  const [paths, setPaths] = useState(() => clonePaths(INITIAL_PATHS));
  const [box, setBox] = useState({ x: 0, y: 0, size: 260 });
  const [active, setActive] = useState(false);
  const [moving, setMoving] = useState(false);
  const pathsRef = useRef(paths);
  const boxRef = useRef(box);

  useEffect(() => {
    const size = window.innerWidth < 640 ? 200 : 260;
    setBox({ x: 0, y: 0, size });
  }, []);

  const clampOffset = (x, y, size) => {
    const slot = frameRef.current?.parentElement?.getBoundingClientRect();
    if (!slot) return { x, y };
    const baseX = (slot.width - size) / 2;
    const baseY = (slot.height - size) / 2;
    const minX = slot.left + window.scrollX - (slot.left + window.scrollX + baseX);
    const maxX = slot.right + window.scrollX - size - (slot.left + window.scrollX + baseX);
    const minY = slot.top + window.scrollY - (slot.top + window.scrollY + baseY);
    const maxY = document.documentElement.scrollHeight - size - (slot.top + window.scrollY + baseY);
    return { x: clamp(x, minX, maxX), y: clamp(y, minY, maxY) };
  };

  const setPathsFrame = useCallback((next) => {
    pathsRef.current = next;
    if (animationRef.current) return;
    animationRef.current = requestAnimationFrame(() => {
      animationRef.current = 0;
      setPaths(clonePaths(pathsRef.current));
    });
  }, []);

  const setBoxFrame = useCallback((next) => {
    boxRef.current = next;
    if (frameRef.current) return;
    frameRef.current = requestAnimationFrame(() => {
      frameRef.current = 0;
      setBox({ ...boxRef.current });
    });
  }, []);

  useEffect(() => () => {
    cancelAnimationFrame(animationRef.current);
    cancelAnimationFrame(frameRef.current);
  }, []);

  const movePoint = (event, pathIndex, pointIndex) => {
    event.stopPropagation();
    event.currentTarget.setPointerCapture(event.pointerId);
    const point = pathsRef.current[pathIndex][pointIndex];
    dragRef.current = { type: "point", pathIndex, pointIndex, offsetX: point[0], offsetY: point[1] };
    setActive(true);
  };

  const beginMove = (event) => {
    if (event.target.closest("[data-resize-handle], [data-anchor]") || event.button > 0) return;
    dragRef.current = { type: "move", clientX: event.clientX, clientY: event.clientY, box: { ...boxRef.current } };
    event.currentTarget.setPointerCapture(event.pointerId);
    setMoving(true);
    setActive(true);
  };

  const beginResize = (event, handle) => {
    event.stopPropagation();
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = { type: "resize", handle, clientX: event.clientX, clientY: event.clientY, start: { ...boxRef.current } };
    setActive(true);
  };

  const resizeWithKeyboard = (event, handle) => {
    const horizontal = handle.includes("e") ? 1 : handle.includes("w") ? -1 : 0;
    const vertical = handle.includes("s") ? 1 : handle.includes("n") ? -1 : 0;
    if (!horizontal && !vertical) return;
    if (!["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.key)) return;
    event.preventDefault();
    const isHorizontalKey = event.key === "ArrowLeft" || event.key === "ArrowRight";
    const axis = isHorizontalKey ? horizontal : vertical;
    const alongHandle = isHorizontalKey
      ? (event.key === "ArrowRight" ? 1 : -1) * axis
      : (event.key === "ArrowDown" ? 1 : -1) * axis;
    if (!alongHandle) return;
    const current = boxRef.current;
    const change = (event.shiftKey ? 20 : 8) * alongHandle;
    const size = clamp(current.size + change, 0.4 * 260, maxMarkSize());
    const applied = size - current.size;
    const shiftX = horizontal === 1 ? 0 : horizontal === -1 ? -applied : -applied / 2;
    const shiftY = vertical === 1 ? 0 : vertical === -1 ? -applied : -applied / 2;
    setBoxFrame({
      size,
      x: clamp(current.x + shiftX, 0, Math.max(innerWidth - size, 0)),
      y: clamp(current.y + shiftY, 72, Math.max(innerHeight - size - 8, 72)),
    });
  };

  const onPointerMove = (event) => {
    const drag = dragRef.current;
    if (!drag) return;
    if (drag.type === "point") {
      const matrix = svgRef.current?.getScreenCTM();
      if (!matrix) return;
      const point = svgRef.current.createSVGPoint();
      point.x = event.clientX;
      point.y = event.clientY;
      const location = point.matrixTransform(matrix.inverse());
      const next = clonePaths(pathsRef.current);
      const target = next[drag.pathIndex][drag.pointIndex];
      const dx = clamp(location.x, VIEWBOX.minX, VIEWBOX.maxX) - target[0];
      const dy = clamp(location.y, VIEWBOX.minY, VIEWBOX.maxY) - target[1];
      target[0] += dx;
      target[1] += dy;
      setPathsFrame(next);
    } else if (drag.type === "move") {
      const current = drag.box;
      const size = current.size;
      setBoxFrame({
        ...current,
        x: clamp(current.x + event.clientX - drag.clientX, 0, Math.max(innerWidth - size, 0)),
        y: clamp(current.y + event.clientY - drag.clientY, 72, Math.max(innerHeight - size - 8, 72)),
      });
    } else {
      const { start, handle } = drag;
      const directionX = handle.includes("w") ? -1 : handle.includes("e") ? 1 : 0;
      const directionY = handle.includes("n") ? -1 : handle.includes("s") ? 1 : 0;
      const deltaX = (event.clientX - drag.clientX) * directionX;
      const deltaY = (event.clientY - drag.clientY) * directionY;
      const changeBase = directionX && directionY
        ? (Math.abs(deltaX) >= Math.abs(deltaY) ? deltaX : deltaY)
        : directionX ? deltaX : deltaY;
      const change = changeBase * 2;
      const size = clamp(start.size + change, 0.4 * 260, maxMarkSize());
      const appliedChange = size - start.size;
      const shiftX = directionX === 1 ? 0 : directionX === -1 ? -appliedChange : -appliedChange / 2;
      const shiftY = directionY === 1 ? 0 : directionY === -1 ? -appliedChange : -appliedChange / 2;
      setBoxFrame({
        size,
        x: clamp(start.x + shiftX, 0, Math.max(innerWidth - size, 0)),
        y: clamp(start.y + shiftY, 72, Math.max(innerHeight - size - 8, 72)),
      });
    }
  };

  const endDrag = () => {
    dragRef.current = null;
    setActive(false);
    setMoving(false);
  };

  const resizeWheel = (event) => {
    event.preventDefault();
    const current = boxRef.current;
    const size = clamp(current.size * (event.deltaY < 0 ? 1.06 : 0.94), 104, maxMarkSize());
    setBoxFrame({
      size,
      x: clamp(current.x + (current.size - size) / 2, 0, Math.max(innerWidth - size, 0)),
      y: clamp(current.y + (current.size - size) / 2, 72, Math.max(innerHeight - size - 8, 72)),
    });
    setActive(true);
  };

  const animatePaths = (target) => {
    cancelAnimationFrame(animationRef.current);
    const start = clonePaths(pathsRef.current);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      pathsRef.current = target;
      setPaths(target);
      return;
    }
    const began = performance.now();
    const tick = (now) => {
      const progress = Math.min((now - began) / 500, 1);
      const eased = 1 - (1 - progress) ** 3;
      const next = target.map((path, p) => path.map((point, i) => point.map((value, j) => start[p][i][j] + (value - start[p][i][j]) * eased)));
      pathsRef.current = next;
      setPaths(next);
      if (progress < 1) animationRef.current = requestAnimationFrame(tick);
    };
    animationRef.current = requestAnimationFrame(tick);
  };

  const reset = () => {
    animatePaths(clonePaths(INITIAL_PATHS));
    const size = window.innerWidth < 640 ? 200 : 260;
    setBoxFrame({ x: Math.max((innerWidth - size) / 2, 0), y: clamp(112, 72, Math.max(innerHeight - size - 8, 72)), size });
  };

  const shuffle = () => {
    const next = clonePaths(INITIAL_PATHS).map((path) => path.map((point) => {
      const changed = [...point];
      changed[0] += (Math.random() - 0.5) * 18;
      changed[1] += (Math.random() - 0.5) * 18;
      return changed;
    }));
    animatePaths(next);
  };

  const points = paths.flatMap((path, pathIndex) => path.map((point, pointIndex) => ({ pathIndex, pointIndex, point })));
  const handleStyle = (handle) => {
    const position = {
      nw: "left-0 top-0 -translate-x-1/2 -translate-y-1/2", n: "left-1/2 top-0 -translate-x-1/2 -translate-y-1/2", ne: "right-0 top-0 translate-x-1/2 -translate-y-1/2",
      e: "right-0 top-1/2 translate-x-1/2 -translate-y-1/2", se: "right-0 bottom-0 translate-x-1/2 translate-y-1/2", s: "bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2",
      sw: "bottom-0 left-0 -translate-x-1/2 translate-y-1/2", w: "left-0 top-1/2 -translate-x-1/2 -translate-y-1/2",
    };
    return position[handle];
  };

  return (
    <div ref={frameRef} className="relative z-10 h-[200px] w-[200px] touch-none sm:h-[260px] sm:w-[260px]" aria-label="Interactive rupee mark controls">
      <div
        role="application"
        aria-label="Interactive rupee mark. Drag its dots to reshape, the mark to move, or handles to resize."
        onPointerDown={beginMove}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onWheel={resizeWheel}
        className={`group absolute left-1/2 top-1/2 touch-none ${active ? "z-30" : "z-10"}`}
        style={{ width: 260, height: 260, transform: `translate(calc(-50% + ${box.x}px), calc(-50% + ${box.y}px)) scale(${box.size / 260})`, transformOrigin: "center", cursor: moving ? "grabbing" : "grab" }}
      >
        <svg ref={svgRef} viewBox="-30 -30 172 172" role="img" aria-label="Interactive rupee symbol" className="absolute inset-0 h-full w-full overflow-visible">
          <defs><linearGradient id="rupee-stroke" x1="0" y1="0" x2="1" y2="1"><stop stopColor="var(--color-brand-navy)" /><stop offset="1" stopColor="var(--color-brand-navy-deep)" /></linearGradient></defs>
          {paths.map((path, index) => <path key={index} d={makePath(path)} fill="none" stroke="url(#rupee-stroke)" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round" />)}
          {points.map(({ pathIndex, pointIndex, point }) => <g key={`${pathIndex}-${pointIndex}`} data-anchor="true" onPointerDown={(event) => movePoint(event, pathIndex, pointIndex)} className="cursor-grab"><circle cx={point[0]} cy={point[1]} r="9" fill="transparent" /><circle cx={point[0]} cy={point[1]} r="3.2" fill={pathIndex === 0 && pointIndex === 0 ? "var(--color-brand-navy)" : "var(--color-surface)"} stroke="var(--color-brand-navy)" strokeWidth="1.5" /></g>)}
        </svg>
        <div aria-hidden="true" className={`pointer-events-none absolute inset-0 border border-brand-navy/35 ${active ? "opacity-100" : "opacity-0 group-hover:opacity-100"} transition-opacity [@media(hover:none)]:opacity-100`} />
        {HANDLES.map((handle) => <button key={handle} type="button" data-resize-handle={handle} aria-label={`Resize rupee mark ${handle}. Use arrow keys to resize`} onPointerDown={(event) => beginResize(event, handle)} onKeyDown={(event) => resizeWithKeyboard(event, handle)} className={`absolute z-10 h-2.5 w-2.5 rounded-full border border-brand-navy bg-white shadow-sm ${handleStyle(handle)} ${active ? "opacity-100" : "opacity-0 group-hover:opacity-100"} [@media(hover:none)]:opacity-100`} />)}
        <span className="absolute left-1/2 top-full mt-2 -translate-x-1/2 whitespace-nowrap rounded-full bg-white/90 px-2 py-0.5 font-space text-[10px] text-brand-navy shadow-sm">{Math.round(box.size)} × {Math.round(box.size)}</span>
      </div>
      <div className="mt-3 flex justify-center">
      <div className="pointer-events-auto flex items-center gap-2 rounded-full border border-border bg-white/90 p-1 shadow-sm backdrop-blur">
        <button type="button" onClick={reset} className="rounded-full px-3 py-1.5 font-space text-xs font-medium text-brand-navy hover:bg-surface-soft focus-visible:outline-2 focus-visible:outline-brand-gold">Reset</button>
        <button type="button" onClick={shuffle} className="rounded-full px-3 py-1.5 font-space text-xs font-medium text-brand-navy hover:bg-surface-soft focus-visible:outline-2 focus-visible:outline-brand-gold">Shuffle</button>
      </div>
      </div>
    </div>
  );
}
