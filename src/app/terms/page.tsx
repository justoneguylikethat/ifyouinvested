import { constructMetadata } from "@/lib/seo";

export const metadata = constructMetadata({
  title: "Terms of Service | IfYouInvested",
  description: "Terms of Service for IfYouInvested — the investment simulation and education platform.",
});

export default function TermsPage() {
  return (
    <div className="min-h-screen p-6 md:p-10">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-3 tracking-tight">Terms of Service</h1>
        <p className="text-slate-500 text-sm mb-10">Last updated: June 2025</p>

        <div className="space-y-8 text-slate-300 leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">1. Acceptance of Terms</h2>
            <p>By accessing and using IfYouInvested (&ldquo;the Service&rdquo;), you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the Service.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">2. Not Financial Advice</h2>
            <p>IfYouInvested is an educational and simulation tool only. All information, simulations, and results presented are for informational and entertainment purposes only. <strong className="text-white">Nothing on this platform constitutes financial advice, investment recommendations, or endorsements.</strong> Always consult a qualified financial advisor before making any investment decisions.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">3. Accuracy of Data</h2>
            <p>While we strive to use accurate historical data, we make no guarantees about the accuracy, completeness, or timeliness of any information on the platform. Historical performance is not indicative of future results.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">4. Use of the Service</h2>
            <p>You agree to use the Service only for lawful purposes and in a manner that does not infringe the rights of others. You must not misuse, overload, or attempt to disrupt the Service.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">5. Intellectual Property</h2>
            <p>All content, design, and software on this platform are the intellectual property of IfYouInvested. You may not reproduce, copy, or distribute any content without prior written permission.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">6. Limitation of Liability</h2>
            <p>IfYouInvested shall not be liable for any direct, indirect, incidental, or consequential damages arising from your use of the Service or reliance on any information provided herein.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">7. Changes to Terms</h2>
            <p>We reserve the right to modify these terms at any time. Continued use of the Service after changes constitutes your acceptance of the revised terms.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">8. Contact</h2>
            <p>If you have any questions about these Terms, please contact us through our website.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
