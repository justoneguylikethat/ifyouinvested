import { constructMetadata } from "@/lib/seo";

export const metadata = constructMetadata({
  title: "Privacy Policy | IfYouInvested",
  description: "Privacy Policy for IfYouInvested — how we collect, use, and protect your data.",
});

export default function PrivacyPage() {
  return (
    <div className="min-h-screen p-6 md:p-10">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-3 tracking-tight">Privacy Policy</h1>
        <p className="text-slate-500 text-sm mb-10">Last updated: June 2025</p>

        <div className="space-y-8 text-slate-300 leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">1. Information We Collect</h2>
            <p>IfYouInvested collects minimal personal information. When you use the Service, we may automatically collect:</p>
            <ul className="mt-3 space-y-1 list-disc list-inside text-slate-400">
              <li>Browser type and version</li>
              <li>Pages visited and time spent</li>
              <li>IP address (anonymized)</li>
              <li>Device type and screen resolution</li>
            </ul>
            <p className="mt-3">We do not require account registration, and we do not collect your name, email, or financial information unless you voluntarily provide it.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">2. How We Use Your Information</h2>
            <p>Information collected is used solely to:</p>
            <ul className="mt-3 space-y-1 list-disc list-inside text-slate-400">
              <li>Improve the functionality and performance of the Service</li>
              <li>Understand how users interact with the platform</li>
              <li>Prevent abuse and ensure system security</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">3. Cookies and Tracking</h2>
            <p>We use cookies and similar tracking technologies to improve user experience. These include functional cookies (for features like watchlist and saved portfolios stored locally) and analytics cookies. You can disable cookies in your browser settings, though some features may not function correctly.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">4. Third-Party Services</h2>
            <p>We use third-party services including financial data APIs, analytics providers, and CDN services. These services have their own privacy policies, and we encourage you to review them.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">5. Data Retention</h2>
            <p>We do not store sensitive personal data. Any simulation data you create is stored locally in your browser and is not transmitted to our servers unless explicitly shared.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">6. Your Rights</h2>
            <p>You have the right to access, correct, or request deletion of any personal data we hold about you. To exercise these rights, please contact us through our website.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">7. Changes to This Policy</h2>
            <p>We may update this Privacy Policy periodically. We will notify users of significant changes by posting a notice on our platform. Continued use of the Service constitutes acceptance of the updated policy.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">8. Contact Us</h2>
            <p>If you have any questions about this Privacy Policy, please contact us through our website.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
