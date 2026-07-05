import { Suspense, lazy } from 'react'

const Spline = lazy(() => import('@splinetool/react-spline'))

// Official example scenes published by Spline in the react-spline docs.
export const SCENES = {
  cube: 'https://prod.spline.design/6Wq1Q7YGyM-iab9i/scene.splinecode',
  showcase: 'https://prod.spline.design/KFonZGtsoUXP-qx7/scene.splinecode',
}

// Lazy-loaded interactive 3D scene, grayscaled to fit the b/w theme.
export function Spline3D({ scene = SCENES.cube, className = '', dim = false }) {
  return (
    <div
      className={className}
      style={{ filter: dim ? 'grayscale(1) brightness(0.5)' : 'grayscale(1)' }}
    >
      <Suspense fallback={null}>
        <Spline scene={scene} />
      </Suspense>
    </div>
  )
}
