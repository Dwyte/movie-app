import { ErrorBoundary, FallbackProps } from "react-error-boundary";
import ErrorFallback from "./ErrorFallback";
import clsx from "clsx";

interface RouteErrorBoundaryProps {
  children: React.ReactNode;
  isModal?: boolean;
}

const RouteErrorBoundary = ({
  children,
  isModal = false,
}: RouteErrorBoundaryProps) => {
  return (
    <ErrorBoundary
      fallbackRender={(props: FallbackProps) => (
        <ErrorFallback
          className={clsx("h-[100vh]", isModal && "modal-backdrop z-50")}
          {...props}
          displayMessage
        />
      )}
    >
      {children}
    </ErrorBoundary>
  );
};

export default RouteErrorBoundary;
