const DivisionBirthdayMailTemplate = function (firstName: string) {
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
    <table role="presentation" style="max-width: 765px; width: 100%; margin: auto; font-family: &quot;Public Sans&quot;, sans-serif; border-collapse: collapse">
      <tr>
        <td class="banner-icon">
          <img
            src="https://ohip-public.s3.eu-west-1.amazonaws.com/G20_logo.png"
           alt="Logo"
            width="180"
            style="height: auto; display: block; padding: 0.5rem 0.75rem"
          />
        </td>
      </tr>
      <tr>
        <td
          class="banner-text"
          style="background: linear-gradient(100deg, rgb(204, 158, 53), rgb(240, 231, 131)); border-radius: 0 0 10px 10px; padding: 48px 42px"
        >
          <p style="font-weight: 700; font-size: 24px; line-height: 32px; color: #fff">Birthday Alert</p>
        </td>
      </tr>
      <tr>
        <td style="padding: 40px 40px 20px; line-height: 24px; font-size: 16px; color: #253858; font-style: normal; font-weight: 400">
          <p>Dear <strong>[Admin Name]</strong>,</p>

          <p>This is a friendly reminder that the following individual(s) under your care are celebrating their birthday this month:</p>

          <!-- Birthday list -->
          <ul style="padding-left: 20px; margin: 10px 0">
            <li><strong>[Member Name 1]</strong> – [Phone Number / Email] - Chapter - Day</li>
            <li><strong>[Member Name 2]</strong> – [Phone Number / Email] - Chapter - Day</li>
            <!-- Add more as needed -->
          </ul>

          <p>We encourage you to reach out, share a prayer, and express the love of Christ as we celebrate them.</p>

          <p style="font-style: italic; color: #666">“Be devoted to one another in love. Honor one another above yourselves.” – Romans 12:10</p>

          <p>Thank you for your continued dedication and care.</p>
        </td>
      </tr>

      <tr>
        <td style="text-align: left; padding: 24px 40px">
          <p style="padding: 0px; line-height: 32px; font-size: 16px; color: #253858; font-style: normal; font-weight: 400">
            Warm regards, <br />
            GGP Team
          </p>
          <p style="font-size: 14px; line-height: 20px; text-align: left; font-weight: 400; color: #8083a3; margin-top: 8px">
            Questions? Feel free to send us an email (<a href="mailto:support@globalgospelpartnership.org" style="color: #cc9e35; text-decoration: none"> support@globalgospelpartnership.org </a>) or
            <span style="color: #cc9e35">
              <a href="" target="_blank" rel="noreferrer noopener" style="color: #cc9e35"> chat with our team </a>
            </span>
          </p>
          <p style="font-size: 12px; line-height: 22px; font-weight: 400; text-align: left; color: #8083a3; margin-top: -16px">
            © GGP |
            <a href="mailto:info@globalgospelpartnership.org" style="color: #8083a3; text-decoration: none"> info@globalgospelpartnership.org </a>
          </p>
        </td>
      </tr>
    </table>
  </body>
</html>
  `;
};

export default DivisionBirthdayMailTemplate;
