// src/pages/PrivacyPolicy.jsx
import React from "react";
import { Helmet } from "react-helmet-async";

export default function PrivacyPolicy() {
  return (
    <div
      className="privacy-policy"
      style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto" }}
    >
      <Helmet>
        <title>Privacy Policy | Moim</title>
      </Helmet>
      <h1>Privacy Policy</h1>
      <p>Last updated: September 30, 2025</p>

      <p>
        Welcome to <strong>Moim</strong>. This Privacy Policy explains how we
        collect, use, and protect your personal information when you use our
        application and services.
      </p>

      <h2>1. Information We Collect</h2>
      <ul>
        <li>
          <strong>Account Information:</strong> Username, phone number, and
          Discord ID when you sign up.
        </li>
        <li>
          <strong>Usage Data:</strong> Information about how you use the app,
          such as chat messages, room participation, and activity logs.
        </li>
        <li>
          <strong>Device Information:</strong> Basic device and browser data
          (e.g., IP address, OS, browser type).
        </li>
      </ul>

      <h2>2. How We Use Your Information</h2>
      <ul>
        <li>To provide and improve our services.</li>
        <li>To enable chat, translation, and room matching features.</li>
        <li>To ensure user safety and prevent fraudulent activity.</li>
        <li>To comply with legal obligations.</li>
      </ul>

      <h2>3. Sharing of Information</h2>
      <p>
        We do not sell your personal data. Your information may be shared only
        in the following cases:
      </p>
      <ul>
        <li>
          With service providers (e.g., Firebase, Discord API) to operate the
          app.
        </li>
        <li>When required by law, regulation, or legal process.</li>
        <li>To protect the safety and rights of our users and platform.</li>
      </ul>

      <h2>4. Data Retention</h2>
      <p>
        We retain your personal data only as long as necessary to provide our
        services, comply with legal obligations, or resolve disputes. You may
        request deletion of your account at any time.
      </p>

      <h2>5. Security</h2>
      <p>
        We use reasonable security measures to protect your data. However, no
        method of transmission or storage is 100% secure, and we cannot
        guarantee absolute security.
      </p>

      <h2>6. Your Rights</h2>
      <ul>
        <li>You may access, update, or delete your personal information.</li>
        <li>You may withdraw your consent for data processing at any time.</li>
        <li>
          For account-related requests, please contact us at{" "}
          <a href="mailto:sooh3070@gmail.com">sooh3070@gmail.com</a>.
        </li>
      </ul>

      <h2>7. Children’s Privacy</h2>
      <p>
        Our services are not directed to children under 13. We do not knowingly
        collect personal data from children. If you believe we have collected
        such data, please contact us immediately.
      </p>

      <h2>8. Changes to This Policy</h2>
      <p>
        We may update this Privacy Policy from time to time. Updates will be
        effective when posted in the app. Please review periodically.
      </p>

      <h2>9. Contact Us</h2>
      <p>
        If you have any questions, please contact us at{" "}
        <a href="mailto:sooh3070@gmail.com">sooh3070@gmail.com</a>.
      </p>
    </div>
  );
}
