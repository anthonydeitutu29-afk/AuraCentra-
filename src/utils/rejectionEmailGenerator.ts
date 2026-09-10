import { Business, RejectionEmailTemplate } from '../types';

export interface GenerateRejectionEmailOptions {
  business: Business;
  reason: string;
  resolutionGuide?: string;
  adminNotes?: string;
  directDashboardUrl?: string;
}

/**
 * Automated Email Template Generator for Business Verification Rejections
 * Generates both high-fidelity HTML and plaintext email templates,
 * complete with rejection reason, actionable resolution guide, and direct
 * link back to the business owner dashboard to edit and resubmit.
 */
export function generateRejectionEmailTemplate(
  options: GenerateRejectionEmailOptions
): RejectionEmailTemplate {
  const { business, reason, resolutionGuide, adminNotes } = options;

  // Determine site origin for absolute routing
  const origin = typeof window !== 'undefined' && window.location.origin
    ? window.location.origin
    : 'https://auracentra.com';

  const recipientEmail = business.ownerEmail || business.email || 'owner@business.com';
  const recipientName = business.name || 'Business Owner';
  const businessId = business.id;
  const businessCategory = business.category || 'General Enterprise';
  const businessCity = business.city || 'Accra';
  const businessRegion = business.region || 'Greater Accra';

  // Direct link back to the business dashboard to edit and resubmit
  const directDashboardUrl = options.directDashboardUrl || `${origin}/#dashboard-${businessId}`;

  const finalResolution = resolutionGuide && resolutionGuide.trim().length > 0
    ? resolutionGuide.trim()
    : 'Please sign in to your dashboard, update the flagged business details or re-upload your Ghana Card/GhanaPost GPS verification documents, and click "Resubmit for Verification".';

  const subject = `Action Required: Verification Update for ${business.name} — AuraCentra Ghana`;
  const generatedAt = new Date().toISOString();
  const formattedDate = new Date().toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  // 1. Plain Text Email Body
  const textBody = [
    `=============================================================`,
    `🇬🇭 AURACENTRA GHANA — VERIFICATION DESK NOTIFICATION`,
    `=============================================================`,
    ``,
    `Hello ${recipientName},`,
    ``,
    `Thank you for submitting your business listing to the AuraCentra Ghana Directory.`,
    `Our administrative verification desk has reviewed your submission for:`,
    `"${business.name}" (ID: ${businessId}, Location: ${businessCity}, ${businessRegion}).`,
    ``,
    `At this time, your listing requires revision before it can be approved and published live on our nationwide directory.`,
    ``,
    `-------------------------------------------------------------`,
    `❌ REASON FOR REVISION REQUIRED:`,
    `-------------------------------------------------------------`,
    `${reason.trim()}`,
    ``,
    `-------------------------------------------------------------`,
    `🛠️ HOW TO RESOLVE & GET APPROVED:`,
    `-------------------------------------------------------------`,
    `${finalResolution}`,
    adminNotes ? `\n📝 Internal Review Note: ${adminNotes.trim()}` : '',
    ``,
    `-------------------------------------------------------------`,
    `🔗 DIRECT LINK TO EDIT & RESUBMIT:`,
    `-------------------------------------------------------------`,
    `Use the secure link below to open your business dashboard directly,`,
    `review the feedback, update your information, and click "Resubmit for Verification":`,
    ``,
    `${directDashboardUrl}`,
    ``,
    `-------------------------------------------------------------`,
    `📋 QUICK RESUBMISSION STEPS:`,
    `-------------------------------------------------------------`,
    `1. Click the direct link above to open your AuraCentra Business Dashboard.`,
    `2. Go to the "Profile" or "Verification" section to edit the highlighted items.`,
    `3. Check that your Ghana Card is clearly legible and GhanaPost GPS address is accurate.`,
    `4. Click "Resubmit for Verification" to return your application to the active review queue.`,
    ``,
    `-------------------------------------------------------------`,
    `📞 NEED ASSISTANCE?`,
    `-------------------------------------------------------------`,
    `Our administrative verification team is available to assist you:`,
    `• Phone Support: 0508203673`,
    `• WhatsApp Desk: +233 50 820 3673`,
    `• Email: tonysdigitalmarketing@gmail.com / support@auracentra.com`,
    `• Hours: Monday - Friday (08:00 - 18:00 GMT)`,
    ``,
    `Warm regards,`,
    `AuraCentra Ghana Administrative Review Desk`,
    `Accra & Ho, Ghana`,
    `https://auracentra.com`,
    `=============================================================`
  ].filter(Boolean).join('\n');

  // 2. High-Fidelity Responsive HTML Email Body
  const htmlBody = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(subject)}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; color: #1e293b;">
  <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f1f5f9; padding: 24px 12px;">
    <tr>
      <td align="center">
        <!-- Main Card Container -->
        <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 620px; background-color: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(15, 23, 42, 0.08), 0 8px 10px -6px rgba(15, 23, 42, 0.04); border: 1px solid #e2e8f0;">
          
          <!-- Header Banner -->
          <tr>
            <td style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); padding: 32px 32px 28px 32px; text-align: left;">
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td>
                    <div style="display: inline-block; padding: 6px 12px; background-color: rgba(245, 158, 11, 0.15); border: 1px solid rgba(245, 158, 11, 0.4); border-radius: 100px; color: #fbbf24; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 12px;">
                      🇬🇭 AuraCentra Ghana Directory
                    </div>
                    <h1 style="margin: 0; color: #ffffff; font-size: 22px; font-weight: 800; line-height: 1.3;">
                      Verification Status Update
                    </h1>
                    <p style="margin: 6px 0 0 0; color: #94a3b8; font-size: 13px;">
                      Administrative Review Desk • ${formattedDate}
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Action Required Notice Pill -->
          <tr>
            <td style="padding: 24px 32px 0 32px;">
              <div style="background-color: #fff1f2; border: 1px solid #fecdd3; border-left: 5px solid #e11d48; border-radius: 12px; padding: 14px 18px;">
                <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                  <tr>
                    <td valign="top" width="24" style="padding-right: 12px;">
                      <span style="font-size: 20px;">⚠️</span>
                    </td>
                    <td>
                      <div style="font-weight: 700; color: #9f1239; font-size: 14px; margin-bottom: 2px;">
                        Action Required: Listing Revision Needed
                      </div>
                      <div style="color: #be123c; font-size: 12px; line-height: 1.4;">
                        Your enlistment has been reviewed and requires updates before it can be officially approved and published live.
                      </div>
                    </td>
                  </tr>
                </table>
              </div>
            </td>
          </tr>

          <!-- Content Body -->
          <tr>
            <td style="padding: 24px 32px 32px 32px;">
              
              <p style="margin: 0 0 16px 0; font-size: 15px; line-height: 1.6; color: #334155;">
                Hello <strong>${escapeHtml(recipientName)}</strong>,
              </p>
              <p style="margin: 0 0 20px 0; font-size: 14px; line-height: 1.6; color: #475569;">
                Thank you for submitting your business enlistment to <strong>AuraCentra Ghana</strong>. Our verification team conducted a standard compliance review for <strong>"${escapeHtml(business.name)}"</strong> and found items that need your attention.
              </p>

              <!-- Listing Info Box -->
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; margin-bottom: 20px;">
                <tr>
                  <td style="padding: 14px 18px;">
                    <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="font-size: 12px; color: #64748b;">
                      <tr>
                        <td width="35%" style="padding: 4px 0;"><strong>Business Name:</strong></td>
                        <td style="padding: 4px 0; color: #0f172a; font-weight: 600;">${escapeHtml(business.name)}</td>
                      </tr>
                      <tr>
                        <td style="padding: 4px 0;"><strong>Category:</strong></td>
                        <td style="padding: 4px 0; color: #0f172a;">${escapeHtml(businessCategory)}</td>
                      </tr>
                      <tr>
                        <td style="padding: 4px 0;"><strong>Location:</strong></td>
                        <td style="padding: 4px 0; color: #0f172a;">${escapeHtml(businessCity)}, ${escapeHtml(businessRegion)}</td>
                      </tr>
                      <tr>
                        <td style="padding: 4px 0;"><strong>Reference ID:</strong></td>
                        <td style="padding: 4px 0; color: #0284c7; font-family: monospace; font-size: 11px;">${escapeHtml(businessId)}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Rejection Reason Highlight Box -->
              <div style="margin-bottom: 20px;">
                <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; color: #e11d48; letter-spacing: 0.05em; margin-bottom: 6px;">
                  ❌ Reason for Revision
                </div>
                <div style="background-color: #fef2f2; border: 1px solid #fee2e2; border-radius: 12px; padding: 16px; color: #991b1b; font-size: 13px; line-height: 1.6; font-weight: 500;">
                  ${escapeHtml(reason.trim())}
                </div>
              </div>

              <!-- Actionable Resolution Guide -->
              <div style="margin-bottom: 24px;">
                <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; color: #059669; letter-spacing: 0.05em; margin-bottom: 6px;">
                  🛠️ How to Resolve & Get Approved
                </div>
                <div style="background-color: #ecfdf5; border: 1px solid #d1fae5; border-radius: 12px; padding: 16px; color: #065f46; font-size: 13px; line-height: 1.6;">
                  ${escapeHtml(finalResolution)}
                </div>
              </div>

              ${adminNotes ? `
              <!-- Admin Review Note -->
              <div style="margin-bottom: 24px;">
                <div style="font-size: 11px; font-weight: 700; text-transform: uppercase; color: #64748b; letter-spacing: 0.05em; margin-bottom: 6px;">
                  📝 Review Desk Note
                </div>
                <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 12px 16px; color: #475569; font-size: 12px; line-height: 1.5; font-style: italic;">
                  ${escapeHtml(adminNotes.trim())}
                </div>
              </div>
              ` : ''}

              <!-- Direct Link CTA Button -->
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="margin: 28px 0;">
                <tr>
                  <td align="center">
                    <a href="${directDashboardUrl}" target="_blank" rel="noopener noreferrer" style="display: inline-block; background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); color: #ffffff; text-decoration: none; font-size: 15px; font-weight: 700; padding: 16px 36px; border-radius: 14px; box-shadow: 0 4px 14px rgba(37, 99, 235, 0.35); text-align: center; border: 1px solid #1d4ed8;">
                      👉 Open Business Dashboard & Edit Listing
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Fallback Direct URL Box -->
              <div style="background-color: #f8fafc; border: 1px dashed #cbd5e1; border-radius: 10px; padding: 12px 14px; margin-bottom: 24px;">
                <div style="font-size: 11px; color: #64748b; margin-bottom: 4px;">
                  If the button does not open directly, copy and paste this link in your browser:
                </div>
                <a href="${directDashboardUrl}" style="color: #2563eb; font-size: 12px; word-break: break-all; text-decoration: underline;">
                  ${directDashboardUrl}
                </a>
              </div>

              <!-- Quick Checklist -->
              <div style="border-top: 1px solid #e2e8f0; padding-top: 20px; margin-top: 20px;">
                <div style="font-size: 13px; font-weight: 700; color: #0f172a; margin-bottom: 8px;">
                  Next Steps to Resubmit:
                </div>
                <ol style="margin: 0; padding-left: 18px; font-size: 12px; color: #475569; line-height: 1.6;">
                  <li style="margin-bottom: 4px;">Open your business dashboard using the link above.</li>
                  <li style="margin-bottom: 4px;">Update your details, contact numbers, or re-upload your Ghana Card.</li>
                  <li style="margin-bottom: 4px;">Click <strong>"Resubmit for Verification"</strong> to place your business back in the active queue.</li>
                </ol>
              </div>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #0f172a; padding: 24px 32px; border-top: 1px solid #1e293b; color: #94a3b8; font-size: 12px; text-align: center;">
              <p style="margin: 0 0 8px 0; color: #cbd5e1; font-weight: 600;">
                AuraCentra Ghana — Connecting Trust Across Ghana 🇬🇭
              </p>
              <p style="margin: 0 0 12px 0; line-height: 1.5;">
                Support Hotline: <a href="tel:0508203673" style="color: #60a5fa; text-decoration: none;">0508203673</a> • 
                WhatsApp: <a href="https://wa.me/233508203673" style="color: #60a5fa; text-decoration: none;">+233 50 820 3673</a> • 
                Email: <a href="mailto:tonysdigitalmarketing@gmail.com" style="color: #60a5fa; text-decoration: none;">tonysdigitalmarketing@gmail.com</a>
              </p>
              <p style="margin: 0; font-size: 11px; color: #64748b;">
                © ${new Date().getFullYear()} AuraCentra Ghana Economic Directory. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();

  // 3. Mailto URL for quick 1-click administrative dispatch from mail client
  const mailtoUrl = `mailto:${encodeURIComponent(recipientEmail)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(textBody)}`;

  return {
    recipientEmail,
    recipientName,
    businessName: business.name,
    businessId: business.id,
    subject,
    textBody,
    htmlBody,
    directDashboardUrl,
    mailtoUrl,
    generatedAt,
  };
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
