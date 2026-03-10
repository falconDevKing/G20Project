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
          <p style="font-weight: 700; font-size: 24px; line-height: 32px; color: #fff">Remission Approval Pending — Action Required</p>
        </td>
      </tr>
      <tr>
        <td style="padding: 40px; line-height: 24px; font-size: 16px; color: #253858; font-style: normal; font-weight: 400">
          <p>Hello Dear,</p>
          <p>${first_name}'s remission of ${numberWithCurrencyFormatter(currency, amount)} for ${remission_period} was logged for approval. Kindly log on to the platform to approve or update accordingly. Here is a summary of the remission.</p>
        </td>
      </tr>
      <tr>
        <td style="padding: 0px 40px; line-height: 32px; font-size: 16px; color: #253858; font-style: normal; font-weight: 400">
          <div style="margin: 20px; padding: 20px; font-weight: 500; border: 1px solid #e6e8f0; border-radius: 8px; line-height: 21px">
            <div style="text-align: center; font-weight: 600; padding: 20px; font-size: 18px">Remission for ${remission_period}</div>
            <div style="padding: 20px">
              <div style="display: flex; color: #8083a3; font-size: 16px; line-height: 21px; padding: 8px 0px">
                <div style="width: 30%">Remission Amount</div>
                <div style="width: 70%; text-align: right; font-size: 20px; color: black; font-weight: 600">
                  ${numberWithCurrencyFormatter(currency, amount)}
                </div>
              </div>
              <div style="display: flex; color: #8083a3; font-size: 16px; line-height: 21px; padding: 8px 0px">
                <div style="width: 30%">Date Logged</div>
                <div style="width: 70%; text-align: right; font-size: 20px; color: black">${remissionDate}</div>
              </div>

              <div style="display: flex; color: #8083a3; font-size: 16px; line-height: 21px; padding: 8px 0px">
                <div style="width: 30%">Remitted At</div>
                <div style="width: 70%; text-align: right; font-size: 20px; color: black"> ${chapterName}</div>
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
            <br/>
            <p>Thank you for helping us maintain excellence in stewardship.</p>
          </div>
        </td>
      </tr>
       <tr>
          <td style="text-align: left; padding: 24px 40px">
            <p style="padding: 0px; line-height: 32px; font-size: 16px; color: #253858; font-style: normal; font-weight: 400">
              Warmest regards, <br />
              GGP Monitoring Team
            </p>
          </td>
        </tr>
    </table>
  </body>
</html>
`;
};

export default PaymentLogNotification;
