
interface Window {
  __APP_INITIALIZED__?: boolean;
  React?: typeof React & {
    forwardRef?: any;
    createElement?: any;
    Fragment?: any;
    createContext?: any;
    useState?: any;
    useEffect?: any;
    useRef?: any;
    memo?: any;
    Suspense?: any;
    lazy?: any;
    [key: string]: any;
  };
  process?: {
    env: {
      NODE_ENV: string;
      REACT_APP_VERSION?: string;
      PUBLIC_URL?: string;
    }
  };
}

// Add declaration for HTMLElement _reactRootContainer property used in React DOM
interface HTMLElement {
  _reactRootContainer?: any;
}
