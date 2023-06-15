import React, { useEffect, useState } from "react";
import styles from "@/styles/DropdownTransition.module.scss";

export interface IDropdownTransitionProps {
  children?: React.ReactNode;
  shouldRender: boolean;
  hideDropdown: () => void;
  forceClose: boolean;
  width?: number;
}

const DropdownTransition = React.forwardRef<
  HTMLDivElement,
  IDropdownTransitionProps
>(({ children, shouldRender, width, hideDropdown, forceClose }, ref) => {
  const [show, setShow] = useState<boolean>(false);
  const [opacity, setOpacity] = useState<number>(0);

  useEffect((): void | (() => void) => {
    if (shouldRender) {
      fadeIn();
    }
  }, [shouldRender]);

  useEffect((): void => {
    if (forceClose && shouldRender) fadeOut();
  }, [forceClose]);

  if (!shouldRender) {
    return null;
  }

  const fadeIn = (): void => {
    setShow(true);
    setOpacity(1);
  };

  const fadeOut = (): void => {
    setShow(false);
    setOpacity(0);
  };

  const onTransitionEnd = (): void => {
    if (!show) {
      hideDropdown();
    }
  };

  return (
    <div
      ref={ref}
      id={styles["DropdownTransition"]}
      style={{
        top: show ? 67 : 46,
        opacity,
        width: width ? width : "",
      }}
      onTransitionEnd={onTransitionEnd}
    >
      <div className={styles["arrow"]}></div>
      {children}
    </div>
  );
});

DropdownTransition.displayName = "DropdownTransition";
export default DropdownTransition;
