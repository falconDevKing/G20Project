const UserBirthdayMailTemplate = function (first_name: string) {
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
        <td class="banner-icon">
          <img
            src="https://ohip-public.s3.eu-west-1.amazonaws.com/G20_logo.png"
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
            background: url(https://ohip-public.s3.eu-west-1.amazonaws.com/HappyBirthdayBanner.png);
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
          <p style="font-weight: 700; line-height: 28px; color: #84693c; text-align: center; padding-top: 24px">
            <span style="font-weight: 700; font-size: 2rem">🎉 HAPPY BIRTHDAY, ${first_name}!</span>
          </p>
        </td>
      </tr>
      <tr>
        <td style="padding: 40px 40px 20px; line-height: 24px; color: #253858; font-style: normal; font-weight: 400; text-align: center">
          <p style="margin-top: 0">Dear <strong>${first_name}</strong>,</p>

          <p>
            Happy Birthday! On this special day, we want you to know how much we appreciate you—not just for who you are, but for the incredible support you’ve
            shown to the ministry.
          </p>

          <p>Your commitment as a financial partner is a vital part of what God is doing through this church, and we are deeply grateful.</p>

          <p style="color: #6a1b9a; font-weight: bold">
            “The path of the righteous is like the morning sun, shining ever brighter till the full light of day.” – Proverbs 4:18
          </p>
        </td>
      </tr>

      <tr>
        <td style="padding: 20px 40px; line-height: 24px; color: #253858; font-style: normal; font-weight: 400">
          <p>As you celebrate another year, we pray that the Lord will:</p>
          <ul style="padding-left: 20px">
            <li>Open new doors of favour,</li>
            <li>Increase you on every side,</li>
            <li>Surround you with His goodness.</li>
          </ul>
        </td>
      </tr>

      <tr>
        <td style="padding: 20px 40px; line-height: 24px; color: #253858; font-style: normal; font-weight: 400; text-align: center">
          <p>May this new year bring answers to long-standing prayers, divine connections, and multiplied grace.</p>

          <p>
            Thank you once again for your partnership in the Kingdom. May your life overflow with mercy, speed, and supernatural blessings beyond your
            expectations.
          </p>
        </td>
      </tr>

      <tr>
        <td style="text-align: center; padding: 24px 40px; line-height: 32px">
          <p style="padding: 0px; color: #253858; font-style: normal; font-weight: 400">
            Warmest Regards, <br />
            <span style="font-weight: bold">GGP Team</span>
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
          <p style="font-weight: 400; color: #8083a3; margin-top: -16px; font-size: 20px">
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

export default UserBirthdayMailTemplate;
