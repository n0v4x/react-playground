// import React, { ReactElement, ReactNode, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSafeContext, createSafeConsumer, createSafeContext } from "./helpers";

// interface ContextValue {
//   previousView: {
//     state: 'enter' | 'exit' | 'entered' | 'exited';
//     onEnter: (element: HTMLElement, complete: () => void) => void;
//     onExit: (element: HTMLElement, complete: () => void) => void;
//   },
//   currentView: {
//     state: 'enter' | 'exit' | 'entered' | 'exited';
//     onEnter: (element: HTMLElement, complete: () => void) => void;
//     onExit: (element: HTMLElement, complete: () => void) => void;
//   }
// }

// const Context = createSafeContext<ContextValue>();

// export const useViewTransition = () => useSafeContext(Context);
// export const ViewTransitionConsumer = createSafeConsumer(Context);

// export const ViewTransitionProvider = ({ children }: { children: ReactNode }): ReactElement => {
//   const [ state, setState ] = useState<ContextValue['state']>('enter');

//   useEffect(() => {
//     setState("enter");
//   }, []);

//   const value: ContextValue = useMemo(
//     () => ({
//       state
//     }),
//     [state]
//   );-

//   return <Context.Provider value={value}>{children}</Context.Provider>;
// };

// const ViewTransitionSwitch =
