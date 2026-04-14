import React from 'react';

export default function Footer(): React.ReactElement {
  return (
    <footer className="app-footer">
      <div className="footer-content">
        <span>&copy; {new Date().getFullYear()} ProjectHub. All rights reserved.</span>
        <span className="version">v1.0.0</span>
        <nav className="footer-links">
          <a href="/docs" target="_blank" rel="noopener noreferrer">Documentation</a>
          <a href="/support" target="_blank" rel="noopener noreferrer">Support</a>
        </nav>
      </div>
    </footer>
  );
}
