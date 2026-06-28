import React, { createContext, useContext, useState, useCallback } from 'react';

interface DrawerContextType {
  open: () => void;
  close: () => void;
  toggle: () => void;
  isOpen: boolean;
}

const DrawerContext = createContext<DrawerContextType | null>(null);

export const useDrawer = () => {
  const ctx = useContext(DrawerContext);
  if (!ctx) throw new Error('useDrawer must be used inside provider');
  return ctx;
};

export const DrawerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen(prev => !prev), []);

  return (
    <DrawerContext.Provider value={{ open, close, toggle, isOpen }}>
      {children}
    </DrawerContext.Provider>
  );
};