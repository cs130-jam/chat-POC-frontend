import { useCallback, useRef, useState } from "react";

const useStateRef = (initialState) => {
    const [state, setState] = useState(initialState);
    const ref = useRef(state);

    const modUseState = useCallback((obj) => {
        // react allows user to pass function or value directly to useState
        ref.current = typeof obj === "function" ? obj(ref.current) : obj;
        setState(ref.current);
    }, []);

    return [state, modUseState, ref];
  };

  export default useStateRef;