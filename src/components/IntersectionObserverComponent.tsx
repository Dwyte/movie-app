import { useEffect, useRef } from "react";

const IntersectionObserverComponent = ({ onIntersect }: { onIntersect: () => void }) => {
  const observerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          onIntersect();
        }
      },
      { threshold: 1.0 }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [onIntersect]);

  return <div ref={observerRef} />;
};

export default IntersectionObserverComponent;
