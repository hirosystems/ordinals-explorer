import { useEffect, useState } from "react";

export function useMount(fun: Function) {
  let didInit = false;
  useEffect(() => {
    if (!didInit) {
      didInit = true;
      fun();
    }
  }, []);
}

// Based on https://www.joshwcomeau.com/snippets/react-hooks/use-has-mounted/
export function useHasMounted() {
  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => {
    setHasMounted(true);
  }, []);
  return hasMounted;
}
