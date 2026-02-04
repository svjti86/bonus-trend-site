import { useEffect, useRef } from 'react'

interface RotatingAnimationOptions {
  initialAngle?: number
  rotationStep?: number
  interval?: number
}

function useRotatingAnimation({
  initialAngle = 0,
  rotationStep = 30,
  interval = 1500,
}: RotatingAnimationOptions = {}): React.RefObject<SVGSVGElement> {
  const ellipseRef = useRef<SVGSVGElement>(null)
  const ellipseAngle = useRef<number>(initialAngle)

  useEffect(() => {
    // на сервере/edge нет window и requestAnimationFrame
    if (typeof window === 'undefined' || typeof window.requestAnimationFrame === 'undefined') {
      return
    }

    let frameId: number

    const rotateEllipse = () => {
      if (ellipseRef.current) {
        ellipseRef.current.style.transform = `rotate(${ellipseAngle.current}deg)`
      }
      frameId = window.requestAnimationFrame(rotateEllipse)
    }

    // первый запуск анимации
    frameId = window.requestAnimationFrame(rotateEllipse)

    const intervalId = window.setInterval(() => {
      ellipseAngle.current =
        ellipseAngle.current < 90 ? ellipseAngle.current + rotationStep : 0
    }, interval)

    return () => {
      window.clearInterval(intervalId)
      window.cancelAnimationFrame(frameId)
    }
  }, [rotationStep, interval])

  return ellipseRef as React.RefObject<SVGSVGElement>
}

export default useRotatingAnimation
