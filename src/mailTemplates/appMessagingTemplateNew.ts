const HTML_TEMPLATE = `
<html lang="en">
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
        font-size: 16px;
        font-family:
          EB Garamond,
          &quot;Public Sans&quot;,
          sans-serif;
        border-collapse: collapse;
        text-align: center;
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
            background: url(https://ohip-public.s3.eu-west-1.amazonaws.com/Brown-Beige-Monthly-Newsletter-1+1.png);
            border-radius: 0 0 10px 10px;
            padding: 12px 42px;
            height: 120px;
          "
        >
          <p style="font-weight: 700; font-size: 28px; line-height: 28px; color: #fff; text-align: center">
            <span style="font-weight: 700; font-size: 20px; font-style: italic">{{subjectHere}}
          </p>
        </td>
      </tr>

      <tr>
        <td style="padding: 40px; line-height: 26px; font-size: 16px; color: #253858; font-style: normal; font-weight: 400">{{contentHere}}</td>
      </tr>

      <tr>
        <td style="text-align: center; padding: 24px 40px; line-height: 32px">
          <p style="font-weight: 400; color: #8083a3; margin-top: 8px; text-align: center; font-size: 20px">
            <span style="display: flex; align-items: center; justify-content:center; margin-right: 20px; margin-bottom: 8px">
              <img
                src="https://ohip-public.s3.eu-west-1.amazonaws.com/globe.png"
                alt="Globe"
                width="20"
                height="20"
                style="vertical-align: middle; margin-right: 6px"
              />
              <a href="https://www.globalgospelpartnership.org" style="color: #cc9e35; text-decoration: none"> www.globalgospelpartnership.org </a>
            </span>
            <span style="display: flex; align-items: center; justify-content:center; margin-right: 20px; margin-bottom: 8px">
              <img
                src="https://ohip-public.s3.eu-west-1.amazonaws.com/mail.png"
                alt="Mail"
                width="20"
                height="20"
                style="vertical-align: middle; margin-right: 6px"
              />
              <a href="mailto:support@globalgospelpartnership.org" style="color: #cc9e35; text-decoration: none"> support@globalgospelpartnership.org </a>
            </span>
            <span style="display: flex; align-items: center; justify-content:center; margin-right: 20px; margin-bottom: 8px">
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

const HTML_TEMPLATE_DARK = `
<html lang="en">
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
        font-size: 16px;
        font-family:
          EB Garamond,
          &quot;Public Sans&quot;,
          sans-serif;
        border-collapse: collapse;
        text-align: center;
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
            background: url(https://ohip-public.s3.eu-west-1.amazonaws.com/Brown-Beige-Monthly-Newsletter-1+1.png);
            border-radius: 0 0 10px 10px;
            padding: 12px 42px;
            height: 120px;
          "
        >
          <p style="font-weight: 700; font-size: 28px; line-height: 28px; color: #fff; text-align: center">
            <span style="font-weight: 700; font-size: 20px; font-style: italic">{{subjectHere}}
          </p>
        </td>
      </tr>

      <tr>
        <td style="padding: 40px; line-height: 26px; font-size: 16px; color: white; font-style: normal; font-weight: 400">{{contentHere}}</td>
      </tr>

      <tr>
        <td style="text-align: center; padding: 24px 40px; line-height: 32px">
          <p style="font-weight: 400; color: #8083a3; margin-top: 8px; text-align: center; font-size: 20px">
            <span style="display: flex; align-items: center; justify-content:center; margin-right: 20px; margin-bottom: 8px">
              <img
                src="https://ohip-public.s3.eu-west-1.amazonaws.com/globe.png"
                alt="Globe"
                width="20"
                height="20"
                style="vertical-align: middle; margin-right: 6px"
              />
              <a href="https://www.globalgospelpartnership.org" style="color: #cc9e35; text-decoration: none"> www.globalgospelpartnership.org </a>
            </span>
            <span style="display: flex; align-items: center; justify-content:center; margin-right: 20px; margin-bottom: 8px">
              <img
                src="https://ohip-public.s3.eu-west-1.amazonaws.com/mail.png"
                alt="Mail"
                width="20"
                height="20"
                style="vertical-align: middle; margin-right: 6px"
              />
              <a href="mailto:support@globalgospelpartnership.org" style="color: #cc9e35; text-decoration: none"> support@globalgospelpartnership.org </a>
            </span>
            <span style="display: flex; align-items: center; justify-content:center; margin-right: 20px; margin-bottom: 8px">
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

const wrapInTemplate = (htmlContent: string, htmlSubject: string, dark = false): string => {
  return (dark ? HTML_TEMPLATE_DARK : HTML_TEMPLATE).replace("{{contentHere}}", htmlContent).replace("{{subjectHere}}", htmlSubject);
};

export default wrapInTemplate;
