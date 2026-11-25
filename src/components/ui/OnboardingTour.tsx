import { useState, useEffect, useRef } from 'react';

interface TourStep {
  target: string;
  title: string;
  description: string;
  placement: 'top' | 'bottom' | 'left' | 'right';
}

interface OnboardingTourProps {
  steps: TourStep[];
  onComplete: () => void;
}

export default function OnboardingTour({ steps, onComplete }: OnboardingTourProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const target = document.querySelector(steps[currentStep].target);
    if (target && tooltipRef.current) {
      target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [currentStep, steps]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      onComplete();
    }
  };

  const step = steps[currentStep];
  const targetEl = document.querySelector(step.target);
  
  if (!targetEl) return null;

  const rect = targetEl.getBoundingClientRect();
  const scrollY = window.scrollY;
  
  // Simple positioning logic
  let top = rect.bottom + scrollY + 16;
  let left = rect.left + (rect.width / 2) - 150; // Assuming ~300px tooltip width

  if (step.placement === 'top') {
    top = rect.top + scrollY - 150; // Approximate tooltip height
  }

  return (
    <>
      <div className="tour-overlay" />
      <div 
        ref={tooltipRef}
        className="tour-tooltip"
        style={{ top: `${top}px`, left: `${Math.max(16, left)}px` }}
      >
        <div className="tour-tooltip-header">
          <span className="tour-step-indicator">Step {currentStep + 1} of {steps.length}</span>
          <button className="tour-skip-btn" onClick={onComplete}>Skip Tour</button>
        </div>
        <h3 className="tour-tooltip-title">{step.title}</h3>
        <p className="tour-tooltip-desc">{step.description}</p>
        <div className="tour-tooltip-footer">
          <button className="tour-next-btn" onClick={handleNext}>
            {currentStep === steps.length - 1 ? 'Got it!' : 'Next'}
          </button>
        </div>
      </div>
    </>
  );
}