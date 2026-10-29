import { useState } from 'react'
import { motion, useMotionTemplate, useMotionValue } from 'motion/react'

/**
 * Card with a cursor-following spotlight and glowing gold border.
 * Self-styled (inline), so it works without any extra CSS.
 * Extra props (id, data-*, aria-*) are passed to the outer element.
 */
function MagicCard({
  children,
  className = '',
  style,
  gradientSize = 320,
  gradientColor = 'rgba(198, 146, 20, 0.16)',
  gradientOpacity = 0.8,
  gradientFrom = '#c69214',
  gradientTo = '#f3d98b',
  backgroundColor = '#0f2759',
  borderColor = 'rgba(255, 255, 255, 0.12)',
  radius = 28,
  ...rest
}) {
  const pointerX = useMotionValue(-gradientSize)
  const pointerY = useMotionValue(-gradientSize)
  const [hovered, setHovered] = useState(false)

  const borderBackground = useMotionTemplate`
    linear-gradient(${backgroundColor} 0 0) padding-box,
    radial-gradient(${gradientSize}px circle at ${pointerX}px ${pointerY}px,
      ${gradientFrom}, ${gradientTo}, ${borderColor} 100%) border-box
  `
  const spotlightBackground = useMotionTemplate`
    radial-gradient(${gradientSize}px circle at ${pointerX}px ${pointerY}px,
      ${gradientColor}, transparent 100%)
  `

  const movePointer = (event) => {
    const bounds = event.currentTarget.getBoundingClientRect()
    pointerX.set(event.clientX - bounds.left)
    pointerY.set(event.clientY - bounds.top)
  }

  const enter = () => setHovered(true)

  const leave = () => {
    setHovered(false)
    pointerX.set(-gradientSize)
    pointerY.set(-gradientSize)
  }

  return (
    <motion.div
      {...rest}
      className={`magic-card ${className}`.trim()}
      onPointerEnter={enter}
      onPointerMove={movePointer}
      onPointerLeave={leave}
      style={{
        position: 'relative',
        border: '1px solid transparent',
        borderRadius: radius,
        ...style,
        background: borderBackground,
      }}
    >
      <motion.div
        aria-hidden="true"
        initial={false}
        animate={{ opacity: hovered ? gradientOpacity : 0 }}
        transition={{ duration: 0.35 }}
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: 'inherit',
          pointerEvents: 'none',
          background: spotlightBackground,
        }}
      />
      <div className="magic-card-content" style={{ position: 'relative', zIndex: 1 }}>
        {children}
      </div>
    </motion.div>
  )
}

export default MagicCard