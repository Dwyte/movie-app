import clsx from "clsx";
import { FallbackProps } from "react-error-boundary";
import Skeleton from "../Skeleton";

type Props = (FallbackProps & React.ComponentPropsWithoutRef<"div">) & {
  displayMessage?: boolean;
};

function ErrorFallback({
  error,
  resetErrorBoundary,
  className,
  displayMessage = false,
  ...rest
}: Props) {
  console.error(error.stack);

  if (displayMessage) {
    return (
      <div
        className={clsx(
          className,
          "flex flex-col gap-2 items-center justify-center"
        )}
        {...rest}
      >
        <p className="text-xl font-bold">Something went wrong.</p>
        <pre>{error.message}</pre>
        <button
          className="btn"
          data-variant="primary"
          onClick={resetErrorBoundary}
        >
          Reset
        </button>
      </div>
    );
  }

  return null;
}

export default ErrorFallback;
