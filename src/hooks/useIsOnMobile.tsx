import React from "react";

const mobileRegex = /Mobi|Android|iPhone|iPad|iPod/i;

const useIsOnMobile = () => {
  return mobileRegex.test(navigator.userAgent);
};

export default useIsOnMobile;
