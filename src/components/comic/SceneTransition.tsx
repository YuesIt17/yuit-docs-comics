"use client";

import { AnimatePresence, motion } from "framer-motion";

interface SceneTransitionProps {
  sceneKey: string;
  children: React.ReactNode;
}

export function SceneTransition({ sceneKey, children }: SceneTransitionProps) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={sceneKey}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
        className="relative w-full h-full"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
