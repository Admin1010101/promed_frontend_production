import React from 'react';

const BAAAgreementText = ({ formData }) => (
  <div className="max-h-96 overflow-y-auto p-4 border rounded-lg bg-gray-50 text-sm text-gray-600 space-y-4">
    {/* BAA Header */}
    <h3 className="text-md font-bold text-gray-800 border-b pb-1 text-center">
      HIPAA-Compliant Agreement Between Distributor and Provider
    </h3>
    <p>
      This Business Associate Agreement ("Agreement") is entered into as of{' '}
      <span className="font-bold text-gray-900">
        ({formData?.effectiveDate || "Effective Date"})
      </span>{' '}
      by and between: ProMed Health Plus, LLC ("Business Associate") and{' '}
      <span className="font-bold text-gray-900">
        ({formData?.providerCompanyName || "Covered Entity or Provider"})
      </span>
      , collectively referred to as the "Parties."
    </p>

    {/* BAA Section 1: Purpose */}
    <p className="font-bold text-gray-800">1. Purpose:</p>
    <p>
      This Agreement ensures compliance with the Health Insurance
      Portability and Accountability Act of 1996 (HIPAA), the HITECH Act,
      and related regulations. It governs how ProMed Health Plus, LLC
      ("ProMed") may receive, use, or disclose Protected Health Information
      (PHI) while performing services for the Provider, including insurance
      verification (IVR) submissions, billing assistance, order management,
      and logistics related to wound-care biologic products.
    </p>

    {/* BAA Section 2: Definitions */}
    <p className="font-bold text-gray-800">2. Definitions:</p>
    <ul className="list-disc list-inside ml-4 space-y-1">
      <li>
        <strong>Covered Entity:</strong> The Provider, as defined by 45 CFR § 160.103.
      </li>
      <li><strong>Business Associate:</strong> ProMed Health Plus, LLC.</li>
      <li><strong>PHI:</strong> Protected Health Information as defined by HIPAA.</li>
      <li>
        <strong>Breach:</strong> Any impermissible use or disclosure of PHI not permitted
        by this Agreement or HIPAA.
      </li>
      <li>
        <strong>Portal:</strong> The secure ProMed online platform through which the
        Provider submits IVRs, documentation, and orders.
      </li>
    </ul>

    {/* BAA Section 3: Permitted Uses and Disclosures */}
    <p className="font-bold text-gray-800">
      3. Permitted Uses and Disclosures:
    </p>
    <p>ProMed may use or disclose PHI only to:</p>
    <ul className="list-disc list-inside ml-4 space-y-1">
      <li>
        Perform services for the Provider such as IVR submissions, order
        fulfillment, billing, and communication with manufacturers.
      </li>
      <li>Comply with applicable law, court orders, or lawful requests.</li>
      <li>
        De-identify PHI for internal quality improvement or analytics, never
        for marketing or resale.
      </li>
    </ul>
    <p>
      All uses and disclosures shall comply with the minimum necessary
      standard required by 45 CFR § 164.502(b).
    </p>

    {/* BAA Section 4: Safeguards */}
    <p className="font-bold text-gray-800">4. Safeguards</p>
    <p>
      (A) General Safeguards: ProMed shall implement administrative,
      physical, and technical safeguards consistent with 45 CFR §§
      164.308–312 to protect the confidentiality, integrity, and
      availability of PHI. Subcontractors who receive PHI from ProMed must
      sign written agreements imposing the same restrictions and
      protections.
    </p>
    <p>
      (B) Portal and Electronic Access: ProMed maintains a secure,
      HIPAA-compliant Provider Portal that enables the Provider to submit
      IVRs, patient documentation, order forms, and related data necessary
      for product distribution and billing. ProMed will implement and
      maintain appropriate safeguards within the Portal, including but not
      limited to:
    </p>
    <ul className="list-disc list-inside ml-4 space-y-1">
      <li>Encrypted data transmission (SSL/TLS)</li>
      <li>Secure user authentication and role-based access control</li>
      <li>Continuous system monitoring and audit logs</li>
      <li>Routine data backup and disaster-recovery measures</li>
      <li>Hosting on HIPAA-compliant infrastructure</li>
    </ul>
    <p>The Provider agrees to:</p>
    <ol className="list-decimal list-inside ml-4 space-y-1">
      <li>Grant Portal access only to authorized staff;</li>
      <li>Keep login credentials confidential; and</li>
      <li>
        Promptly report any unauthorized access, suspected breach, or staff
        changes to ProMed.
      </li>
    </ol>
    <p>
      Use of the Portal constitutes acknowledgment of shared HIPAA
      responsibilities between the Parties.
    </p>

    {/* BAA Section 5: Reporting Obligations */}
    <p className="font-bold text-gray-800">5. Reporting Obligations:</p>
    <p>
      ProMed shall notify the Provider within ten (10) business days of
      discovering any unauthorized use or disclosure of PHI, security
      incident, or breach. The notice will describe:
    </p>
    <ul className="list-disc list-inside ml-4 space-y-1">
      <li>The nature of the PHI involved;</li>
      <li>The date and circumstances of the breach;</li>
      <li>Mitigation actions taken; and</li>
      <li>Preventive measures implemented.</li>
    </ul>

    {/* BAA Section 6: Access, Amendment, and Accounting */}
    <p className="font-bold text-gray-800">
      6. Access, Amendment, and Accounting:
    </p>
    <p>Upon request, ProMed shall:</p>
    <ul className="list-disc list-inside ml-4 space-y-1">
      <li>Provide access to PHI as required by 45 CFR § 164.524;</li>
      <li>
        Make amendments to PHI as directed under 45 CFR § 164.526; and
      </li>
      <li>
        Maintain and furnish an accounting of disclosures as required under
        45 CFR § 164.528.
      </li>
    </ul>

    {/* BAA Section 7: Term and Termination */}
    <p className="font-bold text-gray-800">7. Term and Termination:</p>
    <p>
      (A) Term: This Agreement remains effective until terminated by either
      Party with 30 days' written notice.
    </p>
    <p>
      (B) Termination for Cause: The Provider may terminate immediately if
      ProMed materially breaches this Agreement and fails to cure the breach
      within 30 days of notice.
    </p>
    <p>
      (C) Return or Destruction of PHI: Upon termination, ProMed will return
      or destroy all PHI if feasible; otherwise, it will continue to protect
      the PHI under this Agreement.
    </p>

    {/* BAA Section 8: Indemnification */}
    <p className="font-bold text-gray-800">8. Indemnification:</p>
    <p>
      Each Party shall indemnify and hold harmless the other from any claim,
      loss, or liability arising from its own negligence, willful
      misconduct, or violation of HIPAA or this Agreement.
    </p>

    {/* BAA Section 9: Miscellaneous */}
    <p className="font-bold text-gray-800">9. Miscellaneous:</p>
    <p>
      (A) This Agreement shall be governed by the laws of the State of
      [State].
    </p>
    <p>
      (B) The Parties agree that a valid electronic signature or digital
      execution shall be treated as binding.
    </p>
    <p>(C) This Agreement supersedes any prior BAA between the Parties.</p>
    <p>
      (D) The obligations herein shall survive termination to the extent PHI
      remains in either Party's possession.
    </p>

    {/* BAA Section 10: Incorporation by Reference */}
    <p className="font-bold text-gray-800">
      10. Incorporation by Reference
    </p>
    <p>
      This BAA is incorporated by reference into any existing or future
      Provider Sales Agreement between the Parties, and compliance with this
      BAA is a condition of continued business with ProMed Health Plus, LLC.
    </p>

    <hr className="my-6 border-t border-gray-300" />

    {/* Purchase Agreement Header */}
    <h3 className="text-md font-bold text-gray-800 border-b pb-1">
      ProMed Health Plus – Purchase Agreement
    </h3>
    <p>
      This Sales Agreement ("Agreement") is entered into by and between
      ProMed Health Plus, LLC ("ProMed"), a medical product distributor, and
      the undersigned medical provider or facility ("Provider"),
      collectively referred to as the "Parties."
    </p>

    {/* Purchase Section 1: Terms of Sale */}
    <p className="font-bold text-gray-800">1. Terms of Sale:</p>
    <p>
      The provider agrees to purchase wound care and skin substitute
      products offered by ProMed and its affiliated manufacturers. All
      product orders placed by the provider shall be subject to the terms
      outlined herein.
    </p>

    {/* Purchase Section 2: Purchasing */}
    <p className="font-bold text-gray-800">2. Purchasing:</p>
    <p>
      The final price for the Provider on all qualified product purchases
      made through ProMed shall be calculated as a percentage of the
      Medicare payment limit as specified in the CMS published quarterly ASP
      pricing file. The applicable percentage is determined by the date
      payment is received by ProMed, as follows:
    </p>
    <ul className="list-disc list-inside ml-4 space-y-1">
      <li>
        For payment received within 30 days of the invoice date, the
        Provider's price shall be <strong>50% of the Medicare payment limit.</strong>
      </li>
      <li>
        For payment received after 31 days, the Provider's price shall be
        <strong>60% of the Medicare payment limit.</strong>
      </li>
    </ul>
    <p>
      The pricing terms may be modified by ProMed with 30 days' written
      notice.
    </p>

    {/* Purchase Section 3: Payment Terms */}
    <p className="font-bold text-gray-800">3. Payment Terms:</p>
    <p>
      Unless otherwise agreed upon in writing, payment is due within 30 days
      of the delivery date. Payments can be made via check, ACH or credit
      card. The provider agrees to pay all reasonable costs of collection,
      including legal fees, if applicable.
    </p>

    {/* Purchase Section 4: Use of Manufacturers */}
    <p className="font-bold text-gray-800">4. Use of Manufacturers:</p>
    <p>
      The provider acknowledges and agrees that ProMed may fulfill product
      orders using one or more third-party manufacturers or distributors.
      The provider agrees to be bound by the sales agreements and
      fulfillment terms of these manufacturers, where applicable. ProMed
      shall not be held liable for any independent obligations, product
      warranties, or operational issues related to these manufacturers. Any
      disputes concerning product quality, delays, or terms outside ProMed's
      control must be directed to the appropriate manufacturer.
    </p>

    {/* Purchase Section 5: Product Responsibility */}
    <p className="font-bold text-gray-800">5. Product Responsibility:</p>
    <p>
      Unused items may be eligible for return only if unopened and returned
      promptly in accordance with the manufacturer's policies. The provider
      may be financially responsible for improperly returned or non-returned
      items.
    </p>

    {/* Purchase Section 6: Termination */}
    <p className="font-bold text-gray-800">6. Termination:</p>
    <p>
      ProMed and/or its manufacturers reserve the right to limit or
      terminate credit terms at any time. ProMed may modify the terms of
      this agreement with 30 day written notice.
    </p>

    {/* Purchase Section 7: Representations */}
    <p className="font-bold text-gray-800">7. Representations:</p>
    <p>
      The provider states that the information submitted to ProMed is true
      and accurate and acknowledges that this agreement is entered into for
      the purpose of establishing a purchasing relationship with ProMed and
      its designated manufacturers.
    </p>

    <p className="mt-4 text-center font-semibold text-gray-700">
      END OF AGREEMENT TEXT
    </p>

    <h3 className="text-center font-semibold text-xs mt-2">
      ProMed Health Plus | 30839 E Thousand Oaks Blvd Westlake Village, CA
      91362 | 267-235-1092 | www.promedhealthplus.com
    </h3>
  </div>
);

export default BAAAgreementText;