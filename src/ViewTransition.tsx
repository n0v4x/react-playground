import { createElement, ReactNode, RefObject, useCallback, useMemo, useRef } from "react";
import { SwitchTransition, Transition } from "react-transition-group";

interface ViewTransitionHandlerGeneralParams {
  viewElem: HTMLElement;
}

interface ViewEnterAndExitTransitionParams extends ViewTransitionHandlerGeneralParams {
  complete: () => void;
}

interface ViewExitTransitionHandlerParams extends ViewEnterAndExitTransitionParams {}
interface ViewEnterTransitionHandlerParams extends ViewEnterAndExitTransitionParams {
  isAppearing: boolean;
}

type ViewEnterTransitionHandler = (params: ViewEnterTransitionHandlerParams) => void;
type ViewExitTransitionHandler = (params: ViewExitTransitionHandlerParams) => void;

// type ViewEnterTransitionHandler = ()

interface ViewTransitionProps {
  /**
   * @default "div"
   */
  tag?: keyof JSX.IntrinsicElements;
  trigger: string | number | undefined;
  children: ReactNode;
  className?: string;
  viewRef: RefObject<HTMLElement>;

  /**
   * @default "out-in"
   */
  mode?: "out-in" | "in-out";
  onEnter?: ViewEnterTransitionHandler;
  onExit?: ViewExitTransitionHandler;
}

export enum ViewTransitionState {
  Enter = 1,
  Exit = -1,
}

const ViewTransition = ({
  tag = "div",
  trigger,
  mode = "out-in",
  className,

  onEnter,
  onExit,

  children,
}: ViewTransitionProps) => {
  const viewRef = useRef<HTMLElement>(null);
  const transitionStateRef = useRef<ViewTransitionState | null>(null);
  const isAppearingRef = useRef(false);

  const handlers = useMemo(
    () => ({
      [ViewTransitionState.Enter]: onEnter,
      [ViewTransitionState.Exit]: onExit,
    }),
    [onEnter, onExit]
  );

  const handleViewTransition = (complete: () => void) => {
    const viewElem = viewRef.current!;
    const transitionState = transitionStateRef.current!;

    const transitionHandler = handlers[transitionState];

    if (transitionHandler) {
      transitionHandler({
        viewElem,
        complete,
        isAppearing: isAppearingRef.current,
      });
    } else {
      complete();
    }
  };

  const handleEnterEvents = useCallback(
    (state: ViewTransitionState) => (isAppearing: boolean) => {
      isAppearingRef.current = isAppearing;
      transitionStateRef.current = state;
    },
    []
  );

  const handleExitEvents = useCallback(
    (state: ViewTransitionState) => () => {
      transitionStateRef.current = state;
    },
    []
  );

  return (
    <SwitchTransition mode={mode}>
      <Transition
        nodeRef={viewRef}
        appear={true}
        key={trigger}
        onEnter={handleEnterEvents(ViewTransitionState.Enter)}
        onExit={handleExitEvents(ViewTransitionState.Exit)}
        addEndListener={handleViewTransition}
      >
        {createElement(tag, { ref: viewRef, className }, children)}
      </Transition>
    </SwitchTransition>
  );
};

export default ViewTransition;
