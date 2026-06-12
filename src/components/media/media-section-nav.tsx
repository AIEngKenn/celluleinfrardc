"use client";

import { useEffect, useState } from "react";
import type { MediaSectionId } from "@/lib/media/types";

interface MediaSectionNavProps {
  locale: string;
  sections: Array<{ id: MediaSectionId; label: string; count?: number }>;
}

export function MediaSectionNav({ locale, sections }: MediaSectionNavProps) {
  const isFr = locale === "fr";
  const [activeSection, setActiveSection] = useState<MediaSectionId>(sections[0]?.id ?? "spotlight");

  useEffect(() => {
    const elements = sections
      .map((section) => document.getElementById(`media-section-${section.id}`))
      .filter((element): element is HTMLElement => Boolean(element));

    if (!elements.length) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target?.id) {
          const id = visible.target.id.replace("media-section-", "") as MediaSectionId;
          setActiveSection(id);
        }
      },
      { rootMargin: "-35% 0px -55% 0px", threshold: [0.1, 0.3, 0.6] }
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [sections]);

  const scrollToSection = (id: MediaSectionId) => {
    const element = document.getElementById(`media-section-${id}`);
    if (!element) {
      return;
    }
    const offset = 88;
    const top = element.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: "smooth" });
  };

  return (
    <nav
      className="ci-media-section-nav"
      aria-label={isFr ? "Sections de la médiathèque" : "Media center sections"}
    >
      <div className="ci-media-section-nav__inner">
        {sections.map((section) => {
          const isActive = activeSection === section.id;
          return (
            <button
              key={section.id}
              type="button"
              aria-current={isActive ? "true" : undefined}
              onClick={() => scrollToSection(section.id)}
              className={`ci-media-section-nav__btn ${isActive ? "ci-media-section-nav__btn--active" : ""}`}
            >
              {section.label}
              {typeof section.count === "number" ? (
                <span className="ci-media-section-nav__count">{section.count}</span>
              ) : null}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
