import { useEffect, useRef } from "react";

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

export const useFocusTrap = () => {
  const previousActiveElement = useRef<Element | null>(null);
  const lastAction = useRef<InputModality>("mouse");

  const refContainer = useRef<HTMLElement | null>(null);
  const keyDownEventListener = useRef<(e: KeyboardEvent) => void | null>(null);
  const mouseDownEventListener = useRef<(e: MouseEvent) => void | null>(null);

  if (previousActiveElement.current === null) {
    // Store Previous Active Element before the component mounts.
    previousActiveElement.current = document.activeElement;
  }

  /**
   * Creates and Adds the EventListeners for FocusTrapping.
   * To be used on container's refCallback.
   * @param container
   * @param onEscape
   * @returns
   */
  const initializeFocusTrap = (
    container: HTMLElement,
    onEscape?: () => void
  ) => {
    /**
     * Passed as argument to addEventListener.
     * This makes sure tab navigation won't go beyond the container.
     * The browser still handles the tab navigation behavior. This only
     * interferes at the boundaries (first and last elements).
     * @param event
     * @returns
     */
    const handleKeyDown = (event: KeyboardEvent) => {
      // Track Last Input Modality
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

    const handleMouseDown = (event: MouseEvent) => {
      lastAction.current = "mouse";
    };

    try {
      container.addEventListener("keydown", handleKeyDown);
    } catch (error) {
      console.error(error);
    }
    container.addEventListener("mousedown", handleMouseDown);

    keyDownEventListener.current = handleKeyDown;
    mouseDownEventListener.current = handleMouseDown;
    refContainer.current = container;
  };

  useEffect(() => {
    const cleanUp = () => {
      if (refContainer.current instanceof HTMLElement) {
        if (keyDownEventListener.current) {
          refContainer.current.removeEventListener(
            "keydown",
            keyDownEventListener.current
          );
        }

        if (mouseDownEventListener.current) {
          refContainer.current.removeEventListener(
            "mousedown",
            mouseDownEventListener.current
          );
        }
      }

      // Restore focus to the previously focused element when the trap is removed and when the user used keyboard.
      if (
        previousActiveElement.current instanceof HTMLElement &&
        lastAction.current === "keyboard"
      ) {
        previousActiveElement.current.focus();
      }
    };

    return cleanUp;
  }, []);

  const focusFirstElement = (container: HTMLElement) => {
    const focusableElements = getFocusableElements(container);
    if (focusableElements.length > 0) {
      focusableElements[0].focus();
    }
  };

  return {
    focusFirstElement,
    initializeFocusTrap,
  };
};
