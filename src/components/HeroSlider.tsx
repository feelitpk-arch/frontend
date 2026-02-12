"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const slides = [
  {
    id: 1,
    title: "City Stories in Every Drop",
    subtitle:
      "Layered, long-lasting fragrances inspired by late-night drives, seaside air, and hidden rooftops.",
    cta: "Shop Now",
    image: "/images/hero/hero-placeholder.jpg",
  },
  {
    id: 2,
    title: "Weekday Easy, Weekend Bold",
    subtitle:
      "From soft musks to textured ouds, build a wardrobe of scents that move with you.",
    cta: "Explore Collections",
    image: "/images/hero/hero-placeholder.jpg",
  },
  {
    id: 3,
    title: "Discovery Before Commitment",
    subtitle:
      "Try our explorer kits and testers before choosing your full-size signature.",
    cta: "Browse Explorer Kits",
    image: "/images/hero/hero-placeholder.jpg",
  },
];

export function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(timer);
  }, []);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const currentSlideData = slides[currentSlide];

  return (
    <section className="relative mb-10 mt-4 overflow-hidden rounded-2xl bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900">
      <div className="relative grid gap-4 p-6 md:grid-cols-[1.2fr,1fr] md:gap-6 md:p-8 lg:p-10">
        {/* Content */}
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          className="flex flex-col justify-center gap-4 text-white md:gap-5"
        >
          <div className="space-y-3 md:space-y-4">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-xs font-semibold uppercase tracking-[0.24em] text-neutral-300"
            >
              FEEL IT
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
              className="font-serif text-2xl leading-tight tracking-wide text-white sm:text-3xl md:text-4xl lg:text-5xl"
            >
              {currentSlideData.title}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
              className="max-w-xl text-sm leading-relaxed text-neutral-300 sm:text-base"
            >
              {currentSlideData.subtitle}
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
            className="flex flex-wrap gap-3 pt-1"
          >
            <Link
              href="#best-sellers"
              className="inline-flex items-center rounded-full bg-white px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.18em] text-black transition-all hover:bg-neutral-100 hover:scale-105 active:scale-95 md:px-6 md:py-3"
            >
              {currentSlideData.cta}
            </Link>
            <span className="inline-flex items-center rounded-full border border-white/30 bg-white/10 px-4 py-2.5 text-xs font-medium uppercase tracking-[0.18em] text-white backdrop-blur-sm md:px-5 md:py-3">
              Free shipping over Rs.3999
            </span>
          </motion.div>
        </motion.div>

        {/* Image */}
        <div className="relative hidden h-[500px] overflow-hidden rounded-2xl md:block">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
              className="absolute inset-0"
            >
              <Image
                src={currentSlideData.image}
                alt={currentSlideData.title}
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 480px, 50vw"
                priority
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-neutral-900/60 via-transparent to-transparent" />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-2 md:bottom-8">
        {slides.map((_, index) => (
          <button
            key={index}
            type="button"
            onClick={() => goToSlide(index)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? "w-8 bg-white"
                : "w-1.5 bg-white/40 hover:bg-white/60"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
