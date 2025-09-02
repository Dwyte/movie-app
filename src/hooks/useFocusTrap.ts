import { useEffect, useRef } from "react";

interface UseFocusTrapOptions {
  enabled?: boolean;
  onEscape?: () => void;
}

const FOCUSABLE_SELECTORS = [
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "a[href]",
  "area[href]",
  "iframe",
  "object",
  "embed",
  '[tabindex]:not([tabindex="-1"])',
  '[contenteditable="true"]',
].join(", ");

const getFocusableElements = (container: HTMLElement): HTMLElement[] => {
  return Array.from(
    container.querySelectorAll(FOCUSABLE_SELECTORS)
  ) as HTMLElement[];
};

type InputModality = "keyboard" | "mouse";

export const useFocusTrap = (
  containerRef: React.RefObject<HTMLElement>,
  options: UseFocusTrapOptions = {}
) => {
  const { enabled = true, onEscape } = options;
  const previousActiveElement = useRef<Element | null>(null);
  const lastAction = useRef<InputModality>("mouse");

  useEffect(() => {
    if (!enabled || !containerRef.current) return;

    const container = containerRef.current;

    // Store the currently focused element before trapping focus
    previousActiveElement.current = document.activeElement;

    /**
     * Passed as argument to addEventListener.
     * This makes sure tab navigation won't go beyond the container.
     * The browser still handles the tab navigation behavior. This only
     * interferes at the boundaries (first and last elements).
     * @param event
     * @returns
     */
    const handleKeyDown = (event: KeyboardEvent) => {
      lastAction.current = "keyboard";

      if (event.key === "Tab") {
        const focusableElements = getFocusableElements(container);

        if (focusableElements.length === 0) return;

        const lastElement = focusableElements[focusableElements.length - 1];
        const firstElement = focusableElements[0];

        if (event.shiftKey) {
          if (document.activeElement === firstElement) {
            event.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            event.preventDefault();
            firstElement.focus();
          }
        } // Otherwise Tab behaves as usual
      } else if (event.key === "Escape" && onEscape) {
        onEscape();
      }
    };

    const handleMouseClick = (event: MouseEvent) => {
      lastAction.current = "mouse";
    };

    container.addEventListener("keydown", handleKeyDown);
    container.addEventListener("mousedown", handleMouseClick);

    return () => {
      container.removeEventListener("keydown", handleKeyDown);
      container.removeEventListener("mousedown", handleMouseClick);

      // Restore focus to the previously focused element when the trap is removed and when the user used keyboard.
      if (
        previousActiveElement.current instanceof HTMLElement &&
        lastAction.current === "keyboard"
      ) {
        previousActiveElement.current.focus();
      }
    };
  }, [enabled, onEscape]);

  const focusFirstElement = () => {
    if (containerRef.current) {
      const focusableElements = getFocusableElements(containerRef.current);

      if (focusableElements.length > 0) {
        focusableElements[0].focus();
        console.log("focus first");
      }
    }
  };

  return {
    // Method to manually focus the first focusable element
    focusFirstElement,
  };
};
