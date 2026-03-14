const UserWeddingAnniversaryMailTemplate = function (first_name: string) {
  return `<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />

    <link href="https://fonts.googleapis.com/css2?family=Public+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet" />

    <link href="https://fonts.googleapis.com/css2?family=EB+Garamond:wght@400;500;600;700&display=swap" rel="stylesheet" />

    <style>
      @media screen and (max-width: 576px) {
        table {
          width: calc(100% - 48px) !important;
          margin: 0 24px !important;
        }

        td {
          padding: 32px 0px 0px !important;
        }

        p {
          font-size: 16px !important;
        }

        .button,
        .button > a {
          width: 100% !important;
        }
      }
    </style>
  </head>

  <body style="margin: 0; padding: 0">
    <table
      role="presentation"
      style="
        max-width: 640px;
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
        <td style="text-align: center">
          <img
            src="https://ohip-public.s3.eu-west-1.amazonaws.com/G20_logo.png"
            alt="Logo"
            width="200"
            height="160"
            style="display: block; padding: 0.5rem 0.75rem; margin: 0 auto"
          />
        </td>
      </tr>

      <tr>
        <td
          style="
            background: url(https://ohip-public.s3.eu-west-1.amazonaws.com/BirthdayAlertBanner.png);
            background-size: cover;
            background-position: center;
            border-radius: 10px;
            padding: 60px 42px;
            height: 120px;
          "
        ></td>
      </tr>

      <tr>
        <td>
          <p style="font-weight: 700; font-size: 28px; line-height: 30px; color: #84693c; text-align: center; padding-top: 24px">Happy Wedding Anniversary!</p>
        </td>
      </tr>

      <tr>
        <td style="padding: 40px; line-height: 26px; font-size: 1.25rem; color: #253858; font-weight: 400; text-align: center">
          <p>Dear ${first_name},</p>

          <p>Today we celebrate with you as you mark another beautiful milestone in your marriage.</p>

          <p>Congratulations on your continued years of love, commitment, and partnership together.</p>

          <p>Your union is a testimony of God&apos;s grace, faithfulness, and the beauty of walking together in love and purpose.</p>

          <p>May the Lord continue to strengthen your bond, increase your joy, and fill your home with peace, favour, and abundance in the years ahead.</p>
        </td>
      </tr>

      <tr>
        <td style="padding: 0px 40px; line-height: 32px; color: #253858">
          <div style="margin: 20px; padding: 24px; border: 1px solid #e6e8f0; border-radius: 8px; text-align: center">
            <div style="font-weight: 600; font-size: 18px; padding-bottom: 16px">A Blessing for Your Marriage</div>

            <p style="font-size: 18px; line-height: 28px; color: #253858">&ldquo;What therefore God hath joined together, let not man put asunder.&rdquo;</p>

            <p style="color: #8083a3; font-size: 16px">&mdash; Mark 10:9</p>
          </div>

          <p style="text-align: center">
            Thank you for being part of the Global Gospel Partnership family. We rejoice with you today and pray for many more blessed years together.
          </p>
        </td>
      </tr>

      <tr>
        <td style="text-align: center; padding: 24px 40px; line-height: 32px">
          <p style="padding: 0px; color: #253858; font-style: normal; font-weight: 400">
            Warmest Regards, <br />
            <span style="font-weight: bold">G20 Team</span>
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
                alt="Payment"
                width="20"
                height="20"
                style="vertical-align: middle; margin-right: 6px"
              />
              <a href="https://www.g20partnership.org/remit-partnership" style="color: #cc9e35; text-decoration: none">
                www.g20partnership.org/remit-partnership
              </a>
            </span>
          </p>

          <br />

          <p style="font-weight: 400; color: #8083a3; margin-top: -16px">
            &copy; GGP |
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

export default UserWeddingAnniversaryMailTemplate;
