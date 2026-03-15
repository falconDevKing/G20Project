import type { ProposedPaymentScheduleRowType } from "@/supabase/modifiedSupabaseTypes";

const formatAmount = (amount: number, currency?: string | null) => {
  const normalizedCurrency = String(currency || "")
    .trim()
    .toUpperCase();

  if (normalizedCurrency) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: normalizedCurrency,
      maximumFractionDigits: 0,
    }).format(Number(amount || 0));
  }

  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 0,
  }).format(Number(amount || 0));
};

const formatScheduleDate = (date: string) => {
  if (!date) {
    return "-";
  }

  const parsedDate = new Date(date);
  if (Number.isNaN(parsedDate.getTime())) {
    return date;
  }

  return parsedDate.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const PostConfirmationTemplate = function (
  name: string,
  code: string,
  hideDefaultPassword: boolean,
  totalAmount = 0,
  scheduleRows: ProposedPaymentScheduleRowType[] = [],
) {
  void hideDefaultPassword;
  const scheduleCurrency = scheduleRows.find((row) => row.currency)?.currency || null;

  const scheduleMarkup = scheduleRows.length
    ? scheduleRows
        .map(
          (row, index) => `
            <tr>
              <td style="padding: 12px; border: 1px solid #E6D3A4; font-size: 16px; color: #253858;">${index + 1}</td>
              <td style="padding: 12px; border: 1px solid #E6D3A4; font-size: 16px; color: #253858;">${formatAmount(Number(row.proposed_amount || 0), row.currency)}</td>
              <td style="padding: 12px; border: 1px solid #E6D3A4; font-size: 16px; color: #253858;">${formatScheduleDate(row.proposed_date || "")}</td>
            </tr>
          `,
        )
        .join("")
    : `
        <tr>
          <td colspan="3" style="padding: 12px; border: 1px solid #E6D3A4; font-size: 16px; color: #253858; text-align: center;">
            No proposed schedule was provided.
          </td>
        </tr>
      `;

  return `<html lang="en">

<head>
  <meta charset="UTF-8" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Public+Sans:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
    rel="stylesheet" />
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300..700;1,300..700&family=EB+Garamond:ital,wght@0,400..800;1,400..800&display=swap" rel="stylesheet" />
  <style>
    @media screen and (max-width: 576px) {
      table {
        width: calc(100% - 48px) !important;
        margin: 0 24px !important;
      }

      td {
        padding: 40px 0px 0px !important;
      }

      .banner-icon {
        padding: 0px !important;
      }

      .banner-text {
        padding: 16px 24px !important;
      }

      .banner-text > p {
        font-size: 20px !important;
      }

      .button,
      .button > a {
        width: 100% !important;
      }

      td > a {
        font-size: 14px !important;
      }

      p {
        font-size: 16px !important;
      }
    }
  </style>
</head>

<body style="margin: 0; padding: 0">
  <table role="presentation" style="
        max-width: 640px;
        width: 100%;
        margin: auto;
        font-size: 20px;
        font-family:
          EB Garamond,
          &quot;Public Sans&quot;,
          sans-serif;
        border-collapse: collapse;
      ">
    <tr>
      <td class="banner-icon">
        <img src="https://ohip-public.s3.eu-west-1.amazonaws.com/G20_logo.png" alt="Logo" width="296" height="180" style="display: block; padding: 0.5rem 0.75rem; margin: 0 auto" />
      </td>
    </tr>
    <tr>
      <td class="banner-text" style="
            background: url(https://ohip-public.s3.eu-west-1.amazonaws.com/WelcomeToGGP.png);
            background-size: cover;
            background-position: center;
            border-radius: 10px;
            padding: 60px 42px;
            height: 120px;
          ">
      </td>
    </tr>
    <tr>
      <td>
        <p style="font-weight: 700; font-size: 28px; line-height: 28px; color: #84693C; text-align: center; padding-top: 24px;">
          <span style="font-weight: 700; font-size: 2rem;">Welcome to GGP! You're Officially a GGP Partner
        </p>
      </td>
    </tr>
    <tr>
      <td style="padding: 40px; line-height: 26px; font-size: 20px; color: #253858; font-style: normal; font-weight: 400">
          <p>Hi ${name},</p>
          <p>Welcome to G20 Partnership!</p>
          <p>
            Your email has been successfully verified, and we're honored to officially welcome you into this life-transforming journey of Partnering with the
            Prophet of God to take the Gospel to the nations of the earth.
          </p>
          <p>
            As you walk with us, remember your partnership carries deep purpose. It's more than a giving; it's a prophetic step toward changing lives
            and expanding the Kingdom of God across the globe.
          </p>

          <p>Below is your unique Code, and details of your partnership for your reference:</p>
          <div class="button" style="width: 70%; margin: auto">
            <div
              style="
                background-color: #cc9e35;
                border: none;
                border-radius: 8px;
                padding: 12px 16px;
                font-size: 16px;
                font-weight: 300;
                margin-top: 20px;
                cursor: pointer;
                color: #fff;
                text-decoration: none;
                box-sizing: border-box;
                width: 100%;
                display: inline-block;
                text-align: center;
              "
            >
              ${code}
            </div>
          </div>


          <div style="margin-top: 28px; padding: 20px; border: 1px solid #E6D3A4; border-radius: 12px; background: #FCF9EF;">
            <p style="margin: 0 0 12px; font-weight: 700; font-size: 22px; color: #84693C;">Your G20 Commitment</p>
            <p style="margin: 0; font-size: 18px; color: #253858;">
              Total G20 Amount: <span style="font-weight: 700;">${formatAmount(totalAmount, scheduleCurrency)}</span>
            </p>
          </div>

          <div style="margin-top: 28px;">
            <p style="margin: 0 0 12px; font-weight: 700; font-size: 22px; color: #84693C;">Your Proposed Schedule</p>
            <table role="presentation" style="width: 100%; border-collapse: collapse; border-radius: 12px; overflow: hidden;">
              <thead>
                <tr style="background: #F3E8C6;">
                  <th style="padding: 12px; border: 1px solid #E6D3A4; text-align: left; font-size: 16px; color: #253858;">Line</th>
                  <th style="padding: 12px; border: 1px solid #E6D3A4; text-align: left; font-size: 16px; color: #253858;">Amount</th>
                  <th style="padding: 12px; border: 1px solid #E6D3A4; text-align: left; font-size: 16px; color: #253858;">Proposed Date</th>
                </tr>
              </thead>
              <tbody>
                ${scheduleMarkup}
              </tbody>
            </table>
          </div>

          <p>Please keep the handy, as it helps us serve you better and ensures smoother engagement with the G20 Team.</p>

          <p>Thank you for saying "YES" to the call. We're grateful to walk this path alongside you.</p>
        </td>
    </tr>

    <tr>
      <td style="text-align: center; padding: 24px 40px; line-height: 32px">
        <p style="padding: 0px; color: #253858; font-style: normal; font-weight: 400">
          Warmest Regards, <br />
          <span style="font-weight: bold">G20 Team</span>
        </p>
        <span style="display: inline-block; vertical-align: middle; margin-right: 20px; margin-bottom: 8px">
              <img
                src="https://ohip-public.s3.eu-west-1.amazonaws.com/globe.png"
                alt="Globe"
                width="20"
                height="20"
                style="vertical-align: middle; margin-right: 6px"
              />
              <a href="https://www.g20partnership.org" style="color: #cc9e35; text-decoration: none"> www.g20partnership.org </a>
            </span>
            <span style="display: inline-block; vertical-align: middle; margin-right: 20px; margin-bottom: 8px">
              <img
                src="https://ohip-public.s3.eu-west-1.amazonaws.com/mail.png"
                alt="Mail"
                width="20"
                height="20"
                style="vertical-align: middle; margin-right: 6px"
              />
              <a href="mailto:support@globalgospelpartnership.org" style="color: #cc9e35; text-decoration: none"> support@globalgospelpartnership.org </a>
            </span>
            <span style="display: inline-block; vertical-align: middle; margin-right: 20px; margin-bottom: 8px">
              <img
                src="https://ohip-public.s3.eu-west-1.amazonaws.com/credit-card.png"
                alt="Mail"
                width="20"
                height="20"
                style="vertical-align: middle; margin-right: 6px"
              />
              <a href="https://www.g20partnership.org/remit-partnership" style="color: #cc9e35; text-decoration: none">
                www.g20partnership.org/remit-partnership
              </a>
            </span>
        <br />
        <p style="font-weight: 400; color: #8083a3; margin-top: -16px; font-size: 20px">
          © GGP |
          <a href="mailto:info@g20partnership.org" style="color: #8083a3; text-decoration: none"> info@g20partnership.org </a>
          <br />
          Together in faith, always Partnering with the Prophet
        </p>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
};

export default PostConfirmationTemplate;
