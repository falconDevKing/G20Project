const PostConfirmationTemplate = function (name: string, code: string) {
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
    <table role="presentation" style="max-width: 602px; width: 100%; margin: auto; font-family: &quot;Public Sans&quot;, sans-serif; border-collapse: collapse">
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
          <p style="font-weight: 700; font-size: 18px; line-height: 28px; color: #fff">Welcome to GGP! You’re Officially a GGP Partner.</p>
        </td>
      </tr>
      <tr>
        <td style="padding: 40px; line-height: 26px; font-size: 16 px; color: #253858; font-style: normal; font-weight: 400">
          <p>Hi ${name},</p>
          <p>Welcome to Global Gospel Partnership!</p>
          <p>
            Your email has been successfully verified, and we’re honored to officially welcome you into this life-transforming journey of Partnering with the
            Prophet of God to take the Gospel to the nations of the earth.
          </p>
          <p>
            As you walk with us, remember… your monthly partnership carries deep purpose. It’s more than a giving; it’s a prophetic step toward changing lives
            and expanding the Kingdom of God across the globe.
          </p>

          <p>🔑 Below is your personal GGP Code:</p>
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

          <p>Please keep this handy, it helps us serve you better and ensures smoother engagement with the G20 Team. With it you can access your profile and remission history</p>

          <p>🔑 For your first login, you can login with your email or GGP Code and the default password shared below. Kindly do well to change it once you have accessed the platform from your profile page.</p>
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
              Password-123
            </div>
          </div>

          <p>Thank you for saying “yes” to the call. We’re grateful to walk this path alongside you.</p>
        </td>
      </tr>
      <tr>
        <td style="text-align: left; padding: 24px 40px">
          <p style="padding: 0px; line-height: 32px; font-size: 16px; color: #253858; font-style: normal; font-weight: 400">
            Warmest Regards, <br />
            G20 Team
          </p>
          <p style="font-size: 14px; line-height: 20px; text-align: left; font-weight: 400; color: #8083a3; margin-top: 8px">
            Got questions? <br />
            We’re here to help — reach out anytime at <a href="mailto:support@globalgospelpartnership.org" style="color: #cc9e35; text-decoration: none"> support@globalgospelpartnership.org </a>
            or
            <span style="color: #cc9e35">
              <a href="" target="_blank" rel="noreferrer noopener" style="color: #cc9e35"> chat with our team </a>
            </span>
          </p>
          <br />
          <p style="font-size: 12px; line-height: 22px; font-weight: 400; text-align: left; color: #8083a3; margin-top: -16px">
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
