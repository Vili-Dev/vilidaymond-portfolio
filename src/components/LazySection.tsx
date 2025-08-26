'use client';

import { lazy, Suspense, ComponentType } from 'react';
import LoadingSpinner from './LoadingSpinner';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';

interface LazySectionProps {
  children: React.ReactNode;
  fallback?: React.ComponentType;
  threshold?: number;
  rootMargin?: string;
  className?: string;
}

export default function LazySection({ 
  children, 
  fallback: Fallback = LoadingSpinner,
  threshold = 0.1,
  rootMargin = '100px',
  className = ''
}: LazySectionProps) {
  const [ref, isIntersecting] = useIntersectionObserver<HTMLDivElement>({
    threshold,
    rootMargin,
    triggerOnce: true
  });

  return (
    <div ref={ref} className={className}>
      {isIntersecting ? (
        <Suspense fallback={<Fallback />}>
          {children}
        </Suspense>
      ) : (
        <div className="min-h-screen flex items-center justify-center">
          <Fallback />
        </div>
      )}
    </div>
  );
}

// HOC for lazy loading components
export function withLazyLoading<P extends object>(
  Component: ComponentType<P>,
  loadingComponent?: ComponentType
) {
  const WrappedComponent = (props: P) => {
    return (
      <LazySection fallback={loadingComponent}>
        <Component {...props} />
      </LazySection>
    );
  };

  WrappedComponent.displayName = `withLazyLoading(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
}