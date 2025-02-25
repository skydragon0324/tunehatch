import { useEffect, useState, useRef } from "react";

export default function useOnScreen(ref: React.MutableRefObject<any>) {
  const [isOnScreen, setIsOnScreen] = useState(false);
  const observerRef = useRef<any>(ref);

  useEffect(() => {
    if (observerRef) {
      observerRef.current = new IntersectionObserver(([entry]) =>
        setIsOnScreen(entry.isIntersecting)
      );
    }
  }, []);

  useEffect(() => {
    if (observerRef && ref.current) {
      observerRef.current.observe(ref.current);
    }
    return () => {
      observerRef.current.disconnect();
    };
  }, [ref]);

  return isOnScreen;
}
