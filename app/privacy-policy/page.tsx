import type { Metadata } from "next";
import { APP_NAME, AGENCY_NAME, CONTACT_EMAIL } from "@/lib/config";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `Privacy Policy for ${APP_NAME}. Learn how we handle your data, including our commitment to never uploading your images.`,
};

const LAST_UPDATED = "July 25, 2025";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen pt-28 pb-20 px-4">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-4xl font-black mb-2" style={{ color: "var(--color-text-primary)" }}>
          Privacy Policy
        </h1>
        <p className="text-sm mb-8" style={{ color: "var(--color-text-muted)" }}>
          Last updated: {LAST_UPDATED}
        </p>

        <div className="prose-snafasa">
          <p>
            This Privacy Policy describes how <strong>{APP_NAME}</strong>, a product of{" "}
            <strong>{AGENCY_NAME}</strong> (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;), collects,
            uses, and protects your information when you use our website and OCR service.
          </p>

          <h2>1. Core Privacy Commitment — Images Never Leave Your Browser</h2>
          <p>
            <strong>
              {APP_NAME}&rsquo;s OCR engine runs entirely in your web browser using WebAssembly (Tesseract.js). When you upload an image for text extraction, that image is processed locally on your device. It is never transmitted to our servers, never stored by us, and never accessible to third parties through our service.
            </strong>
          </p>
          <p>
            You can verify this yourself at any time by opening your browser&rsquo;s Developer Tools (F12), navigating to the Network tab, and performing a conversion. You will see no outgoing request containing image data.
          </p>

          <h2>2. Information We Collect</h2>

          <h3>2.1 Account Information</h3>
          <p>
            If you create an account, we collect your email address, display name, and account creation date via Firebase Authentication. If you sign in with Google, we receive your name and email from Google as permitted by their OAuth scope.
          </p>

          <h3>2.2 Usage Data</h3>
          <p>
            We use <strong>Firebase Analytics</strong> (free, provided by Google) to collect anonymous, aggregated usage statistics, including page views, conversion events (e.g., &ldquo;conversion started,&rdquo; &ldquo;conversion completed&rdquo;), and feature usage. This data does not include image content and cannot be traced back to specific individuals.
          </p>

          <h3>2.3 Conversion History</h3>
          <p>
            For registered users who opt into history, we store in Firestore: the filename, language used, a short preview of extracted text (first 200 characters), and the timestamp. We do not store the full extracted text or the original image.
          </p>

          <h2>3. Cookies and Advertising</h2>
          <p>
            We display <strong>Google AdSense</strong> advertisements to help support our free service. Google AdSense uses cookies and similar tracking technologies to serve personalized ads based on your browsing history. This is controlled by Google&rsquo;s privacy policy. You can opt out of personalized advertising at{" "}
            <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer">
              adssettings.google.com
            </a>.
          </p>
          <p>
            We use a small localStorage key to remember your dark/light mode preference. We do not set any tracking cookies ourselves.
          </p>

          <h2>4. How We Use Your Information</h2>
          <ul>
            <li>To provide and improve the {APP_NAME} service</li>
            <li>To authenticate you and manage your account</li>
            <li>To understand aggregate usage patterns and improve the product</li>
            <li>To respond to your support requests</li>
          </ul>

          <h2>5. Data Sharing</h2>
          <p>
            We do not sell your personal data. We share data only with:
          </p>
          <ul>
            <li>
              <strong>Firebase/Google</strong> — for authentication, database, storage, and analytics (Google&rsquo;s terms apply)
            </li>
            <li>
              <strong>Google AdSense</strong> — for ad serving to free users (Google&rsquo;s ad policies apply)
            </li>
            <li>
              <strong>Law enforcement</strong> — only if required by valid legal process
            </li>
          </ul>

          <h2>6. Data Security</h2>
          <p>
            We use Firebase&rsquo;s built-in security rules to restrict data access. Your account data can only be read and modified by you (with the exception of your plan and role fields, which can only be changed by our admin). Payment screenshots are stored at access-controlled paths in Firebase Storage.
          </p>

          <h2>7. Data Retention</h2>
          <p>
            Account data is retained as long as your account is active. You may request account deletion by contacting us at{" "}
            <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>. Payment screenshots are deleted after 90 days. Conversion history is retained as long as your account exists or until you request deletion.
          </p>

          <h2>8. Children&rsquo;s Privacy</h2>
          <p>
            {APP_NAME} is not directed to children under 13. We do not knowingly collect personal information from children. If you believe a child has provided us with personal information, please contact us and we will delete it promptly.
          </p>

          <h2>9. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. The &ldquo;Last updated&rdquo; date at the top of this page reflects when changes were last made. Continued use of the service after changes constitutes acceptance of the revised policy.
          </p>

          <h2>10. Contact</h2>
          <p>
            For privacy questions or data deletion requests, contact us at{" "}
            <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
          </p>
        </div>
      </div>
    </div>
  );
}
