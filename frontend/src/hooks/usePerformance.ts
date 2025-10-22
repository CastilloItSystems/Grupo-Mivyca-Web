"use client";

import { useEffect, useCallback, useRef, useState } from "react";

interface PerformanceMetrics {
  renderTime: number;
  componentName: string;
  timestamp: number;
}

/**
 * Hook para monitorear el rendimiento de componentes
 */
export function usePerformanceMonitor(componentName: string) {
  const renderStartTime = useRef<number>(0);
  const mountTime = useRef<number>(0);

  useEffect(() => {
    // Tiempo de montaje del componente
    mountTime.current = performance.now();

    return () => {
      // Cleanup al desmontar
      const unmountTime = performance.now();
      if (process.env.NODE_ENV === "development") {
        console.log(
          `🔄 ${componentName} lifecycle: ${(unmountTime - mountTime.current).toFixed(2)}ms`
        );
      }
    };
  }, [componentName]);

  const startRender = useCallback(() => {
    renderStartTime.current = performance.now();
  }, []);

  const endRender = useCallback(() => {
    const renderTime = performance.now() - renderStartTime.current;

    if (process.env.NODE_ENV === "development" && renderTime > 16) {
      console.warn(
        `⚠️ Slow render in ${componentName}: ${renderTime.toFixed(2)}ms`
      );
    }

    return renderTime;
  }, [componentName]);

  const measureAsyncOperation = useCallback(
    async <T>(
      operation: () => Promise<T>,
      operationName: string
    ): Promise<T> => {
      const start = performance.now();
      try {
        const result = await operation();
        const duration = performance.now() - start;

        if (process.env.NODE_ENV === "development") {
          console.log(
            `⏱️ ${componentName}.${operationName}: ${duration.toFixed(2)}ms`
          );
        }

        return result;
      } catch (error) {
        const duration = performance.now() - start;
        console.error(
          `❌ ${componentName}.${operationName} failed after ${duration.toFixed(2)}ms:`,
          error
        );
        throw error;
      }
    },
    [componentName]
  );

  return {
    startRender,
    endRender,
    measureAsyncOperation,
  };
}

/**
 * Hook para monitorear Web Vitals
 */
export function useWebVitals() {
  useEffect(() => {
    if (typeof window !== "undefined" && "PerformanceObserver" in window) {
      // Core Web Vitals
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === "largest-contentful-paint") {
            console.log("🎯 LCP:", entry.startTime);
          }
          if (entry.entryType === "first-input") {
            console.log(
              "🖱️ FID:",
              (entry as any).processingStart - entry.startTime
            );
          }
          if (entry.entryType === "layout-shift") {
            if (!(entry as any).hadRecentInput) {
              console.log("📐 CLS:", (entry as any).value);
            }
          }
        }
      });

      observer.observe({
        entryTypes: ["largest-contentful-paint", "first-input", "layout-shift"],
      });

      return () => observer.disconnect();
    }
  }, []);
}

/**
 * Hook para lazy loading con Intersection Observer
 */
export function useLazyLoad(
  ref: React.RefObject<Element>,
  onIntersect: () => void,
  options: IntersectionObserverInit = {}
) {
  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          onIntersect();
          observer.unobserve(element);
        }
      },
      {
        threshold: 0.1,
        rootMargin: "50px",
        ...options,
      }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [ref, onIntersect, options]);
}

/**
 * Hook para debouncing con React 18
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
