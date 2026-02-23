import React from "react";

export type Guide = {
  slug: string;
  title: string;
  intro: string;
  videoUrl?: string;
  category?: string;
  content: React.ReactNode;
};

export const guides: Guide[] = [
  // {
  //   slug: "sign-up-ggp",
  //   title: "Sign Up on the GGP Website",
  //   intro:
  //     "This guide walks you through how to create a new GGP account by completing the registration form and verifying your details.",
  //   category: "Getting Started",
  //   videoUrl: "https://drive.google.com/file/d/1PzGk170644XT-Mi5OOZ_OWeNUh_hBna5/view?usp=drive_link",
  //   content: (
  //     <>
  //       <h2>Overview</h2>
  //       <p>
  //         Creating a GGP account allows you to become a partner, track your remissions, and access all features available
  //         on the platform. The sign-up process only takes a few minutes.
  //       </p>

  //       <h2>How to create your account</h2>
  //       <ol>
  //         <li>
  //           Scan the provided QR code or click the registration link to visit the GGP website.
  //         </li>
  //         <li>
  //           On the registration page, fill in your personal information starting with your <strong>First Name</strong>{" "}
  //           and <strong>Last Name</strong>.
  //         </li>
  //         <li>
  //           Enter your email address. This should be an email you actively use, as important updates will be sent to it.
  //         </li>
  //         <li>
  //           Enter your phone number. Please use a number you can easily access for updates and communication.
  //         </li>
  //         <li>
  //           Select your <strong>Division</strong> from the dropdown.
  //         </li>
  //         <li>
  //           Choose your <strong>Chapter</strong> based on your location.
  //         </li>
  //         <li>
  //           Select your GGP category, indicating how you intend to partner monthly.
  //         </li>
  //         <li>
  //           Enter your <strong>Date of Birth</strong> using the date picker provided.
  //         </li>
  //         <li>
  //           Create a password that you can easily remember but is secure.
  //         </li>
  //       </ol>

  //       <h2>Review and submit</h2>
  //       <ol>
  //         <li>
  //           Carefully review all the information you have entered to ensure it is correct and accurate.
  //         </li>
  //         <li>
  //           Confirm that you agree to the GGP Terms of Service and Privacy Policy.
  //         </li>
  //         <li>
  //           Click <strong>Create Account</strong> to complete your registration.
  //         </li>
  //       </ol>

  //       <h2>After registration</h2>
  //       <p>
  //         Once your account is created, you will receive a confirmation email. This email contains your personal GGP code
  //         and confirms that your registration was successful.
  //       </p>

  //       <p>
  //         You can then log in using either your email address or your GGP code, along with the password you created during
  //         registration.
  //       </p>

  //       <h2>Things to note</h2>
  //       <ul>
  //         <li>
  //           Ensure your email address is entered correctly so you receive your confirmation message.
  //         </li>
  //         <li>
  //           Keep your GGP code safe, as it can also be used to log in.
  //         </li>
  //       </ul>

  //       <h2>Need help?</h2>
  //       <p>
  //         If you need further assistance or encounter any issues during registration, please contact the support team by
  //         emailing{" "}
  //         <a href="mailto:support@globalgospelpartnership.org">
  //           support@globalgospelpartnership.org
  //         </a>.
  //       </p>
  //     </>
  //   ),
  // },
  {
    slug: "online-remission",
    title: "Make an Online Remission",
    intro: "This guide explains how to make an online remission and complete payment securely through the app.",
    category: "Remissions",
    videoUrl: "https://drive.google.com/file/d/10-0xUJFGCBVhFlLKapTZxlQbiTlNWc7C/view?usp=drive_link",
    content: (
      <>
        <h2>Overview</h2>
        <p>
          Online remissions allow you to submit your giving directly through the app and complete payment using a secure payment provider. Once completed, you
          will receive an email confirmation from the GGP office.
        </p>

        <h2>How to make an online remission</h2>
        <ol>
          <li>
            After logging in, navigate to your <strong>Remission History</strong> page if you are not already there.
          </li>
          <li>
            On the Remission History page, click on the <strong>Make Payment</strong> button.
          </li>
          <li>
            A modal will appear with the option to <strong>Make One time payment</strong>. Click on this option.
          </li>
          <li>Confirm that the name under your personal code, as well as your division and chapter details, are correct.</li>
          <li>Enter the amount you would like to remit in the amount field.</li>
          <li>Optionally, add a description if you have extra details that may help speed up the review process.</li>
          <li>Select the remission month you are making payment for.</li>
          <li>
            Carefully review all the details, then click <strong>Go to Payment</strong>.
          </li>
          <li>Enter your card details through your preferred payment method to complete the payment.</li>
        </ol>

        <h2>Important things to note</h2>
        <ul>
          <li>
            You may be redirected to an external payment provider to process the payment. Please wait for the payment to complete before closing the page or
            navigating elsewhere.
          </li>
          <li>After successful payment, allow some time to receive an email confirmation from the GGP office.</li>
        </ul>

        <h2>Need help?</h2>
        <p>
          If you experience any issues or need further assistance, please contact the support team by emailing{" "}
          <a href="mailto:support@globalgospelpartnership.org">support@globalgospelpartnership.org</a>.
        </p>
      </>
    ),
  },
  {
    slug: "automate-monthly-remissions",
    title: "Automate Your Monthly Remissions",
    intro: "This guide shows you how to set up automated monthly remissions so your giving is processed securely and consistently each month.",
    category: "Remissions",
    videoUrl: "https://drive.google.com/file/d/1CSDaSfIL_-rJF5AFtbmvMmKykvHUH6vL/view?usp=drive_link",
    content: (
      <>
        <h2>Overview</h2>
        <p>
          Automated monthly remissions allow you to give consistently without needing to manually make payments every month. Once set up, your chosen amount
          will be deducted automatically on your selected day each month.
        </p>

        <h2>How to set up automated monthly remissions</h2>
        <ol>
          <li>
            After logging in, navigate to your <strong>Remission History</strong> page. If you are not already there, use the menu icon to locate it.
          </li>
          <li>
            On the Remission History page, click on the <strong>Make Payment</strong> button.
          </li>
          <li>
            A modal will appear with the option to <strong>Automate your Monthly Remissions</strong>. Click on this option.
          </li>
          <li>Confirm that the name under your personal code, as well as your division and chapter details, are correct.</li>
          <li>Enter the amount you would like to remit monthly in the amount field.</li>
          <li>Optionally, add a description if you have extra information that may help with processing or review.</li>
          <li>Select the day of the month you would like your future remissions to be processed automatically.</li>
          <li>
            Review all the details carefully, then click <strong>Go to Payment</strong>.
          </li>
          <li>You will be redirected to the payment provider page. Enter your card details or choose your preferred payment method to complete the payment.</li>
        </ol>

        <h2>Important things to note</h2>
        <ul>
          <li>
            You will be redirected to an external payment provider to process your payment. Please wait until the payment is fully completed before closing the
            page or navigating elsewhere.
          </li>
          <li>When setting up monthly remissions, please use a card payment method that supports automatic and recurring payments.</li>
          <li>
            The first payment is processed immediately to verify your payment method. Subsequent payments will then be made automatically each month on the day
            you selected.
          </li>
        </ul>

        <h2>After payment confirmation</h2>
        <p>
          Once your payment is submitted, please remain on the page briefly and allow time for an email confirmation from the GGP office confirming that your
          payment has been received and successfully processed.
        </p>

        <h2>Need help?</h2>
        <p>
          If you experience any issues or need further assistance, please contact the support team by emailing{" "}
          <a href="mailto:support@globalgospelpartnership.org">support@globalgospelpartnership.org</a>.
        </p>
      </>
    ),
  },
  {
    slug: "manage-automated-remissions",
    title: "Manage Your Automated Monthly Remissions",
    intro:
      "This guide explains how to pause or resume your automated remissions, update your remission amount or preferred day, and change your payment card details.",
    category: "Remissions",
    videoUrl: "https://drive.google.com/file/d/11tcPQJ3px1E76e284t4OniVNjlSV0Dli/view?usp=drive_link",
    content: (
      <>
        <h2>Overview</h2>
        <p>
          Once you have set up automated monthly remissions, you can manage them at any time from your dashboard. This includes pausing or resuming remissions,
          updating the amount or preferred day, and changing your payment card details.
        </p>

        <h2>Accessing automated remission management</h2>
        <ol>
          <li>After logging in, open the navigation menu using the menu icon (three dashes).</li>
          <li>
            Select <strong>Dashboard</strong>.
          </li>
          <li>
            Scroll down and click on <strong>Manage Automated Remissions</strong>.
          </li>
        </ol>

        <h2>Pausing or resuming automated remissions</h2>
        <ol>
          <li>On the Manage Automated Remissions page, locate the pause or resume option.</li>
          <li>Click the appropriate button and submit your action.</li>
          <li>When paused, no funds will be deducted from your card until you resume the automation.</li>
        </ol>

        <h2>Updating your remission amount or preferred day</h2>
        <ol>
          <li>
            Click on the <strong>Update Remission</strong> button.
          </li>
          <li>Enter the new amount you would like to remit.</li>
          <li>Select a new preferred day for your future remissions, if required.</li>
          <li>
            Click <strong>Submit</strong> to save your changes.
          </li>
        </ol>

        <h2>Updating your payment card details</h2>
        <p>This option is mainly applicable for international partners using card payments.</p>

        <ol>
          <li>
            Click on <strong>Update Payment Card</strong>.
          </li>
          <li>Enter your new card details and billing address accurately.</li>
          <li>
            Click <strong>Submit</strong> to process the new payment details.
          </li>
        </ol>

        <h2>Important things to note when updating your card</h2>
        <ul>
          <li>
            You may be redirected to an external payment provider to process the update. Please wait for the process to complete before closing the page or
            navigating elsewhere.
          </li>
          <li>Please use a card that supports recurring payments to enable future automated remissions.</li>
          <li>The first payment will be processed immediately to verify the new payment method.</li>
        </ul>

        <h2>Need help?</h2>
        <p>
          If you experience any issues or need further assistance, please contact the support team by emailing{" "}
          <a href="mailto:support@globalgospelpartnership.org">support@globalgospelpartnership.org</a>.
        </p>
      </>
    ),
  },
  {
    slug: "view-remission-history",
    title: "View and Use Your Remission History",
    intro: "This guide explains how to view your remission records, open individual entries, and filter your history to find specific payments.",
    category: "Remissions",
    videoUrl: "https://drive.google.com/file/d/1yDglsSnd61vp2QxEwo-Jby7SdKXLEzTa/view?usp=drive_link",
    content: (
      <>
        <h2>Overview</h2>
        <p>
          The Remission History page provides a detailed record of all your remissions. It allows you to review past payments, see their status, and filter
          records based on dates or approval status.
        </p>

        <h2>Accessing your remission history</h2>
        <ol>
          <li>
            After logging in, you will usually be taken directly to the <strong>Remission History</strong> page.
          </li>
          <li>
            If you are not already there, open the navigation menu using the menu icon (three dashes) and select <strong>Remission History</strong>.
          </li>
        </ol>

        <h2>Understanding the remission table</h2>
        <p>On the page, you will see a table listing your remission records along with key details for each entry.</p>

        <ul>
          <li>Each row represents a single remission record.</li>
          <li>The table shows information such as payment date, remission period, chapter, amount, and approval status.</li>
          <li>You can click on any record to view more detailed information about that payment.</li>
        </ul>

        <h2>Filtering your remission records</h2>
        <p>You can narrow down the records displayed using the filter option on the page.</p>

        <ol>
          <li>
            Click on the <strong>Filter</strong> button above the table.
          </li>
          <li>Choose how you would like to filter your records, such as by status, payment date range, or remission period range.</li>
          <li>Enter your preferred filter values and apply the filter.</li>
          <li>The table will update to show only the records that match your selected criteria.</li>
        </ol>

        <p>If no records match your selected filters, a message will be displayed to indicate that no results were found.</p>

        <h2>Why this page is useful</h2>
        <p>The Remission History page helps you keep track of your giving, verify completed payments, and quickly locate specific remissions when needed.</p>

        <h2>Need help?</h2>
        <p>
          If you experience any issues or need further assistance, please contact the support team by emailing{" "}
          <a href="mailto:support@globalgospelpartnership.org">support@globalgospelpartnership.org</a>.
        </p>
      </>
    ),
  },
  {
    slug: "log-offline-remission",
    title: "Log an Offline Remission",
    intro: "This guide explains how to record an offline remission you have already made, so it can be reviewed and reflected in your records.",
    category: "Remissions",
    videoUrl: "https://drive.google.com/file/d/1vnfKArTBaLQViB8X9jouj4Dr-u9c7SP_/view?usp=drive_link",
    content: (
      <>
        <h2>Overview</h2>
        <p>
          Offline remissions are payments made outside the app, such as bank transfers or other approved offline methods. Logging them ensures your records are
          complete and up to date.
        </p>

        <h2>How to log an offline remission</h2>
        <ol>
          <li>
            After logging in, navigate to your <strong>Remission History</strong> page if you are not already there.
          </li>
          <li>
            Click on <strong>Log your Offline Remission</strong>.
          </li>
          <li>Confirm that the name under your personal code, as well as your division and chapter details, are correct.</li>
          <li>Enter the amount you would like to remit in the amount field.</li>
          <li>Optionally, add a description if you have extra details that may help speed up the review process.</li>
          <li>Select the remission month you are logging payment for.</li>
          <li>Select the date you made the remission.</li>
          <li>
            Click <strong>Submit</strong> to log the remission.
          </li>
        </ol>

        <h2>After submission</h2>
        <p>
          Once submitted, you will receive a notification confirming that your remission has been logged successfully. This means your records have been updated
          and the remission will be reviewed accordingly.
        </p>

        <h2>Things to note</h2>
        <ul>
          <li>Ensure all details entered are accurate to avoid delays during the review process.</li>
          <li>Logged offline remissions may take some time to be reviewed and approved.</li>
        </ul>

        <h2>Need help?</h2>
        <p>
          If you experience any issues or need further assistance, please contact the support team by emailing{" "}
          <a href="mailto:support@globalgospelpartnership.org">support@globalgospelpartnership.org</a>.
        </p>
      </>
    ),
  },
  {
    slug: "understanding-your-dashboard",
    title: "Understanding Your Dashboard",
    intro: "This guide helps you understand what you see on your dashboard, including your yearly activity summary and consistency tracking.",
    category: "Dashboard",
    videoUrl: "https://drive.google.com/file/d/12LbiS2vBErJZuzaNt8DjJlbBxh8-R23c/view?usp=drive_link",
    content: (
      <>
        <h2>Overview</h2>
        <p>
          Your dashboard provides a high-level summary of your partnership activity within the app. It highlights your overall remissions and allows you to
          track your consistency across different months and years.
        </p>

        <h2>Accessing your dashboard</h2>
        <ol>
          <li>After logging in, open the navigation menu by clicking the menu icon (three dashes).</li>
          <li>
            Select <strong>Dashboard</strong> to view your dashboard page.
          </li>
        </ol>

        <h2>What you see on the dashboard</h2>
        <p>
          At the top of the page, you will see summary cards that give you an overview of your activity for the current year. These include figures such as your
          total remitted amount, missed remissions, and any automated monthly remissions you have set up.
        </p>

        <h2>Using the consistency tracker</h2>
        <p>The consistency tracker is the main feature of the dashboard. It allows you to review your remission history across different months and years.</p>

        <ul>
          <li>
            Each month of the year is displayed with a status such as <strong>Paid</strong>, <strong>Pending</strong>, or <strong>Missed</strong>.
          </li>
          <li>You can switch between different years to view your past records and track your consistency over time.</li>
          <li>The tracker helps you quickly identify months where remissions were completed and months that still require attention.</li>
        </ul>

        <h2>What the dashboard is for</h2>
        <p>
          The dashboard is designed to give you a quick snapshot of your partnership journey. It helps you stay informed about your progress, recognise
          consistency, and identify areas where action may be needed.
        </p>

        <h2>Need help?</h2>
        <p>
          If you have any questions or need further assistance, please contact the support team by emailing{" "}
          <a href="mailto:support@globalgospelpartnership.org">support@globalgospelpartnership.org</a>.
        </p>
      </>
    ),
  },
  {
    slug: "change-password",
    title: "Change or Update Your Password",
    intro: "This guide walks you through how to update your account password to keep your profile secure.",
    category: "Account",
    videoUrl: "https://drive.google.com/file/d/1El-vhPCeSH4TQ1zNXXsR01_RAl6MyMqW/view?usp=drive_link",
    content: (
      <>
        <h2>Overview</h2>
        <p>
          You can update your password at any time from your profile page. This is useful if you want to improve account security or if you believe your
          password may have been compromised.
        </p>

        <h2>How to change your password</h2>
        <ol>
          <li>
            After logging in, click on your name in the side navigation panel or your partnership code in the top navigation bar to open your profile page.
          </li>
          <li>Scroll down to the bottom section of the profile page.</li>
          <li>
            Click on the <strong>Change Password</strong> option located on the right-hand side.
          </li>
          <li>Enter your current (old) password.</li>
          <li>Enter your new password, then re-enter the same password in the confirmation field.</li>
          <li>Ensure that both the new password and the confirmation password match exactly.</li>
          <li>
            Click the <strong>Update Password</strong> button to save your changes.
          </li>
        </ol>

        <h2>After updating your password</h2>
        <p>Once submitted, your password will be updated immediately. You can continue using the app with your new password.</p>

        <h2>Things to note</h2>
        <ul>
          <li>Make sure your new password is strong and not easily guessable.</li>
          <li>If the new password and confirmation password do not match, the update will not be saved.</li>
        </ul>

        <h2>Need help?</h2>
        <p>
          If you experience any issues or need further assistance, please contact the support team by emailing{" "}
          <a href="mailto:support@globalgospelpartnership.org">support@globalgospelpartnership.org</a>.
        </p>
      </>
    ),
  },
  {
    slug: "recover-forgotten-password",
    title: "Recover a Forgotten Password",
    intro: "This guide explains how to reset your password if you can no longer remember your login details.",
    category: "Account",
    videoUrl: "https://drive.google.com/file/d/1lRwAbVncIXvR-vnBPRv32Dj_5c2Zx6O9/view?usp=drive_link",
    content: (
      <>
        <h2>Overview</h2>
        <p>
          If you forget your password, you can easily recover access to your account by requesting a password reset from the login page. The process verifies
          your identity and allows you to set a new password securely.
        </p>

        <h2>How to recover your password</h2>
        <ol>
          <li>
            Navigate to the <strong>Login</strong> page.
          </li>
          <li>
            Click on the <strong>Forgot Password</strong> link located between the email and password fields.
          </li>
          <li>Enter the email address you used to create your account.</li>
          <li>
            Click <strong>Reset Password</strong> to submit your request.
          </li>
          <li>Check your email inbox for a message containing a verification code and a password reset link.</li>
        </ol>

        <h2>Completing the password reset</h2>
        <p>You can complete the reset using either the link sent to your email or by entering the verification code manually.</p>

        <ol>
          <li>
            Click the password reset link in the email to open a new page with your details pre-filled,
            <em> or </em>
            return to the app and enter the verification code in the provided field.
          </li>
          <li>Enter your new password.</li>
          <li>Re-enter the same password to confirm it.</li>
          <li>
            Click <strong>Reset Password</strong> to save your new password.
          </li>
        </ol>

        <h2>After resetting your password</h2>
        <p>Once your password is successfully reset, you will be redirected back to the login page. Log in using your new password to access your account.</p>

        <h2>Things to note</h2>
        <ul>
          <li>Ensure you have access to the email address linked to your account.</li>
          <li>If you do not see the reset email, check your spam or junk folder.</li>
          <li>Choose a strong password that you have not used previously.</li>
        </ul>

        <h2>Need help?</h2>
        <p>
          If you experience any issues or need further assistance, please contact the support team by emailing{" "}
          <a href="mailto:support@globalgospelpartnership.org">support@globalgospelpartnership.org</a>.
        </p>
      </>
    ),
  },
  {
    slug: "update-profile-details",
    title: "Update Your Profile Details",
    intro: "This guide shows you how to edit your personal details and update your profile picture from your profile page.",
    category: "Account",
    videoUrl: "https://drive.google.com/file/d/12-WJHdvCMox3pqxSjzODWkcjB8CBjeTJ/view?usp=drive_link",
    content: (
      <>
        <h2>Overview</h2>
        <p>
          You can update certain personal details on your profile at any time to ensure your information remains accurate. This includes editable fields such as
          your name and address, as well as your profile picture.
        </p>

        <h2>How to access your profile page</h2>
        <ol>
          <li>After logging in, click on your name in the side navigation panel or your partnership code in the top navigation bar.</li>
          <li>This will take you to your personal information (profile) page.</li>
        </ol>

        <h2>Editing your profile details</h2>
        <ol>
          <li>
            On your profile page, click the <strong>Edit Profile</strong> button at the top right.
          </li>
          <li>Update any of the editable fields, such as your first name, last name, address, gender, or nationality.</li>
          <li>Note that some details cannot be edited, including your personal code, login email, category, division, and chapter.</li>
          <li>If you wish, upload a new profile picture.</li>
          <li>
            Click <strong>Submit</strong> to save your changes.
          </li>
        </ol>

        <h2>After updating your profile</h2>
        <p>
          Once your changes are saved, you will see a confirmation message indicating that your profile has been updated successfully. Your profile page will
          then reflect the new details.
        </p>

        <h2>Things to note</h2>
        <ul>
          <li>Only fields marked as editable can be changed.</li>
          <li>Uploading a profile picture is optional.</li>
        </ul>

        <h2>Need help?</h2>
        <p>
          If you experience any issues or need further assistance, please contact the support team by emailing{" "}
          <a href="mailto:support@globalgospelpartnership.org">support@globalgospelpartnership.org</a>.
        </p>
      </>
    ),
  },
  {
    slug: "change-theme",
    title: "Switch Between Light and Dark Mode",
    intro: "This guide shows you how to change the app colour theme by switching between light mode and dark mode.",
    category: "App Settings",
    videoUrl: "https://drive.google.com/file/d/1RjYKFk-1s6vZzOitRShpPwCHheFe70Sw/view?usp=drive_link",
    content: (
      <>
        <h2>Overview</h2>
        <p>You can change the app theme at any time based on your preference. The app supports both light mode and dark mode.</p>

        <h2>How to change the app colour theme</h2>
        <ol>
          <li>After logging in, open the navigation panel by clicking the menu icon (three dashes).</li>
          <li>At the bottom of the navigation panel, locate the theme icons.</li>
          <li>
            Select the <strong>Sun</strong> icon to switch to <strong>Light mode</strong>.
          </li>
          <li>
            Select the <strong>Moon</strong> icon to switch to <strong>Dark mode</strong>.
          </li>
        </ol>

        <h2>Things to note</h2>
        <ul>
          <li>Your selection updates immediately, so you can switch back and forth whenever you like.</li>
          <li>Choose whichever mode feels more comfortable for you based on lighting and readability.</li>
        </ul>

        <h2>Need help?</h2>
        <p>
          If you experience any issues or need further assistance, please contact the support team by emailing{" "}
          <a href="mailto:support@globalgospelpartnership.org">support@globalgospelpartnership.org</a>.
        </p>
      </>
    ),
  },
];
