import { useEffect, useRef, useState, type Ref } from 'react';
import { useIntersectionObserver } from '../../../hooks/useIntersectionObserver';

interface StatCounterProps {
  target: number;
  suffix?: string;
  label: string;
}

export default function StatCounter({ target, suffix = '', label }: StatCounterProps) {
  const [ref, isVisible] = useIntersectionObserver({ threshold: 0.5 });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isVisible) return;

    let start = 0;
    const duration = 2000; // 2 seconds
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Ease-out quartic for smooth landing
      const easeOut = 1 - Math.pow(1 - progress, 4);
      const current = Math.floor(start + (target - start) * easeOut);
      
      setCount(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(target);
      }
    };

    requestAnimationFrame(animate);
  }, [isVisible, target]);

  return (
    <div ref={ref as unknown as Ref<HTMLDivElement>} className="stat-item">
      <span className="stat-number">
        {count.toLocaleString()}{suffix}
      </span>
      <span className="stat-label">{label}</span>
    </div>
  );
}