
import { useState, useEffect } from "react";
import { useIsMobile } from "./use-mobile";

type Breakpoint = "sm" | "md" | "lg" | "xl" | "2xl";

const breakpointValues: Record<Breakpoint, number> = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
};

export function useBreakpoint(breakpoint: Breakpoint) {
  const { isMobile } = useIsMobile();
  const [isBreakpoint, setIsBreakpoint] = useState(false);

  useEffect(() => {
    const checkBreakpoint = () => {
      const width = window.innerWidth;
      setIsBreakpoint(width < breakpointValues[breakpoint]);
    };

    checkBreakpoint();
    window.addEventListener("resize", checkBreakpoint);
    return () => window.removeEventListener("resize", checkBreakpoint);
  }, [breakpoint]);

  return { 
    isMobile, 
    isBreakpoint,
    [`is${breakpoint.charAt(0).toUpperCase() + breakpoint.slice(1)}`]: isBreakpoint 
  };
}
