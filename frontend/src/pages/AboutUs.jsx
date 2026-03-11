const coreValues = [
  {
    title: "Privacy First",
    icon: "🔒",
    description:
      "Your personal reflections belong to you. InnerLog is designed to keep journaling private, respectful, and intentionally minimal in what it collects.",
  },
  {
    title: "Trust Through Transparency",
    icon: "🤝",
    description:
      "We clearly communicate what InnerLog does and what it does not do. It supports reflection, not diagnosis, treatment, or medical decision-making.",
  },
  {
    title: "Ethical Design",
    icon: "⚖️",
    description:
      "Our experience is guided by calm interactions, thoughtful defaults, and meaningful features that support wellbeing without manipulation.",
  },
  {
    title: "Emotional Awareness",
    icon: "🧭",
    description:
      "By tracking mood over time, users can notice patterns, identify triggers, and better understand day-to-day emotional shifts.",
  },
  {
    title: "Simplicity",
    icon: "✨",
    description:
      "InnerLog stays focused on the essentials: quick check-ins, clear trends, and an interface that feels steady, warm, and easy to return to.",
  },
  {
    title: "User Control",
    icon: "🖐️",
    description:
      "You decide how and when to journal. InnerLog supports your pace, your routine, and your way of reflecting.",
  },
];

export default function AboutUs() {
  return (
    <section className="container about-page py-3 py-lg-4">
      <div className="about-hero card border-0 shadow-sm mb-4 mb-lg-5">
        <div className="card-body p-4 p-md-5">
          <p className="section-kicker mb-2">About InnerLog</p>
          <h1 className="about-title mb-3">A calm space for emotional reflection</h1>
          <p className="about-lead mb-0">
            InnerLog is a mood tracking and journaling application built to support self-reflection,
            emotional awareness, and personal insight. It helps people observe emotional patterns
            safely and privately over time through simple daily check-ins.
          </p>
        </div>
      </div>

      <div className="row g-4 align-items-stretch mb-4 mb-lg-5">
        <div className="col-12 col-lg-6 d-flex">
          <article className="about-section-card card border-0 shadow-sm w-100">
            <div className="card-body p-4">
              <h2 className="h5 mb-3">1. Introduction to InnerLog</h2>
              <p className="mb-3">
                InnerLog is designed for people who want a thoughtful way to pause, check in with
                themselves, and build a clearer picture of how they feel over time. It combines
                journaling with mood tracking so each entry can become part of a meaningful personal
                story.
              </p>
              <p className="mb-0 about-note">
                InnerLog is not a medical, therapeutic, or diagnostic platform.
              </p>
            </div>
          </article>
        </div>

        <div className="col-12 col-lg-6 d-flex">
          <article className="about-section-card card border-0 shadow-sm w-100">
            <div className="card-body p-4">
              <h2 className="h5 mb-3">2. Mission</h2>
              <p className="mb-0">
                Our mission is to make reflective journaling more approachable and consistent by
                offering a warm, premium digital experience that respects user boundaries. We aim
                to help people become more emotionally aware through daily habits that feel safe,
                private, and sustainable.
              </p>
            </div>
          </article>
        </div>
      </div>

      <article className="about-values card border-0 shadow-sm">
        <div className="card-body p-4 p-lg-5">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end gap-2 mb-4">
            <div>
              <p className="section-kicker mb-2">3. Core values</p>
              <h2 className="h4 mb-0">Principles that guide every InnerLog decision</h2>
            </div>
          </div>

          <div className="row g-3 g-lg-4">
            {coreValues.map((value) => (
              <div className="col-12 col-md-6 col-xl-4" key={value.title}>
                <div className="value-card h-100">
                  <div className="value-icon" aria-hidden="true">
                    {value.icon}
                  </div>
                  <h3 className="h6 mb-2">{value.title}</h3>
                  <p className="mb-0">{value.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </article>
    </section>
  );
}
