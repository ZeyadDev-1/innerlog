import { useMemo, useState } from "react";

const SLIDES = [
  {
    title: "Welcome",
    description:
      "Welcome to InnerLog. This quick tour shows how to track your moods and reflections with confidence.",
  },
  {
    title: "Add mood",
    description:
      "Use the mood slider to save how you're feeling today, from very low to very good.",
  },
  {
    title: "Add emotions + journal",
    description:
      "Add a few emotions and a short journal note to capture what shaped your day.",
  },
  {
    title: "View entries",
    description:
      "Open Recent Entries to review your latest mood check-ins whenever you want.",
  },
  {
    title: "Edit / delete entries",
    description:
      "Expand an entry to update details later or remove it if you no longer need it.",
  },
  {
    title: "Charts",
    description:
      "Use the charts to spot patterns, trends, and changes in your mood over time.",
  },
  {
    title: "Privacy mode",
    description:
      "Turn on Privacy Mode to hide journal text while keeping the rest of your dashboard visible.",
  },
  {
    title: "Help access",
    description:
      "Need a refresher? Use the Help / How to use InnerLog button anytime to open this tour again.",
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
