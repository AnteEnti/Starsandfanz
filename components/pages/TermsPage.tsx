

import React from 'react';

const TermsPage: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto p-6 bg-slate-800 rounded-lg shadow-xl animate-page-enter">
      <h1 className="text-4xl font-bold text-white mb-4 border-b-2 border-purple-500/30 pb-2">Terms of Service</h1>
      <div className="space-y-6 text-slate-300 leading-relaxed text-sm">
        <p>Last updated: {new Date().toLocaleDateString()}</p>
        
        <p>Please read these Terms of Service ("Terms", "Terms of Service") carefully before using the Fanz Adda website (the "Service") operated by us.</p>
        
        <section>
          <h2 className="text-xl font-semibold text-white mb-2">1. Acceptance of Terms</h2>
          <p>By accessing or using our Service, you agree to be bound by these Terms. If you disagree with any part of the terms, then you may not access the Service.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-2">2. User Conduct</h2>
          <p>Fanz Adda is a platform for celebration. You agree not to use the Service to post any content that is negative, critical, defamatory, obscene, threatening, invasive of privacy, or otherwise injurious to third parties. We reserve the right to remove any content and terminate accounts that violate our community standards of positivity and respect.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-2">3. Content</h2>
          <p>Our Service allows you to post, link, store, share and otherwise make available certain information, text, graphics, videos, or other material ("Content"). You are responsible for the Content that you post on or through the Service, including its legality, reliability, and appropriateness. The content posted by admins is for entertainment and informational purposes only.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-2">4. Accounts</h2>
          <p>When you create an account with us, you must provide us with information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-2">5. Limitation of Liability</h2>
          <p>In no event shall Fanz Adda, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-2">6. Changes</h2>
          <p>We reserve the right, at our sole discretion, to modify or replace these Terms at any time. We will try to provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-2">Contact Us</h2>
          <p>If you have any questions about these Terms, please contact us.</p>
        </section>
      </div>
    </div>
  );
};

export default TermsPage;