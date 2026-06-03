"use client";

import { useState, useEffect } from "react";
import { useLocale, useTranslations } from "next-intl";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

// Placeholder data - will be replaced with Sanity data
const slides = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1920&h=1080&fit=crop",
    titleFr: "Modernisation des Infrastructures Routières",
    titleEn: "Modernization of Road Infrastructure",
    descriptionFr:
      "Un engagement pour le développement durable et la connectivité nationale",
    descriptionEn:
      "A commitment to sustainable development and national connectivity",
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=1920&h=1080&fit=crop",
    titleFr: "Projets Hydroélectriques Majeurs",
    titleEn: "Major Hydroelectric Projects",
    descriptionFr: "Investir dans l'énergie propre pour l'avenir de la RDC",
    descriptionEn: "Investing in clean energy for the future of DRC",
  },
  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920&h=1080&fit=crop",
    titleFr: "Développement Urbain Durable",
    titleEn: "Sustainable Urban Development",
    descriptionFr: "Construire des villes modernes et inclusives",
    descriptionEn: "Building modern and inclusive cities",
  },
];

export function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const locale = useLocale();
  const t = useTranslations("home.hero");

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);

    return () => clearInterval(timer);
  }, []);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  return (
    <section className="relative h-screen w-full overflow-hidden bg-gray-900">
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={cn(
            "absolute inset-0 transition-opacity duration-1000",
            index === currentSlide ? "opacity-100" : "opacity-0",
          )}
        >
          {/* Background Image */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${slide.image})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30" />
          </div>

          {/* Content */}
          <div className="relative flex h-full items-center">
            <div className="container-wide">
              <div className="max-w-3xl">
                <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl mb-6 animate-slide-up">
                  {locale === "fr" ? slide.titleFr : slide.titleEn}
                </h1>
                <p className="text-xl text-gray-200 mb-8 animate-fade-in">
                  {locale === "fr" ? slide.descriptionFr : slide.descriptionEn}
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link
                    href={`/${locale}/projets`}
                    className="inline-flex items-center justify-center rounded-md bg-rdc-blue px-8 py-3 text-base font-medium text-white hover:bg-rdc-blue/90 transition-colors focus:outline-none focus:ring-2 focus:ring-rdc-blue focus:ring-offset-2"
                  >
                    {t("cta1")}
                  </Link>
                  <Link
                    href={`/${locale}/appels-offres`}
                    className="inline-flex items-center justify-center rounded-md border-2 border-white px-8 py-3 text-base font-medium text-white hover:bg-white hover:text-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2"
                  >
                    {t("cta2")}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button
        onClick={goToPrevious}
        className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white backdrop-blur-sm transition-all hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white backdrop-blur-sm transition-all hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white"
        aria-label="Next slide"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Indicators */}
      <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={cn(
              "h-2 rounded-full transition-all",
              index === currentSlide ? "w-8 bg-white" : "w-2 bg-white/50",
            )}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
