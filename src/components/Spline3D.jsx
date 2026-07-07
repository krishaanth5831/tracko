import { Suspense, lazy } from 'react'

const Spline = lazy(() => import('@splinetool/react-spline'))

// Official example scenes published by Spline in the react-spline docs.
export const SCENES = {
  cube: 'https://prod.spline.design/6Wq1Q7YGyM-iab9i/scene.splinecode',
  showcase: 'https://prod.spline.design/KFonZGtsoUXP-qx7/scene.splinecode',
}

// Keyword → scene, same idea as autoLogo's emoji table. To theme a new
// category, publish a (grayscale-friendly) Spline scene, add its URL to
// SCENES, and add a row here. First match wins.
const SCENE_MAP = [
  [/money|save|fund|budget|cash|salary|invest/i, SCENES.showcase],
  [/launch|rocket|release|drop|product/i, SCENES.showcase],
]

export function sceneFor(name = '') {
  for (const [pattern, scene] of SCENE_MAP) {
    if (pattern.test(name)) return scene
  }
  return SCENES.cube
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
