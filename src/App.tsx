// import "./App.css";
// import { matchPath, Route, Switch } from "react-router";
// import { SwitchTransition, Transition } from "react-transition-group";
// import { NavLink, BrowserRouter as Router } from "react-router-dom";
// import { createElement, useRef } from "react";
// import ViewTransition from "./ViewTransition";
// import gsap from "gsap";
// import he from "he";
// import Text, { AnotherText } from "./Components/Text";

// const Html = ({ children }: { children: string }) => {
//   console.log(
//     createElement("div", {
//       dangerouslySetInnerHTML: {
//         __html: children,
//       },
//     })
//   );
//   return createElement("div", {
//     dangerouslySetInnerHTML: {
//       __html: children,
//     },
//   });
// };

// const ViewHome = () => {
//   const str = "<h1>test</h1>";
//   return (
//     <div className="home">
//       <h1 className="title">
//         <Html>str</Html>
//       </h1>
//     </div>
//   );
// };

// const ViewAbout = () => {
//   const text =
//     "Соответствие TP&nbsp;TC&nbsp;004/2011 &laquo;О&nbsp;\nбезопасности низковольтного оборудования&raquo;;";
//   return (
//     <div className="about">
//       <h1 className="title">
//         <Text data="test" />
//         <AnotherText data="hello" />
//       </h1>
//     </div>
//   );
// };

// const ViewNotFound = () => {
//   return <div className="not-found">Not found</div>;
// };

// const routes = [
//   {
//     path: "/",
//     component: ViewHome,
//     exact: true,
//     nav: {
//       label: "Home",
//     },
//   },
//   {
//     path: "/about",
//     component: ViewAbout,
//     exact: true,
//     nav: {
//       label: "About",
//     },
//   },
//   {
//     path: "/not-found",
//     component: ViewNotFound,
//   },
// ];

// const App = () => {
//   const viewRef = useRef<HTMLElement>(null);

//   return (
//     <Router>
//       <div className="app">
//         <nav>
//           {routes.map(
//             (route) =>
//               route.nav && (
//                 <NavLink key={route.path} exact={route.exact} to={route.path}>
//                   {route.nav.label}
//                 </NavLink>
//               )
//           )}
//         </nav>

//         <Route
//           render={({ location }) => {
//             const route = routes.find((route) => matchPath(location.pathname, route));

//             return (
//               <ViewTransition
//                 className="view"
//                 mode="out-in"
//                 viewRef={viewRef}
//                 trigger={route?.path}
//                 onEnter={({ isAppearing, viewElem, complete }) => {
//                   const titleElem = viewElem.querySelector(".title");
//                   gsap.fromTo(
//                     titleElem,
//                     {
//                       x: -100,
//                       opacity: 0,
//                     },
//                     {
//                       x: 0,
//                       opacity: 1,
//                       duration: 1,
//                       onComplete: complete,
//                     }
//                   );
//                 }}
//                 onExit={({ complete, viewElem }) => {
//                   const titleElem = viewElem.querySelector(".title");

//                   gsap.fromTo(
//                     titleElem,
//                     {
//                       x: 0,
//                       opacity: 1,
//                     },
//                     {
//                       x: 100,
//                       opacity: 0,
//                       duration: 1,
//                       onComplete: complete,
//                     }
//                   );
//                 }}
//               >
//                 <Switch location={location}>
//                   {routes.map((route, i) => (
//                     <Route
//                       key={i}
//                       path={route.path}
//                       component={route.component}
//                       exact={route.exact}
//                     />
//                   ))}
//                   <Route component={ViewNotFound} />
//                 </Switch>
//               </ViewTransition>
//             );
//           }}
//         />
//       </div>
//     </Router>
//   );
// };

// export default App;

import "./App.css";
import { matchPath, Route, RouteProps, Switch, useLocation } from "react-router";
import { SwitchTransition, Transition } from "react-transition-group";
import { NavLink, BrowserRouter as Router } from "react-router-dom";
import {
  Component,
  createElement,
  forwardRef,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  memo,
  useRef,
  useState,
  useLayoutEffect,
} from "react";
import ViewTransition from "./ViewTransition";
import gsap from "gsap";
import he from "he";
import Text, { AnotherText } from "./Components/Text";
import { Location } from "history";

const Html = ({ children }: { children: string }) => {
  // console.log(
  //   createElement("div", {
  //     dangerouslySetInnerHTML: {
  //       __html: children,
  //     },
  //   })
  // );
  return createElement("div", {
    dangerouslySetInnerHTML: {
      __html: children,
    },
  });
};

// const ViewHome = () => {
//   const str = "<h1>test</h1>";
//   return (
//     <div className="home">
//       <h1 className="title">
//         <Html>str</Html>
//       </h1>
//     </div>
//   );
// };

// const ViewAbout = () => {
//   const text =
//     "Соответствие TP&nbsp;TC&nbsp;004/2011 &laquo;О&nbsp;\nбезопасности низковольтного оборудования&raquo;;";
//   return (
//     <div className="about">
//       <h1 className="title">
//         <Text data="test" />
//         <AnotherText data="hello" />
//       </h1>
//     </div>
//   );
// };

const ViewNotFound = () => {
  return <div className="not-found">Not found</div>;
};

interface ViewTransitionProps {
  next: () => void;
  status: string | null;
  prevLocation: Location | null;
  currentLocation: Location | null;
  nextLocation: Location | null;
}

interface ViewProps extends ViewTransitionProps {
  component: (props: ViewTransitionProps) => JSX.Element;
}

const View = memo(({ component: Component, ...otherProps }: ViewProps) => {
  return <Component {...otherProps} />;
});

interface ViewContactsProps extends ViewTransitionProps {}

const ViewContacts = ({
  next,
  status,
  prevLocation,
  currentLocation,
  nextLocation,
}: ViewContactsProps) => {
  const viewRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const viewElem = viewRef.current!;

    console.log(
      "contacts",
      status,
      prevLocation?.pathname,
      currentLocation?.pathname,
      nextLocation?.pathname
    );

    if (status === "enter") {
      gsap.fromTo(
        viewElem,
        {
          xPercent: -100,
          opacity: 0,
        },
        {
          xPercent: 0,
          opacity: 1,
          duration: 1,
          onComplete: next,
        }
      );
      // next();
    } else if (status === "exit") {
      // next();
      gsap.fromTo(
        viewElem,
        {
          xPercent: 0,
          opacity: 1,
        },
        {
          xPercent: 100,
          opacity: 0,
          duration: 1,
          onComplete: next,
        }
      );
    }
  }, [status]);

  return (
    <div ref={viewRef} style={{ backgroundColor: "blueviolet" }}>
      contacts
    </div>
  );
};

interface ViewHomeProps extends ViewTransitionProps {}

const ViewHome = ({ next, status, prevLocation, currentLocation, nextLocation }: ViewHomeProps) => {
  const viewRef = useRef<HTMLDivElement>(null);

  console.log(
    "home",
    status,
    prevLocation?.pathname,
    currentLocation?.pathname,
    nextLocation?.pathname
  );

  useLayoutEffect(() => {
    const viewElem = viewRef.current!;

    if (status === "enter") {
      gsap.set(viewElem, {
        xPercent: -100,
        opacity: 0,
        onComplete() {
          gsap.to(viewElem, {
            xPercent: 0,
            opacity: 1,
            duration: 1,
            onComplete: next,
          });
        },
      });
      // next();
    } else if (status === "exit") {
      gsap.set(viewElem, {
        xPercent: 0,
        opacity: 1,
        onComplete() {
          gsap.to(viewElem, {
            xPercent: 100,
            opacity: 0,
            duration: 1,
            onComplete: next,
          });
        },
      });
      // next();
      // gsap.fromTo(
      //   viewElem,
      //   {
      //     xPercent: 0,
      //     opacity: 1,
      //   },
      //   {
      //     xPercent: 100,
      //     opacity: 0,
      //     duration: 1,
      //     onComplete: next,
      //   }
      // );
    }
  }, [status, next]);

  return (
    <div ref={viewRef} style={{ backgroundColor: "greenyellow" }}>
      Home
    </div>
  );
};

// interface TransitionRouteProps extends ViewProps, RouteProps {
//   component:
//     | ((props: ViewProps) => JSX.Element)
//     | React.MemoExoticComponent<
//         ({
//           next,
//           status,
//           prevLocation,
//           currentLocation,
//           nextLocation,
//         }: ViewHomeProps) => JSX.Element
//       >;
// }

// const TransitionRoute = ({
//   next,
//   status,
//   prevLocation,
//   currentLocation,
//   nextLocation,
//   component: Component,
//   ...other
// }: TransitionRouteProps) => {
//   return (
//     <Route
//       key={routeOtherProps.path}
//       {...routeOtherProps}
//       render={() => <View component={component} next={next} {...state} />}
//     />
//   );
// };

const routes = [
  // {
  //   path: "/",
  //   component: ViewHome,
  //   exact: true,
  //   nav: {
  //     label: "Home",
  //   },
  // },
  // {
  //   path: "/about",
  //   component: ViewAbout,
  //   exact: true,
  //   nav: {
  //     label: "About",
  //   },
  // },
  // {
  //   path: "/not-found",
  //   component: ViewNotFound,
  // },
  {
    path: "/contacts",
    component: ViewContacts,
    exact: true,
    nav: {
      label: "Contacts",
    },
  },
  {
    path: "/",
    component: ViewHome,
    exact: true,
    nav: {
      label: "Home",
    },
  },
];

const App = () => {
  const viewRef = useRef<HTMLElement>(null);
  const location = useLocation();

  const [state, setState] = useState<{
    status: "enter" | "entered" | "exit" | null;
    prevLocation: Location | null;
    currentLocation: Location | null;
    nextLocation: Location | null;
  }>({
    status: null,
    prevLocation: null,
    currentLocation: null,
    nextLocation: null,
  });
  // const currentRoute =

  useEffect(() => {
    if (
      state.currentLocation === null ||
      (state.currentLocation !== null && state.currentLocation.pathname !== location.pathname)
    ) {
      if (state.status === null) {
        setState({
          ...state,
          status: "enter",
          currentLocation: location,
        });
      } else if (state.status === "entered") {
        setState({
          ...state,
          status: "exit",
          prevLocation: null,
          nextLocation: location,
        });
      }
    }
  }, [location, state]);

  const next = useCallback(() => {
    if (state.status === "enter") {
      setState({
        ...state,
        status: "entered",
      });
    } else if (state.status === "exit") {
      setState({
        prevLocation: state.currentLocation,
        currentLocation: state.nextLocation,
        nextLocation: null,
        status: "enter",
      });
    }
  }, [state]);

  return (
    <div className="app" style={{ overflow: "hidden" }}>
      <nav>
        {routes.map(
          (route) =>
            route.nav && (
              <NavLink key={route.path} exact={route.exact} to={route.path}>
                {route.nav.label}
              </NavLink>
            )
        )}
      </nav>

      {state.currentLocation && (
        <Switch location={state.currentLocation}>
          {routes.map(({ component, ...routeOtherProps }, i) => (
            <Route
              key={routeOtherProps.path}
              {...routeOtherProps}
              render={() => <View component={component} next={next} {...state} />}
            />
          ))}
          <Route component={ViewNotFound} />
        </Switch>
      )}
    </div>
  );
};

export default App;
