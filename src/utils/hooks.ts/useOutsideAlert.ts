import { useEffect, RefObject } from "react";

/**
 * Hook that alerts clicks outside of the passed ref
 */
export function useOutsideAlert(
  ref: RefObject<any>,
  onClickOutside: () => void
) {
  useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    function handleClickOutside(event: any) {
      console.log(ref.current);
      if (ref.current && !ref.current.contains(event.target)) {
        onClickOutside();
      }
    }
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);
}
