"use client";

import { createContext, useContext, useState, useCallback } from "react";

interface CartCountContextValue {
  count: number;
  setCount: (n: number) => void;
}

const CartCountContext = createContext<CartCountContextValue>({
  count: 0,
  setCount: () => {},
});

export function CartCountProvider({ children }: { children: React.ReactNode }) {
  const [count, setCount] = useState(0);
  const set = useCallback((n: number) => setCount(n), []);
  return (
    <CartCountContext.Provider value={{ count, setCount: set }}>
      {children}
    </CartCountContext.Provider>
  );
}

export function useCartCount(): number {
  return useContext(CartCountContext).count;
}

export function useSetCartCount(): (n: number) => void {
  return useContext(CartCountContext).setCount;
}
