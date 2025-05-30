
import * as React from "react"

// Define breakpoints para o design responsivo
export const BREAKPOINTS = {
  MOBILE: 480,  // Mobile devices
  TABLET: 768,  // Tablets
  LAPTOP: 1024, // Laptops
  DESKTOP: 1280 // Desktops
}

export interface Breakpoints {
  isMobile: boolean;      // < 480px
  isTablet: boolean;      // 481px - 768px
  isLaptop: boolean;      // 769px - 1024px
  isDesktop: boolean;     // > 1024px
  isTouch: boolean;       // Mobile or Tablet (< 768px)
  isReady: boolean;       // Component mounted and window size calculated
  width: number | null;   // Current window width
  height: number | null;  // Current window height
}

export function useBreakpoints(): Breakpoints {
  const [size, setSize] = React.useState<{
    width: number | null;
    height: number | null;
  }>({
    width: null,
    height: null
  });
  const [isReady, setIsReady] = React.useState<boolean>(false);

  React.useEffect(() => {
    const handleResize = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
      
      if (!isReady) {
        setIsReady(true);
      }
    };

    // Check on mount and add event listener
    handleResize();
    window.addEventListener("resize", handleResize);
    
    // Clean up
    return () => window.removeEventListener("resize", handleResize);
  }, [isReady]);

  // Calculate current breakpoints
  const isMobile = (size.width !== null) ? size.width < BREAKPOINTS.MOBILE : false;
  const isTablet = (size.width !== null) ? size.width >= BREAKPOINTS.MOBILE && size.width < BREAKPOINTS.TABLET : false;
  const isLaptop = (size.width !== null) ? size.width >= BREAKPOINTS.TABLET && size.width < BREAKPOINTS.DESKTOP : false;
  const isDesktop = (size.width !== null) ? size.width >= BREAKPOINTS.DESKTOP : false;
  const isTouch = (size.width !== null) ? size.width < BREAKPOINTS.TABLET : false;

  return {
    isMobile,
    isTablet,
    isLaptop,
    isDesktop,
    isTouch,
    isReady,
    width: size.width,
    height: size.height
  };
}

// Hook simplificado para compatibilidade com código existente
export function useIsMobile() {
  const breakpoints = useBreakpoints();
  
  return {
    isMobile: breakpoints.width !== null && breakpoints.width < BREAKPOINTS.TABLET,
    isReady: breakpoints.isReady
  };
}
