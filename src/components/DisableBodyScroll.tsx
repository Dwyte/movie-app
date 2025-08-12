import { useEffect } from "react";

const DisableBodyScroll = () => {
  // Disable main body scrolling
  useEffect(() => {
    document.body.style.overflowY = "hidden";
    return () => {
      document.body.style.overflowY = "scroll";
    };
  }, []);

  return null;
};

export default DisableBodyScroll;
