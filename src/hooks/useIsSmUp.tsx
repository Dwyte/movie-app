import { useEffect, useState } from "react";

const useIsSmUp = () => {
  const [isSmUp, setIsSmUp] = useState(() => window.innerWidth >= 640);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 640px)");

    const handleChange = (event: MediaQueryListEvent) =>
      setIsSmUp(event.matches);
    mediaQuery.addEventListener("change", handleChange);

    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return isSmUp;
};

export default useIsSmUp;
