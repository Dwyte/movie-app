import React, { useEffect, useRef } from "react";

type Props = React.ComponentProps<"img"> & {
  onUnmount?: () => void;
  onLoad: () => void;
};

const Img = ({ onUnmount, onLoad, ...props }: Props) => {
  const ref = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (ref && ref.current?.complete) {
      onLoad();
    }

    return onUnmount;
  }, []);

  return <img {...props} onLoad={onLoad} ref={ref} />;
};

export default Img;
