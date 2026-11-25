import { useMouseParallax } from '../../hooks/useMouseParallax';
import { useTheme } from '../../hooks/useTheme';

interface AnimatedBackgroundProps {
  variant?: 'auth' | 'dashboard';
  intensity?: 'low' | 'medium' | 'high';
}

export default function AnimatedBackground({ variant = 'auth', intensity = 'medium' }: AnimatedBackgroundProps) {
  const { resolvedTheme } = useTheme();
  const parallaxIntensity = intensity === 'low' ? 10 : intensity === 'high' ? 30 : 20;
  const mouse = useMouseParallax(parallaxIntensity);

  return (
    <div className={`animated-bg animated-bg--${variant} animated-bg--${resolvedTheme}`} aria-hidden="true">
      {/* Layer 1: Ambient gradient orbs */}
      <div className="bg-layer bg-layer--orbs" style={{ transform: `translate(${mouse.x * 0.3}px, ${mouse.y * 0.3}px)` }}>
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
        <div className="orb orb-3"></div>
      </div>

      {/* Layer 2: Floating geometric shapes */}
      <div className="bg-layer bg-layer--shapes" style={{ transform: `translate(${mouse.x * 0.6}px, ${mouse.y * 0.6}px)` }}>
        <div className="shape shape-hex shape-1"></div>
        <div className="shape shape-circle shape-2"></div>
        <div className="shape shape-square shape-3"></div>
        <div className="shape shape-hex shape-4"></div>
      </div>

      {/* Layer 3: Subtle particles */}
      <div className="bg-layer bg-layer--particles" style={{ transform: `translate(${mouse.x}px, ${mouse.y}px)` }}>
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className={`particle particle-${i + 1}`}></div>
        ))}
      </div>

      {/* Grid overlay for depth */}
      <div className="bg-grid"></div>
    </div>
  );
}