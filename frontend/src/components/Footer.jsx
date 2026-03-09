export default function Footer() {
  return (
    <footer className="layout-footer">
      <div className="layout-footer-inner">
        <p className="layout-footer-title">InnerLog</p>
        <p className="layout-footer-tagline">Reflect daily, understand your mood journey.</p>
        <p className="layout-footer-copy">© {new Date().getFullYear()} InnerLog. All rights reserved.</p>
      </div>
    </footer>
  );
}
