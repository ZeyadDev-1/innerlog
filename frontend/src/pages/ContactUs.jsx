const contactMethods = [
  {
    name: "WhatsApp",
    href: "https://wa.me/905365037943",
    label: "Chat on WhatsApp",
    description:
      "For quick questions, onboarding support, or thoughtful feedback, send us a message and we will get back to you as soon as possible.",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M12.04 2C6.58 2 2.16 6.42 2.16 11.88c0 1.75.46 3.46 1.33 4.96L2 22l5.3-1.43a9.82 9.82 0 0 0 4.74 1.21h.01c5.46 0 9.88-4.42 9.88-9.88S17.5 2 12.04 2Zm5.76 13.99c-.24.68-1.39 1.29-1.92 1.38-.49.08-1.11.11-1.79-.1-.41-.13-.93-.3-1.6-.6-2.82-1.21-4.66-4.04-4.8-4.23-.14-.19-1.15-1.53-1.15-2.92s.72-2.08.97-2.37c.25-.29.55-.36.73-.36h.53c.17 0 .41-.06.64.49.24.58.8 2 .88 2.16.07.16.11.34.02.53-.08.19-.13.31-.26.48-.13.16-.27.36-.39.49-.13.13-.26.28-.11.55.15.27.67 1.11 1.43 1.8.98.88 1.81 1.15 2.07 1.28.26.13.42.11.58-.06.17-.19.69-.8.88-1.08.19-.28.37-.23.63-.14.25.09 1.6.75 1.88.89.28.14.47.2.54.31.07.11.07.63-.17 1.31Z" />
      </svg>
    ),
  },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/in/zeyad-abouelkassem-b28979369/",
    label: "Connect on LinkedIn",
    description:
      "If you would like to discuss partnerships, product ideas, or professional collaboration, you are welcome to connect with us on LinkedIn.",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M4.98 3.5C4.98 4.88 3.86 6 2.49 6S0 4.88 0 3.5 1.12 1 2.49 1s2.49 1.12 2.49 2.5ZM.27 8.04h4.44V23H.27V8.04Zm7.17 0h4.25v2.05h.06c.59-1.12 2.03-2.29 4.18-2.29 4.47 0 5.29 2.94 5.29 6.76V23h-4.43v-7.52c0-1.79-.03-4.1-2.5-4.1-2.5 0-2.88 1.95-2.88 3.97V23H7.44V8.04Z" />
      </svg>
    ),
  },
];

export default function ContactUs() {
  return (
    <section className="container contact-page py-3 py-lg-4">
      <div className="contact-hero card border-0 shadow-sm mb-4">
        <div className="card-body p-4 p-md-5">
          <p className="section-kicker mb-2">Contact InnerLog</p>
          <h1 className="contact-title mb-3">We are here to support your journey</h1>
          <p className="contact-lead mb-0">
            Thank you for being part of InnerLog. Whether you have a question, a collaboration idea,
            or thoughtful feedback, we would be happy to hear from you.
          </p>
        </div>
      </div>

      <div className="row g-3 g-lg-4">
        {contactMethods.map((method) => (
          <div className="col-12 col-md-6 d-flex" key={method.name}>
            <article className="contact-card card border-0 shadow-sm w-100">
              <div className="card-body p-4 d-flex flex-column">
                <div className="contact-icon" aria-hidden="true">
                  {method.icon}
                </div>
                <h2 className="h5 mb-2">{method.name}</h2>
                <p className="contact-description mb-4">{method.description}</p>
                <a
                  className="contact-link mt-auto"
                  href={method.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {method.label}
                  <span aria-hidden="true">↗</span>
                </a>
              </div>
            </article>
          </div>
        ))}
      </div>
    </section>
  );
}
