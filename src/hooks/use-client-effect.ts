
"use client"

import { useEffect, type EffectCallback, type DependencyList } from 'react';

/**
 * A custom hook that runs an effect only on the client-side.
 * This is useful for avoiding hydration errors when dealing with
 * browser-specific APIs like localStorage.
 * @param effect - The effect callback to run.
 * @param deps - The dependency array for the effect.
 */
const useClientEffect = (effect: EffectCallback, deps: DependencyList = []) => {
  useEffect(() => {
    // The effect will only run on the client side where `window` is defined.
    effect();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
};

export default useClientEffect;
