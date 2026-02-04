// app/(site)/privacy-policy/page.tsx
import type { Metadata } from "next";

import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Privacy Policy — Bonus Trend",
  description:
    "How Bonus Trend collects, uses and protects data. Email usage, cookies, security, and contact info.",
};

// опционально: убирает SSG и любые попытки пререндерить
export const revalidate = 0;
export const dynamic = "force-dynamic";

function Content() {
  return (
    <main className="sm:px-16 px-6 bg-primary relative overflow-hidden z-1 double-page">
   
      <div className="container prose prose-invert max-w-none">
        <h1 className="mt-3 mb-3">Welcome to bonus-trend.com</h1>
        <p className="mb-3">
          This Privacy Policy outlines how we collect, use, and protect your
          personal information. By using the Website, you consent to the
          practices described herein. If you do not agree, please refrain from
          using the Website.
        </p>

        <h2 className="mt-3 mb-3">Information We Collect</h2>
        <p className="mb-3">
          We collect the email addresses provided by users who choose to
          subscribe to our promotional emails. We do not collect any personally
          identifiable information beyond email addresses.
        </p>

        <h2 className="mt-3 mb-3">Use of Information</h2>
        <p className="mb-3">
          The email addresses collected are used solely for the purpose of
          sending occasional promotional emails containing offers provided by
          third-party websites. We do not sell or expose your personal
          information to any third parties.
        </p>

        <h2 className="mt-3 mb-3">Unsubscribing from Emails</h2>
        <p className="mb-3">
          You can unsubscribe at any time by clicking the
          &quot;unsubscribe&quot; link at the bottom of every promotional email.
          Your request will be processed within 10 business days.
        </p>

        <h2 className="mt-3 mb-3">Data Security</h2>
        <p className="mb-3">
          We implement reasonable security measures to protect your personal
          information from unauthorized access, alteration, disclosure, or
          destruction. However, no transmission or storage is entirely secure,
          and we cannot guarantee absolute security.
        </p>

        <h2 className="mt-3 mb-3">Cookies and Tracking</h2>
        <p className="mb-3">
          The Website may use cookies and similar tracking technologies to
          enhance user experience and gather non-personal information about user
          activities. This is used for analytics and to improve content and
          functionality.
        </p>

        <h2 className="mt-3 mb-3">Children&apos;s Privacy</h2>
        <p className="mb-3">
          Bonus bonus-trend.com is not intended for individuals under 18. We do not
          knowingly collect personal information from individuals under 18. If
          you believe we have collected such information, please contact us to
          remove it promptly.
        </p>

        <h2 className="mt-3 mb-3">Changes to Privacy Policy</h2>
        <p className="mb-3">
          We may update this Privacy Policy from time to time. Any changes will
          be reflected on this page with an updated effective date. Please
          review periodically.
        </p>

        <h2 className="mt-3 mb-3">Contact Us</h2>
        <p className="mb-3">
          For questions or requests related to your personal information or this
          Privacy Policy, email us at{" "}
          <a href="mailto:support@bonus-trend.com">support@bonus-trend.com</a>.
        </p>
      </div>

    </main>
  );
}
export default function Page() {
  return (
    <Suspense fallback={null}>
      <Content />
    </Suspense>
  );
}
