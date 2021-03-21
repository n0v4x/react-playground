import React, { ReactElement, ReactNode, useCallback, useMemo, useRef, useState } from "react";
import { useSafeContext, createSafeConsumer, createSafeContext } from "./helpers";

interface ContextValue {
  locked: boolean;
  scrollbarWidth: number;
  lockScroll: () => void;
  unlockScroll: () => void;
  toggleLockScroll: (locked: boolean) => void;
}

const lockBodyScrollbar = () => {
  document.body.style.overflow = "hidden";
};

const unlockBodyScrollbar = () => {
  document.body.style.overflow = "";
};

const getBodyScrollbarWidth = () => {
  return window.innerWidth - document.documentElement.clientWidth;
};

const Context = createSafeContext<ContextValue>();

export const useBodyScrollLocker = () => useSafeContext(Context);
export const BodyScrollLockerConsumer = createSafeConsumer(Context);

export const BodyScrollLockerProvider = ({ children }: { children: ReactNode }): ReactElement => {
  const [locked, _setLocked] = useState<ContextValue["locked"]>(false);
  const [scrollbarWidth, _setScrollbarWidth] = useState<ContextValue["scrollbarWidth"]>(0);

  const lockedRef = useRef(locked);
  const scrollbarWidthRef = useRef(scrollbarWidth);

  const setLocked = useCallback((locked) => {
    _setLocked((lockedRef.current = locked));
  }, []);

  const setScrollbarWidth = useCallback((scrollbarWidth) => {
    _setScrollbarWidth((scrollbarWidthRef.current = scrollbarWidth));
  }, []);

  const lockScroll = useCallback(() => {
    if (lockedRef.current) return;

    setScrollbarWidth(getBodyScrollbarWidth());

    lockBodyScrollbar();

    setLocked(true);
  }, [setLocked, setScrollbarWidth]);

  const unlockScroll = useCallback(() => {
    if (!lockedRef.current) return;

    setScrollbarWidth(getBodyScrollbarWidth());

    unlockBodyScrollbar();

    setLocked(false);
  }, [setLocked, setScrollbarWidth]);

  const toggleLockScroll = useCallback(
    (locked: boolean | undefined) => {
      if (typeof locked === "undefined") {
        locked = lockedRef.current;
      }

      if (locked) {
        unlockScroll();
      } else {
        lockScroll();
      }
    },
    [lockScroll, unlockScroll]
  );

  const value: ContextValue = useMemo(
    () => ({
      locked,
      scrollbarWidth,
      lockScroll,
      unlockScroll,
      toggleLockScroll,
    }),
    [locked, scrollbarWidth, lockScroll, unlockScroll, toggleLockScroll]
  );

  return <Context.Provider value={value}>{children}</Context.Provider>;
};
