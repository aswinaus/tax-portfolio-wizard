
interface Window {
  __APP_INITIALIZED__?: boolean;
  React?: typeof React & {
    forwardRef: any; // Explicitly define as any to avoid type issues 
    createElement?: typeof React.createElement;
    Fragment?: typeof React.Fragment;
    createContext?: typeof React.createContext;
    useState?: typeof React.useState;
    useEffect?: typeof React.useEffect;
    useRef?: typeof React.useRef;
    memo?: typeof React.memo;
    Suspense?: typeof React.Suspense;
    lazy?: typeof React.lazy;
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
