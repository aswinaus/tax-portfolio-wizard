
interface Window {
  __APP_INITIALIZED__?: boolean;
  React?: any;
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
