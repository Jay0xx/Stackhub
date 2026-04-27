import { useEffect, type RefObject } from "react";

/**
 * Focuses `inputRef` when the user presses "/" anywhere on the page,
 * provided they are NOT already typing inside an editable element.
 *
 * Mirrors the GitHub "/" shortcut behaviour:
 *  - Prevents "/" from being typed into the input on focus
 *  - Scrolls the input into view if it is off-screen
 *  - Selects all existing text so the user can immediately overwrite
 *  - Does nothing when a modifier key (Ctrl / Meta / Alt) is held
 */
export function useSearchFocus(inputRef: RefObject<HTMLInputElement | null>) {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      // Ignore modified keystrokes (browser/OS shortcuts)
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      if (e.key !== "/") return;

      // Don't steal focus from another editable element
      const target = e.target as HTMLElement;
      const tag = target.tagName;
      if (
        tag === "INPUT" ||
        tag === "TEXTAREA" ||
        tag === "SELECT" ||
        target.isContentEditable
      ) {
        return;
      }

      const input = inputRef.current;
      if (!input) return;

      // Prevent "/" being inserted into the input value
      e.preventDefault();

      // Scroll into view first so focus doesn't snap the viewport jarringly
      input.scrollIntoView({ behavior: "smooth", block: "center" });

      input.focus();
      // Select any existing text so the user can overwrite immediately
      input.select();
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [inputRef]);
}
