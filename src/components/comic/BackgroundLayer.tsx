"use client";

import { motion } from "framer-motion";
import { getSceneArt, DESIGN_TEMPLATE_SRC } from "@/lib/assets/scene-art";

interface BackgroundLayerProps {
  backgroundId: string;
}

const GRADIENT_FALLBACK =
  "linear-gradient(180deg, #0f172a 0%, #1e1b4b 40%, #0c1222 100%)";

export function BackgroundLayer({ backgroundId }: BackgroundLayerProps) {
  const art = getSceneArt(backgroundId);

  if (art?.illustrated) {
    return (
      <motion.div
        key={backgroundId}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="absolute inset-0 overflow-hidden rounded-2xl bg-slate-950"
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${DESIGN_TEMPLATE_SRC})`,
            backgroundSize: art.size,
            backgroundPosition: art.position,
            backgroundRepeat: "no-repeat",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-slate-950/10" />
      </motion.div>
    );
  }

  return (
    <motion.div
      key={backgroundId}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="absolute inset-0 overflow-hidden rounded-2xl"
      style={{ background: GRADIENT_FALLBACK }}
    />
  );
}
