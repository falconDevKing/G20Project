import { numberWithCurrencyFormatter } from "@/lib/numberUtils";

const PaymentLogNotification = ({
  first_name,
  currency,
  amount,
  remission_period,
  remissionDate,
  baseUrl,
  chapterName,
}: {
  first_name: string;
  currency: string;
  amount: number;
  remission_period: string;
  remissionDate: string;
  baseUrl: string;
  chapterName: string;
}) => {
  return `<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Public+Sans:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
      rel="stylesheet"
    />
    <link
      href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300..700;1,300..700&family=EB+Garamond:ital,wght@0,400..800;1,400..800&display=swap"
      rel="stylesheet"
    />
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
    <table
      role="presentation"
      style="
        max-width: 765px;
        width: 100%;
        margin: auto;
        font-size: 20px;
        font-family:
          EB Garamond,
          &quot;Public Sans&quot;,
          sans-serif;
        border-collapse: collapse;
      "
    >
      <tr>
        <td class="banner-icon">
          <img
            src="https://ohip-public.s3.eu-west-1.amazonaws.com/GGPLogo.png"
            alt="Logo"
            width="296"
            height="180"
            style="display: block; padding: 0.5rem 0.75rem; margin: 0 auto"
          />
        </td>
      </tr>
      <tr>
        <td
          class="banner-text"
          style="
            background: url(https://ohip-public.s3.eu-west-1.amazonaws.com/Pending+Remission+Banner.png);
            background-size: cover;
            background-position: center;
            border-radius: 0 0 10px 10px;
            padding: 48px 42px;
            height: 120px;
          "
        >
          <p style="font-weight: 700; font-size: 28px; line-height: 28px; color: #fff; text-align: center">
            <span style="font-weight: 700; font-size: 1.5rem; font-style: italic">Remission Approval Pending — Action Required</p>
        </td>
      </tr>
      <tr>
        <td style="padding: 40px; line-height: 26px; font-size: 1.25rem; color: #253858; font-style: normal; font-weight: 400; text-align: center">
          <p>Hello Dear,</p>
          <p>
            ${first_name}'s remission of ${numberWithCurrencyFormatter(currency, amount)} for ${remission_period} was logged for approval. Kindly log on to the
            platform to approve or update accordingly. Here is a summary of the remission.
          </p>
        </td>
      </tr>
      <tr>
        <td style="padding: 0px 40px; line-height: 32px; font-size: 1.25rem; color: #253858; font-style: normal; font-weight: 400">
          <div style="margin: 20px; padding: 20px; font-weight: 500; border: 1px solid #e6e8f0; border-radius: 8px; line-height: 1.5rem">
            <div style="text-align: center; font-weight: 600; padding: 20px; font-size: 18px">Remission for ${remission_period}</div>
            <div style="padding: 20px">
              <div style="display: flex; color: #8083a3; font-size: 1.25rem; line-height: 1.5rem; padding: 8px 0px">
                <div style="width: 30%">Remission Amount</div>
                <div style="width: 70%; text-align: right; font-size: 1.5rem; color: black; font-weight: 600">
                  ${numberWithCurrencyFormatter(currency, amount)}
                </div>
              </div>
              <div style="display: flex; color: #8083a3; font-size: 1.25rem; line-height: 1.5rem; padding: 8px 0px">
                <div style="width: 30%">Date Logged</div>
                <div style="width: 70%; text-align: right; font-size: 1.5rem; color: black">${remissionDate}</div>
              </div>

              <div style="display: flex; color: #8083a3; font-size: 1.25rem; line-height: 1.5rem; padding: 8px 0px">
                <div style="width: 30%">Remitted At</div>
                <div style="width: 70%; text-align: right; font-size: 1.5rem; color: black">${chapterName}</div>
              </div>
            </div>
            <div style="margin: 0px auto; width: 50%; padding: 40px 0px">
              <a
                href="${baseUrl}"
                style="
                  padding: 12px 36px;
                  line-height: 26px;
                  background-color: #cc9e35;
                  color: #fff;
                  box-shadow:
                    0px 2px 4px #00000026,
                    #0000000d;
                  border-radius: 8px;
                  border: 0px;
                  font-weight: 700;
                  font-size: 18px;
                  display: inline-block;
                  text-decoration: none;
                  margin: 0px;
                  text-align: center;
                "
              >
                View Remission Log
              </a>
            </div>
            <br />
          </div>
          <p style="text-align: center">Thank you for helping us maintain excellence in stewardship.</p>
          </td>
      </tr>

      <tr>
        <td style="text-align: center; padding: 24px 40px; line-height: 32px">
          <p style="padding: 0px; color: #253858; font-style: normal; font-weight: 400">
            Warmest Regards, <br />
            <span style="font-weight: bold">GGP Monitoring Team</span>
          </p>
          <p style="font-weight: 400; color: #8083a3; margin-top: 8px; text-align: center; font-size: 20px">
            <span style="display: inline-block; vertical-align: middle; margin-right: 20px; margin-bottom: 8px">
              <img
                src="https://ohip-public.s3.eu-west-1.amazonaws.com/globe.png"
                alt="Globe"
                width="20"
                height="20"
                style="vertical-align: middle; margin-right: 6px"
              />
              <a href="https://www.globalgospelpartnership.org" style="color: #cc9e35; text-decoration: none"> www.globalgospelpartnership.org </a>
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
              <a href="https://www.globalgospelpartnership.org/remit-partnership" style="color: #cc9e35; text-decoration: none">
                www.globalgospelpartnership.org/remit-partnership
              </a>
            </span>
          </p>
          <br />
          <p style="font-weight: 400; color: #8083a3; margin-top: -16px">
            © GGP |
            <a href="mailto:info@globalgospelpartnership.org" style="color: #8083a3; text-decoration: none"> info@globalgospelpartnership.org </a>
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

export default PaymentLogNotification;
