'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import { ReactNode, useRef } from 'react';

interface ParallaxImageProps {
    src: string;
    alt: string;
    className?: string;
    overlayOpacity?: number;
    children?: ReactNode;
}

export function ParallaxImage({
    src,
    alt,
    className = '',
    overlayOpacity = 0.4,
    children
}: ParallaxImageProps) {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({ target: ref });
    const y = useTransform(scrollYProgress, [0, 1], [0, 300]);

    return (
        <section ref={ref} className={`relative w-full overflow-hidden ${className}`}>
            <motion.div
                className="absolute inset-0"
                style={{ y }}
            >
                <div className={`absolute inset-0 bg-black/${overlayOpacity * 100} z-10`} />
                <Image
                    src={src}
                    alt={alt}
                    fill
                    priority
                    className="object-cover object-center"
                />
            </motion.div>
            {children}
        </section>
    );
} 