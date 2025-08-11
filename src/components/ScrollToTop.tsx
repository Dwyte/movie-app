import React, { useEffect } from "react";
import { useLocation, useMatch } from "react-router-dom";

const ScrollToTop = () => {
  const location = useLocation();

  const tvPageMatch = useMatch("/tv/:id");
  const moviePageMatch = useMatch("/movie/:id");

  useEffect(() => {
    if (tvPageMatch || moviePageMatch) return;

    window.scrollTo({ left: 0, top: 0 });
  }, [location.pathname]);
  return null;
};

export default ScrollToTop;
