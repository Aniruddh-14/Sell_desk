import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

export default function ScrollReveal({ children, direction = "up", delay = 0 }) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-50px" });

    const yOffset = direction === "up" ? 40 : direction === "down" ? -40 : 0;
    const xOffset = direction === "left" ? 40 : direction === "right" ? -40 : 0;

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: yOffset, x: xOffset }}
            animate={isInView ? { opacity: 1, y: 0, x: 0 } : { opacity: 0, y: yOffset, x: xOffset }}
            transition={{ duration: 0.6, delay: delay, ease: [0.25, 0.4, 0.25, 1] }}
            style={{ width: "100%", height: "100%" }}
        >
            {children}
        </motion.div>
    );
}
