import React from "react";

const CookiePolicy = () => {
  return (
    <div className="min-h-screen flex justify-center items-start bg-gray-50 py-12 px-6">
      {/* Main Content */}
      <main className="flex flex-col max-w-4xl border border-gray-300 rounded-lg mx-auto px-6 py-10">
        {/* Page Title */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-eduBlue">
            Cookie Policy – EduPrint
          </h1>
          <h3 className="text-black text-sm pl-2">
                  Last Updated: 31-Oct-2025
                </h3>
          <p className="text-gray-600 mt-3 text-sm md:text-base max-w-3xl mx-auto">
            This Cookie Policy explains how EduCerns Technologies Pvt. Ltd. (“we”, “our”, “us”) uses cookies and similar technologies on the EduPrint platform. By using EduPrint, you consent to the use of cookies as described in this policy.
          </p>
          
        </div>

        {/* Policy Content */}
        <section className="bg-white shadow-sm rounded-xl p-6 border border-gray-100 space-y-8">
          {/* 1. What Are Cookies */}
          <article>
            <h2 className="text-xl font-semibold text-eduBlue mb-3">
              1. What Are Cookies?
            </h2>
            
            <p className="text-gray-700 text-sm md:text-base leading-relaxed">
              Cookies are small text files stored on your device (computer, tablet, or smartphone) when you visit a website. They help websites remember your actions and preferences—such as login information, language selection, and display settings—making your experience more efficient and personalized.

            </p>
          </article>

          {/* 2. How We Use Cookies */}
          <article>
            <h2 className="text-xl font-semibold text-eduBlue mb-3">
              2. How We Use Cookies
            </h2>
            <p className="text-gray-700 text-sm md:text-base mb-2">
              EduPrint uses cookies to enhance functionality, improve performance, and analyze user interactions. These cookies help us:
            </p>
            <ul className="pl-6 list-disc text-gray-700 text-sm md:text-base space-y-1">
              <li>Recognize you when you log in and maintain your session</li>
              <li>Remember your preferences and settings</li>
              <li>Analyze how visitors use our platform to improve performance.</li>
              <li>Ensure secure logins and prevent fraudulent activity.</li>
              <li>Provide personalized content, product recommendations, and relevant advertisements.</li>
            </ul>
          </article>

          {/* 3. Types of Cookies We Use */}
          <article>
            <h2 className="text-xl font-semibold text-eduBlue mb-3">
              3. Types of Cookies We Use
            </h2>

            <h3 className="text-lg font-medium text-black mt-4">
              3.1 Strictly Necessary Cookies
            </h3>
            <p className="text-gray-700 text-sm md:text-base">
             Essential for the operation of EduPrint. They enable secure login, cart functionality, and access to protected areas. Without these, certain services cannot be provided.
            </p>

            <h3 className="text-lg font-medium text-black mt-4">
              3.2 Performance Cookies
            </h3>
            <p className="text-gray-700 text-sm md:text-base">
             These collect anonymous data on how visitors interact with EduPrint — for example, which pages are most visited or if users encounter any errors. This helps us enhance platform reliability and efficiency.
            </p>

            <h3 className="text-lg font-medium text-black mt-4">
              3.3 Functional Cookies
            </h3>
            <p className="text-gray-700 text-sm md:text-base">
             Used to remember user preferences such as region, username, and display settings — improving personalization and ease of use.
            </p>

            <h3 className="text-lg font-medium text-black mt-4">
              3.4 Targeting & Advertising Cookies
            </h3>
            <p className="text-gray-700 text-sm md:text-base">
             These track browsing patterns to serve more relevant ads and recommendations. They may also be set by third-party advertising networks.
            </p>
          </article>

          {/* 4. Third-Party Cookies */}
          <article>
            <h2 className="text-xl font-semibold text-eduBlue mb-3">
              4. Third-Party Cookies
            </h2>
            <p className="text-gray-700 text-sm md:text-base">
             We may allow trusted third-party services to place cookies for analytics, payment processing, and social media integration, such as:
            </p>
            <ul className="pl-6 list-disc text-gray-700 text-sm md:text-base space-y-1 mt-2">
              <li>Google Analytics – to measure and analyze website usage.</li>
              <li>Payment Gateways – for secure transaction processing and fraud prevention.</li>
              <li>Social Media Platforms – for login, sharing, and engagement features.</li>
            </ul>
            <p>These third parties may collect data across websites for their own purposes. Please review their privacy policies for more information.</p>
          </article>

          {/* 5. Managing Cookies */}
          <article>
            <h2 className="text-xl font-semibold text-eduBlue mb-3">
              5. Managing Your Cookie Preferences
            </h2>
            <p className="text-gray-700 text-sm md:text-base mb-2">
             You can manage or disable cookies through your browser settings. However, disabling certain cookies may affect website functionality or restrict access to some features.
            </p>
            <ul className="pl-6 list-disc text-gray-700 text-sm md:text-base space-y-1">
              <li>
                View, block, or delete cookies through browser settings.
              </li>
              <li>
                Set your browser to alert you when cookies are used.
              </li>
              <li>
                Withdraw consent at any time via our on-site cookie banner.
              </li>
            </ul>
          </article>

          {/* 6. Data Collected Through Cookies */}
          <article>
            <h2 className="text-xl font-semibold text-eduBlue mb-3">
              6. Data Collected Through Cookies
            </h2>
            <p className="text-gray-700 text-sm md:text-base">
The cookies we use may collect:            </p>
            <ul className="pl-6 list-disc text-gray-700 text-sm md:text-base space-y-1">
              <li>Device and browser information (IP address, OS, browser type).</li>
              <li>Session details (pages visited, clicks, navigation flow).</li>
              <li>Traffic sources and referring URLs.</li>
              <li>User interactions for analytics and personalization.</li>
            </ul>
          </article>

          {/* 7. Data Retention */}
          <article>
            <h2 className="text-xl font-semibold text-eduBlue mb-3">
              7. Cookie Retention Period
            </h2>
           
            <ul className="pl-6 list-disc text-gray-700 text-sm md:text-base space-y-1">
              <li>
               Session Cookies: Automatically deleted after you close your browser.
              </li>
              <li>
                Persistent Cookies: Remain stored until they expire or are manually removed.

              </li>
            </ul>
          </article>

          {/* 8. Updates to This Policy */}
          <article>
            <h2 className="text-xl font-semibold text-eduBlue mb-3">
              8. Updates to This Cookie Policy
            </h2>
            <p className="text-gray-700 text-sm md:text-base">
              We may update this policy periodically to reflect changes in our cookie usage, services, or legal requirements. The revised version will be posted on this page with a new “Last Updated” date.
            </p>
          </article>

          {/* 9. Contact Information */}
          <article>
            <h2 className="text-xl font-semibold text-eduBlue mb-3">
              9. Contact Information
            </h2>
            <p className="text-gray-700 text-sm md:text-base mb-2">        
For any questions, feedback, or concerns regarding this Cookie Policy, please contact:
            </p>
            <ul className="pl-6 list-disc text-gray-700 text-sm md:text-base">
              <li>
                <strong>Educerns Technologies Pvt. Ltd.</strong>
              </li>
              <li>
                Address: 472, Kasar Ali, Opp. Markandeshwar Mandir, Anjur,
                Bhiwandi, Thane, Maharashtra – 421302
              </li>
              <li>
                Email:{" "}
                <span className="text-blue-600">support@educerns.org</span>
              </li>
              <li>Phone: +91 - 8855856055</li>
              <li>Last Updated: 31-Oct-2025</li>
            </ul>
          </article>
        </section>
      </main>
    </div>
  );
};

export default CookiePolicy;
