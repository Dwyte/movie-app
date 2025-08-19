import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

interface MediaQueriesContextValue {
  isSmUp: boolean;
}

const MediaQueriesContext = createContext<MediaQueriesContextValue | undefined>(
  undefined
);

export const MediaQueriesContextProvider= ({
  children,
}: {
  children: ReactNode;
}) => {
  const [isSmUp, setIsSmUp] = useState(() => window.innerWidth >= 640);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 640px)");

    const handleChange = (event: MediaQueryListEvent) =>
      setIsSmUp(event.matches);
    mediaQuery.addEventListener("change", handleChange);

    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return (
    <MediaQueriesContext.Provider value={{ isSmUp }}>
      {children}
    </MediaQueriesContext.Provider>
  );
};

export const useMediaQueries = () => {
  const ctx = useContext(MediaQueriesContext);
  if (!ctx) throw Error("Must use inside MediaQueriesContextProvider");
  return ctx;
};
