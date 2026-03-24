import { useMemo, useState } from "react";

const SLIDES = [
  {
    title: "Welcome",
    description:
      "Welcome to InnerLog. This quick tour shows how to track your moods and reflections with confidence.",
    image: "/onboarding/welcome-dashboard.svg",
    imageAlt: "InnerLog dashboard showing mood form, recent entries, and charts.",
  },
  {
    title: "Add mood",
    description:
      "Use the mood slider to save how you're feeling today, from very low to very good.",
    image: "/onboarding/add-mood.svg",
    imageAlt: "Mood form with the mood slider and save reflection button.",
  },
  {
    title: "Add emotions + journal",
    description:
      "Add a few emotions and a short journal note to capture what shaped your day.",
    image: "/onboarding/add-emotions-journal.svg",
    imageAlt: "Emotions and journal note fields in the daily check-in form.",
  },
  {
    title: "View entries",
    description:
      "Open Recent Entries to review your latest mood check-ins whenever you want.",
    image: "/onboarding/view-entries.svg",
    imageAlt: "Recent Entries panel on the dashboard.",
  },
  {
    title: "Edit / delete entries",
    description:
      "Expand an entry to update details later or remove it if you no longer need it.",
    image: "/onboarding/edit-delete.svg",
    imageAlt: "Expanded entry area showing edit and delete actions.",
  },
  {
    title: "Charts",
    description:
      "Use the charts to spot patterns, trends, and changes in your mood over time.",
    image: "/onboarding/charts.svg",
    imageAlt: "Mood trend, weekly average, and distribution charts.",
  },
  {
    title: "Privacy mode",
    description:
      "Turn on Privacy Mode to hide journal text while keeping the rest of your dashboard visible.",
    image: "/onboarding/privacy-mode.svg",
    imageAlt: "Privacy mode toggle in the dashboard header.",
  },
  {
    title: "Help access",
    description:
      "Need a refresher? Use the Help / How to use InnerLog button anytime to open this tour again.",
    image: "/onboarding/help-access.svg",
    imageAlt: "Navigation bar with Help / How to use InnerLog button.",
  },
];

export default function OnboardingTutorial({ onSkip, onFinish }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slide = useMemo(() => SLIDES[currentSlide], [currentSlide]);
  const isLastSlide = currentSlide === SLIDES.length - 1;

  return (
    <div className="onboarding-overlay" role="presentation">
      <div
        className="onboarding-modal dashboard-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="onboarding-title"
        aria-describedby="onboarding-description"
      >
        <div className="d-flex justify-content-between align-items-start gap-3 mb-3">
          <div>
            <p className="section-kicker mb-1">Getting started</p>
            <h2 id="onboarding-title" className="onboarding-title mb-0">
              {slide.title}
            </h2>
          </div>

          <span className="onboarding-counter" aria-label={`Slide ${currentSlide + 1} of ${SLIDES.length}`}>
            {currentSlide + 1}/{SLIDES.length}
          </span>
        </div>

        <div key={currentSlide} className="onboarding-slide">
          <figure className="onboarding-media mb-3">
            <img
              src={slide.image}
              alt={slide.imageAlt}
              className="onboarding-image"
              loading="eager"
            />
          </figure>
          <p id="onboarding-description" className="onboarding-description mb-0">
            {slide.description}
          </p>
        </div>

        <div className="onboarding-progress" aria-hidden="true">
          {SLIDES.map((item, index) => (
            <span
              key={item.title}
              className={`onboarding-progress-dot ${index === currentSlide ? "active" : ""}`}
            />
          ))}
        </div>

        <div className="d-flex flex-column flex-sm-row justify-content-between gap-2 mt-4">
          <button type="button" className="btn btn-outline-secondary" onClick={onSkip}>
            Skip
          </button>

          <div className="d-flex gap-2 justify-content-end">
            {!isLastSlide ? (
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => setCurrentSlide((previous) => previous + 1)}
              >
                Next
              </button>
            ) : (
              <button type="button" className="btn btn-primary" onClick={onFinish}>
                Finish
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
