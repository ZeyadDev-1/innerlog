export default function Footer() {
  return (
    <footer className="layout-footer border-top mt-auto">
      <div className="container py-3 text-center">
        <p className="mb-1 fw-semibold">InnerLog</p>
        <p className="mb-1 small">Reflect daily, understand your mood journey.</p>
        <p className="mb-0 small">© {new Date().getFullYear()} InnerLog. All rights reserved.</p>
      </div>
    </footer>
  );
}
