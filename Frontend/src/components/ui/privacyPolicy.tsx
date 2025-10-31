import React from "react";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen flex justify-center items-start bg-gray-50 py-12 px-6">
       {/* Main Content */}
        <main className="flex flex-col  max-w-4xl border border-gray-300 rounded-lg mx-auto px-6  py-10">
          {/* Page Title */}
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-eduBlue">
              Privacy Policy – EduPrint
            </h1>
            <p className="text-gray-600 mt-3 text-sm md:text-base max-w-3xl mx-auto">
              This document is an electronic record in terms of the Information
              Technology Act, 2000 and rules thereunder. By using our platform,
              you agree to comply with these Terms.
            </p>
          </div>

          <section className="bg-white shadow-sm rounded-xl p-6 border border-gray-100 space-y-8">
            {/* Introduction */}
            <article>
              <div className="flex justify-between">
                <h3 className="text-black text-sm">
                  Last Updated: 31-Oct-2025
                </h3>
              </div>
              <p className="text-gray-700 leading-relaxed text-sm md:text-base">
                Educerns Technologies Pvt. Ltd. ("Company", "we", "our", "us")
                values your trust and is committed to protecting your privacy.
                This Privacy Policy describes how we collect, use, store, share,
                and protect your information when you use EduPrint.
              </p>
              <p className="text-gray-700 leading-relaxed text-sm md:text-base mt-4">
                By using EduPrint, you consent to the terms of this
                Privacy Policy. Please read this policy carefully before using
                our services.
              </p>
            </article>

            {/* 1. Information We Collect */}
            <article>
              <h2 className="text-xl font-semibold text-eduBlue mb-3">
                1. Information We Collect
              </h2>

              {/* 1.1 Personal Information */}
              <h3 className="text-lg font-medium text-black mt-4">
                1.1 Personal Information
              </h3>
              <p className="text-gray-700 text-sm md:text-base">
                We collect personal information that you voluntarily provide to
                us, including:
              </p>
              <ul className="pl-6 list-disc space-y-1 text-gray-700 text-sm md:text-base">
                <li>
                  Identity Information: Full name, date of birth, gender,
                  photograph
                </li>
                <li>
                  Contact Information: Email address, phone number, postal
                  address
                </li>
                <li>
                  Educational Details: Educational qualifications, institution
                  names, academic records
                </li>
                <li>
                  Professional Information: Work experience, skills, career
                  objectives
                </li>
                <li>
                  Identity Verification: Government-issued ID copies,
                  marksheets, certificates, degrees
                </li>
              </ul>

              {/* 1.2 Technical Information */}
              <h3 className="text-lg font-medium text-black mt-4">
                1.2 Technical Information
              </h3>
              <p className="text-gray-700 text-sm md:text-base">
                We automatically collect technical information when you use our
                Platform:
              </p>
              <ul className="pl-6 list-disc space-y-1 text-gray-700 text-sm md:text-base">
                <li>
                  Device Information: Device type, operating system, browser
                  type and version
                </li>
                <li>
                  Usage Data: IP address, log files, page views, time spent on
                  pages, click patterns
                </li>
                <li>
                  Location Data: General location based on IP address (not
                  precise GPS location)
                </li>
                <li>
                  Performance Data: Platform performance metrics, error reports,
                  system diagnostics
                </li>
              </ul>

              {/* 1.3 Payment Information */}
              <h3 className="text-lg font-medium text-black mt-4">
                1.3 Payment Information
              </h3>
              <ul className="pl-6 list-disc space-y-1 text-gray-700 text-sm md:text-base">
                <li>
                  Billing Details: Billing address, payment method information
                </li>
                <li>
                  Transaction Data: Transaction history, payment amounts, dates
                </li>
              </ul>
              <p className="text-gray-700 text-sm md:text-base italic mt-2">
                Note: We do not store complete credit/debit card details;
                payments are processed through secure third-party payment
                gateways.
              </p>

              {/* 1.4 Communication Data */}
              <h3 className="text-lg font-medium text-black mt-4">
                1.4 Communication Data
              </h3>
              <ul className="pl-6 list-disc space-y-1 text-gray-700 text-sm md:text-base">
                <li>
                  Support Communications: Messages, emails, and calls with our
                  support team
                </li>
                <li>
                  Marketing Communications: Email preferences, subscription data
                </li>
                <li>Feedback: Surveys, reviews, and user feedback</li>
              </ul>

              {/* 1.5 Cookies */}
              <h3 className="text-lg font-medium text-black mt-4">
                1.5 Cookies and Similar Technologies
              </h3>
              <p className="text-gray-700 text-sm md:text-base">
                We use cookies, web beacons, and similar technologies to:
              </p>
              <ul className="pl-6 list-disc space-y-1 text-gray-700 text-sm md:text-base">
                <li>Remember your preferences and settings</li>
                <li>Provide personalized content and recommendations</li>
                <li>Analyze usage patterns and improve our services</li>
                <li>Deliver relevant advertisements (where applicable)</li>
              </ul>
            </article>

            {/* 2. How We Use Your Information */}
            <article className="mt-6">
              <h2 className="text-xl font-semibold text-eduBlue mb-3">
                2. How We Use Your Information
              </h2>

              {/* 2.1 Primary Purposes */}
              <h3 className="text-lg font-medium text-black mt-4">
                2.1 Primary Purposes
              </h3>
              <ul className="pl-6 list-disc space-y-1 text-gray-700 text-sm md:text-base">
                <li>
                  Service Delivery: Providing certification, examination, and
                  verification services
                </li>
                <li>
                  Identity Verification: Confirming your identity for
                  examination and certification purposes
                </li>
                <li>
                  Certificate Generation: Creating and delivering your digital
                  certificates
                </li>
                <li>
                  Resume Building: Generating resumes and professional profiles
                  within EduPrint
                </li>
                <li>
                  Account Management: Managing your account, authentication, and
                  security
                </li>
              </ul>

              {/* 2.2 Communication Purposes */}
              <h3 className="text-lg font-medium text-black mt-4">
                2.2 Communication Purposes
              </h3>
              <ul className="pl-6 list-disc space-y-1 text-gray-700 text-sm md:text-base">
                <li>
                  Service Communications: Sending exam schedules, results,
                  certificate updates
                </li>
                <li>
                  Support Services: Responding to your queries and providing
                  customer support
                </li>
                <li>
                  Marketing Communications: Sending promotional offers,
                  newsletters (with your consent)
                </li>
                <li>
                  Important Updates: Notifying about policy changes, platform
                  updates, security alerts
                </li>
              </ul>

              {/* 2.3 Platform Improvement */}
              <h3 className="text-lg font-medium text-black mt-4">
                2.3 Platform Improvement
              </h3>
              <ul className="pl-6 list-disc space-y-1 text-gray-700 text-sm md:text-base">
                <li>
                  Analytics: Understanding usage patterns to improve user
                  experience
                </li>
                <li>
                  Performance Monitoring: Ensuring platform reliability and
                  performance
                </li>
                <li>
                  Security: Detecting and preventing fraud, unauthorized access,
                  and security threats
                </li>
                <li>
                  Research and Development: Developing new features and services
                </li>
              </ul>

              {/* 2.4 Legal & Compliance */}
              <h3 className="text-lg font-medium text-black mt-4">
                2.4 Legal and Compliance
              </h3>
              <ul className="pl-6 list-disc space-y-1 text-gray-700 text-sm md:text-base">
                <li>
                  Regulatory Compliance: Meeting legal and regulatory
                  requirements
                </li>
                <li>
                  Record Keeping: Maintaining records for audit and verification
                  purposes
                </li>
                <li>
                  Legal Proceedings: Responding to legal requests, court orders,
                  or government inquiries
                </li>
              </ul>
            </article>

            {/* 3. Legal Basis for Processing */}
            <article className="mt-6">
              <h2 className="text-xl font-semibold text-eduBlue mb-3">
                3. Legal Basis for Processing (GDPR Compliance)
              </h2>
              <ul className="pl-6 list-disc space-y-1 text-gray-700 text-sm md:text-base">
                <li>
                  Contract: Performance of our Terms & Conditions and service
                  delivery
                </li>
                <li>
                  Consent: Where you have given explicit consent for specific
                  processing activities
                </li>
                <li>
                  Legitimate Interest: For platform improvement, security, and
                  fraud prevention
                </li>
                <li>
                  Legal Obligation: Compliance with applicable laws and
                  regulations
                </li>
              </ul>
            </article>

            {/* 4. Data Sharing & Disclosure */}
            <article className="mt-6">
              <h2 className="text-xl font-semibold text-eduBlue mb-3">
                4. Data Sharing & Disclosure
              </h2>

              <h3 className="text-lg font-medium text-black mt-4">
                4.1 We Do Not Sell Your Data
              </h3>
              <p className="text-gray-700 text-sm md:text-base">
                We do not sell, rent, or trade your personal information to
                third parties for marketing purposes.
              </p>

              <h3 className="text-lg font-medium text-black mt-4">
                4.2 Authorized Sharing
              </h3>
              <p className="text-gray-700 text-sm md:text-base">
                We may share your information with:
              </p>
              <ul className="pl-6 list-disc space-y-1 text-gray-700 text-sm md:text-base">
                <li>
                  <strong>Service Partners:</strong> Authorized franchise
                  centers, educational institutions, employers (with consent)
                </li>
                <li>
                  <strong>Service Providers:</strong> Cloud hosting, payment
                  processors, email providers, analytics providers
                </li>
                <li>
                  <strong>Legal Requirements:</strong> Government authorities,
                  law enforcement, courts, regulators
                </li>
              </ul>

              <h3 className="text-lg font-medium text-black mt-4">
                4.3 Business Transfers
              </h3>
              <p className="text-gray-700 text-sm md:text-base">
                In the event of merger, acquisition, or sale of assets, your
                information may be transferred to the acquiring entity, subject
                to the same privacy protections.
              </p>
            </article>

            {/* 5. Data Security */}
            <article className="mt-6">
              <h2 className="text-xl font-semibold text-eduBlue mb-3">
                5. Data Security
              </h2>

              <h3 className="text-lg font-medium text-black mt-4">
                5.1 Security Measures
              </h3>
              <ul className="pl-6 list-disc space-y-1 text-gray-700 text-sm md:text-base">
                <li>Encryption: Data encryption in transit and at rest</li>
                <li>
                  Access Controls: Role-based access and multi-factor
                  authentication
                </li>
                <li>
                  Network Security: Firewalls, intrusion detection, secure
                  architecture
                </li>
                <li>
                  Regular Audits: Vulnerability assessments and penetration
                  testing
                </li>
                <li>
                  Employee Training: Security awareness training for employees
                </li>
              </ul>

              <h3 className="text-lg font-medium text-black mt-4">
                5.2 Data Breach Response
              </h3>
              <ul className="pl-6 list-disc space-y-1 text-gray-700 text-sm md:text-base">
                <li>Immediate assessment and containment</li>
                <li>Notify affected users within 72 hours</li>
                <li>Inform relevant authorities as required</li>
                <li>Provide support and guidance to affected users</li>
              </ul>

              <h3 className="text-lg font-medium text-black mt-4">
                5.3 Limitations
              </h3>
              <p className="text-gray-700 text-sm md:text-base">
                While we implement robust security measures, no system is
                completely secure. We cannot guarantee absolute protection of
                your data against all possible threats.
              </p>
            </article>

            {/* 6. Data Retention */}
            <article className="mt-6">
              <h2 className="text-xl font-semibold text-eduBlue mb-3">
                6. Data Retention
              </h2>

              <h3 className="text-lg font-medium text-black mt-4">
                6.1 Retention Periods
              </h3>
              <ul className="pl-6 list-disc space-y-1 text-gray-700 text-sm md:text-base">
                <li>
                  Account Data: Retained for the duration of your account plus 3
                  years after closure
                </li>
                <li>
                  Academic Records: Retained permanently for verification and
                  audit purposes
                </li>
                <li>
                  Certification Data: Retained permanently for certificate
                  validation and verification
                </li>
                <li>
                  Transaction Records: Retained for 7 years for financial and
                  legal compliance
                </li>
                <li>
                  Communication Logs: Retained for 2 years for support and
                  quality purposes
                </li>
              </ul>

              <h3 className="text-lg font-medium text-black mt-4">
                6.2 Deletion Requests
              </h3>
              <p className="text-gray-700 text-sm md:text-base">
                Upon request, we will delete your personal data, except where:
              </p>
              <ul className="pl-6 list-disc space-y-1 text-gray-700 text-sm md:text-base">
                <li>Retention is required by law or regulation</li>
                <li>Data is necessary for certificate verification purposes</li>
                <li>Information is needed for ongoing legal proceedings</li>
                <li>Academic records required for institutional compliance</li>
              </ul>
            </article>

            {/* 7. Your Privacy Rights */}
            <article className="mt-6">
              <h2 className="text-xl font-semibold text-eduBlue mb-3">
                7. Your Privacy Rights
              </h2>

              <h3 className="text-lg font-medium text-black mt-4">
                7.1 Access Rights
              </h3>
              <ul className="pl-6 list-disc space-y-1 text-gray-700 text-sm md:text-base">
                <li>Access: Request copies of your personal data</li>
                <li>
                  Portability: Receive your data in a structured,
                  machine-readable format
                </li>
                <li>
                  Information: Understand how your data is being processed
                </li>
              </ul>

              <h3 className="text-lg font-medium text-black mt-4">
                7.2 Control Rights
              </h3>
              <ul className="pl-6 list-disc space-y-1 text-gray-700 text-sm md:text-base">
                <li>
                  Update: Correct or update your personal information through
                  your account
                </li>
                <li>
                  Delete: Request deletion of your data (subject to retention
                  requirements)
                </li>
                <li>
                  Restrict: Limit how we process your data in certain
                  circumstances
                </li>
                <li>
                  Object: Object to processing based on legitimate interest
                </li>
              </ul>

              <h3 className="text-lg font-medium text-black mt-4">
                7.3 Communication Preferences
              </h3>
              <ul className="pl-6 list-disc space-y-1 text-gray-700 text-sm md:text-base">
                <li>
                  Opt-out: Unsubscribe from marketing communications at any time
                </li>
                <li>
                  Preferences: Manage your communication preferences in account
                  settings
                </li>
                <li>
                  Consent Withdrawal: Withdraw consent for specific processing
                  activities
                </li>
              </ul>

              <h3 className="text-lg font-medium text-black mt-4">
                7.4 Exercising Your Rights
              </h3>
              <p className="text-gray-700 text-sm md:text-base">
                To exercise your privacy rights:
              </p>
              <ul className="pl-6 list-disc space-y-1 text-gray-700 text-sm md:text-base">
                <li>Contact us at support@educerns.org</li>
                <li>
                  Include your full name, registered email, and specific request
                </li>
                <li>
                  We will respond within 30 days of receiving your request
                </li>
                <li>
                  Identity verification may be required for security purposes
                </li>
              </ul>
            </article>

            {/* 8. International Data Transfers */}
            <article className="mt-6">
              <h2 className="text-xl font-semibold text-eduBlue mb-3">
                8. International Data Transfers
              </h2>

              <h3 className="text-lg font-medium text-black mt-4">
                8.1 Cross-Border Transfers
              </h3>
              <p className="text-gray-700 text-sm md:text-base">
                Your data may be transferred to and processed in countries
                outside India, including:
              </p>
              <ul className="pl-6 list-disc space-y-1 text-gray-700 text-sm md:text-base">
                <li>
                  Cloud storage providers with international infrastructure
                </li>
                <li>Third-party service providers with global operations</li>
                <li>Partner institutions for verification purposes</li>
              </ul>

              <h3 className="text-lg font-medium text-black mt-4">
                8.2 Transfer Safeguards
              </h3>
              <p className="text-gray-700 text-sm md:text-base">
                We ensure appropriate safeguards through:
              </p>
              <ul className="pl-6 list-disc space-y-1 text-gray-700 text-sm md:text-base">
                <li>
                  Standard Contractual Clauses: EU-approved data transfer
                  agreements
                </li>
                <li>
                  Adequacy Decisions: Transfers to countries with adequate data
                  protection
                </li>
                <li>
                  Certification Programs: Partners certified under recognized
                  privacy frameworks
                </li>
              </ul>
            </article>

            {/* 9. Cookies & Tracking Technologies */}
            <article className="mt-6">
              <h2 className="text-xl font-semibold text-eduBlue mb-3">
                9. Cookies & Tracking Technologies
              </h2>

              <h3 className="text-lg font-medium text-black mt-4">
                9.1 Types of Cookies
              </h3>
              <ul className="pl-6 list-disc space-y-1 text-gray-700 text-sm md:text-base">
                <li>
                  Essential Cookies: Required for platform functionality (cannot
                  be disabled)
                </li>
                <li>
                  Performance Cookies: Help us understand how users interact
                  with our platform
                </li>
                <li>
                  Functionality Cookies: Remember your preferences and settings
                </li>
                <li>
                  Marketing Cookies: Used to deliver relevant advertisements
                  (with consent)
                </li>
              </ul>

              <h3 className="text-lg font-medium text-black mt-4">
                9.2 Cookie Management
              </h3>
              <ul className="pl-6 list-disc space-y-1 text-gray-700 text-sm md:text-base">
                <li>
                  Browser Settings: You can control cookies through your browser
                  settings
                </li>
                <li>
                  Cookie Banner: Manage preferences through our cookie consent
                  banner
                </li>
                <li>Opt-out: You can opt out of non-essential cookies</li>
                <li>
                  Impact: Disabling cookies may limit platform functionality
                </li>
              </ul>

              <h3 className="text-lg font-medium text-black mt-4">
                9.3 Third-Party Cookies
              </h3>
              <p className="text-gray-700 text-sm md:text-base">
                Some cookies are set by third-party services:
              </p>
              <ul className="pl-6 list-disc space-y-1 text-gray-700 text-sm md:text-base">
                <li>Google Analytics (for usage analysis)</li>
                <li>Payment processors (for transaction security)</li>
                <li>Social media platforms (for social features)</li>
              </ul>
            </article>

            {/* 10. Children's Privacy */}
            <article className="mt-6">
              <h2 className="text-xl font-semibold text-eduBlue mb-3">
                10. Children's Privacy
              </h2>

              <h3 className="text-lg font-medium text-black mt-4">
                10.1 Age Restrictions
              </h3>
              <ul className="pl-6 list-disc space-y-1 text-gray-700 text-sm md:text-base">
                <li>
                  EduPrint is not intended for children under 13 years
                </li>
                <li>
                  We do not knowingly collect personal data from children under
                  13
                </li>
                <li>Users between 13-18 years require parental consent</li>
              </ul>

              <h3 className="text-lg font-medium text-black mt-4">
                10.2 Parental Rights
              </h3>
              <ul className="pl-6 list-disc space-y-1 text-gray-700 text-sm md:text-base">
                <li>Review their child's personal information</li>
                <li>Request deletion of their child's data</li>
                <li>Prevent further collection of their child's information</li>
              </ul>

              <h3 className="text-lg font-medium text-black mt-4">
                10.3 Discovery of Child Data
              </h3>
              <ul className="pl-6 list-disc space-y-1 text-gray-700 text-sm md:text-base">
                <li>
                  If we discover we have collected data from a child under 13:
                  We will delete the information immediately
                </li>
                <li>We will not use the information for any purpose</li>
                <li>
                  Parents will be notified if contact information is available
                </li>
              </ul>
            </article>

            {/* 11. Third-Party Links & Services */}
            <article className="mt-6">
              <h2 className="text-xl font-semibold text-eduBlue mb-3">
                11. Third-Party Links & Services
              </h2>

              <h3 className="text-lg font-medium text-black mt-4">
                11.1 External Links
              </h3>
              <ul className="pl-6 list-disc space-y-1 text-gray-700 text-sm md:text-base">
                <li>
                  Our Platform may contain links to third-party websites and
                  services
                </li>
                <li>We are not responsible for their privacy practices</li>
                <li>We recommend reviewing their privacy policies</li>
                <li>Different terms and conditions may apply</li>
              </ul>

              <h3 className="text-lg font-medium text-black mt-4">
                11.2 Social Media Integration
              </h3>
              <ul className="pl-6 list-disc space-y-1 text-gray-700 text-sm md:text-base">
                <li>
                  If you connect social media accounts, we may receive
                  information from these platforms
                </li>
                <li>
                  You can control this through social media privacy settings
                </li>
                <li>
                  We will only use this information as described in this policy
                </li>
              </ul>
            </article>

            {/* 12. Changes to Privacy Policy */}
            <article className="mt-6">
              <h2 className="text-xl font-semibold text-eduBlue mb-3">
                12. Changes to Privacy Policy
              </h2>

              <h3 className="text-lg font-medium text-black mt-4">
                12.1 Policy Updates
              </h3>
              <ul className="pl-6 list-disc space-y-1 text-gray-700 text-sm md:text-base">
                <li>We may update this Privacy Policy periodically</li>
                <li>Significant changes will be communicated via email</li>
                <li>
                  Updated policy will be posted on our Platform with revision
                  date
                </li>
                <li>Continued use constitutes acceptance of updated policy</li>
              </ul>

              <h3 className="text-lg font-medium text-black mt-4">
                12.2 Notice Period
              </h3>
              <ul className="pl-6 list-disc space-y-1 text-gray-700 text-sm md:text-base">
                <li>
                  Major changes will be communicated at least 30 days in advance
                </li>
                <li>
                  You will have the opportunity to review and object to changes
                </li>
                <li>
                  If you object to changes, you may need to stop using our
                  services
                </li>
              </ul>
            </article>

            {/* 13. Regulatory Compliance */}
            <article className="mt-6">
              <h2 className="text-xl font-semibold text-eduBlue mb-3">
                13. Regulatory Compliance
              </h2>

              <h3 className="text-lg font-medium text-black mt-4">
                13.1 Applicable Laws
              </h3>
              <ul className="pl-6 list-disc space-y-1 text-gray-700 text-sm md:text-base">
                <li>
                  Indian Laws: Information Technology Act, 2000 and related
                  rules
                </li>
                <li>GDPR: For users in the European Union</li>
                <li>
                  Other Applicable Laws: Local data protection regulations where
                  applicable
                </li>
              </ul>

              <h3 className="text-lg font-medium text-black mt-4">
                13.2 Supervisory Authorities
              </h3>
              <ul className="pl-6 list-disc space-y-1 text-gray-700 text-sm md:text-base">
                <li>India: Relevant authorities under IT Act, 2000</li>
                <li>EU: Your local data protection authority</li>
                <li>
                  Other: Applicable regulatory bodies in your jurisdiction
                </li>
              </ul>
            </article>

            {/* 14. Contact Information */}
            <article className="mt-6">
              <h2 className="text-xl font-semibold text-eduBlue mb-3">
                14. Contact Information
              </h2>

              <h3 className="text-lg font-medium text-black mt-4">
                14.1 Privacy Officer
              </h3>
              <ul className="pl-6 list-disc space-y-1 text-gray-700 text-sm md:text-base">
                <li>
                  Email:{" "}
                  <span className="text-blue-600">support@educerns.org</span>
                </li>
                <li>Phone: +91 - 8855856055</li>
                <li>Response Time: Within 48 hours for urgent matters</li>
              </ul>

              <h3 className="text-lg font-medium text-black mt-4">
                14.2 General Contact
              </h3>
              <ul className="pl-6 list-disc space-y-1 text-gray-700 text-sm md:text-base">
                <li>
                  <strong>Educerns Technologies Pvt. Ltd.</strong>
                </li>
                <li>
                  Address: 472, Kasar Ali, Opp. Markandeshwar Mandir, Anjur,
                  Bhiwandi, Thane, Maharashtra – 421302
                </li>
                <li>
                  Support Email:{" "}
                  <span className="text-blue-600">support@educerns.org</span>
                </li>
                <li>Business Hours: 11:00 AM to 6:00 PM (Monday to Friday)</li>
              </ul>
            </article>

            {/* 15. Definitions */}
            <article className="mt-6">
              <h2 className="text-xl font-semibold text-eduBlue mb-3">
                15. Definitions
              </h2>

              <ul className="pl-6 list-disc space-y-1 text-gray-700 text-sm md:text-base">
                <li>
                  <strong>Personal Data:</strong> Any information relating to an
                  identified or identifiable person
                </li>
                <li>
                  <strong>Processing:</strong> Any operation performed on
                  personal data
                </li>
                <li>
                  <strong>Data Controller:</strong> Educerns Technologies Pvt.
                  Ltd.
                </li>
                <li>
                  <strong>Data Subject:</strong> The individual whose personal
                  data is being processed
                </li>
                <li>
                  <strong>Consent:</strong> Freely given, specific, informed
                  indication of wishes
                </li>
              </ul>
            </article>
          </section>
        </main>
    </div>
  );
};

export default PrivacyPolicy;
