import React from 'react'
import { Shield, FileText, AlertTriangle } from 'lucide-react'

export function Terms() {
  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <FileText className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-white mb-4">Terms & Conditions</h1>
        <p className="text-purple-200">Last updated: January 2025</p>
      </div>

      {/* Content */}
      <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-8 space-y-8">
        
        <section>
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
            <Shield className="w-6 h-6 mr-2 text-blue-400" />
            1. Acceptance of Terms
          </h2>
          <p className="text-purple-200 leading-relaxed">
            By accessing and using MYNE7X, you accept and agree to be bound by the terms and provision of this agreement. 
            If you do not agree to abide by the above, please do not use this service.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4">2. Use License</h2>
          <div className="text-purple-200 space-y-3">
            <p>Permission is granted to temporarily download products from MYNE7X for personal, non-commercial use only. This is the grant of a license, not a transfer of title, and under this license you may not:</p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>Modify or copy the materials</li>
              <li>Use the materials for any commercial purpose or for any public display</li>
              <li>Attempt to reverse engineer any software contained on MYNE7X</li>
              <li>Remove any copyright or other proprietary notations from the materials</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4">3. User Accounts</h2>
          <div className="text-purple-200 space-y-3">
            <p>When you create an account with us, you must provide information that is accurate, complete, and current at all times.</p>
            <p>You are responsible for safeguarding the password and for all activities that occur under your account.</p>
            <p>We reserve the right to terminate accounts that violate these terms or engage in harmful behavior.</p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4">4. Payment and Refunds</h2>
          <div className="text-purple-200 space-y-3">
            <p>Paid products require admin approval after payment submission. Payments are processed manually through the provided NayaPay number.</p>
            <p>Refunds are considered on a case-by-case basis and must be requested within 7 days of purchase.</p>
            <p>Free products are provided as-is with no warranty or guarantee.</p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4">5. Content and Conduct</h2>
          <div className="text-purple-200 space-y-3">
            <p>Users must not:</p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>Upload malicious software or harmful content</li>
              <li>Violate any applicable laws or regulations</li>
              <li>Infringe upon the rights of others</li>
              <li>Use the platform for spam or unauthorized commercial activities</li>
              <li>Attempt to gain unauthorized access to other accounts or systems</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4">6. Privacy Policy</h2>
          <p className="text-purple-200 leading-relaxed">
            Your privacy is important to us. We collect only necessary information for account creation and service provision. 
            We do not sell or share your personal information with third parties. All data is securely stored using Supabase's 
            enterprise-grade security measures.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4">7. Admin Rights</h2>
          <div className="text-purple-200 space-y-3">
            <p>The admin (myne7x@gmail.com) reserves the right to:</p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>Approve or reject payment requests</li>
              <li>Block or unblock user accounts</li>
              <li>Remove content that violates these terms</li>
              <li>Send notifications to all users</li>
              <li>Modify or terminate the service</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4">8. Limitation of Liability</h2>
          <p className="text-purple-200 leading-relaxed">
            MYNE7X and its operators will not be liable for any damages of any kind arising from the use of this service, 
            including but not limited to direct, indirect, incidental, punitive, and consequential damages.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4">9. Changes to Terms</h2>
          <p className="text-purple-200 leading-relaxed">
            We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting. 
            Your continued use of MYNE7X after changes constitutes acceptance of the new terms.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4">10. Contact Information</h2>
          <p className="text-purple-200 leading-relaxed">
            If you have any questions about these Terms & Conditions, please use our live chat feature or contact the admin 
            through the platform's messaging system.
          </p>
        </section>

        {/* Warning Box */}
        <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-lg p-6 mt-8">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-6 h-6 text-yellow-400 mt-1 flex-shrink-0" />
            <div>
              <h3 className="text-lg font-semibold text-yellow-300 mb-2">Important Notice</h3>
              <p className="text-yellow-200 text-sm leading-relaxed">
                By using MYNE7X, you acknowledge that you have read, understood, and agree to be bound by these terms and conditions. 
                Violation of these terms may result in immediate account termination and legal action if necessary.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}