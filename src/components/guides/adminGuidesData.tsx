import React from "react";

export type AdminGuide = {
  slug: string;
  title: string;
  intro: string;
  videoUrl?: string;
  category?: string;
  content: React.ReactNode;
};

export const chapterAdminGuides: AdminGuide[] = [
  {
    slug: "using-metrics-admin",
    title: "Working with Metrics (Admin)",
    intro:
      "This guide explains how admins can use the Metrics page to understand partner activity, remission performance, and overall progress within their chapter or division.",
    category: "Admin",
    videoUrl: "https://drive.google.com/file/d/1GDZ19eCc7U0pT1jvfaPvxu5BLVvlqDwa/view?usp=drive_link",
    content: (
      <>
        <h2>Overview</h2>
        <p>
          The Metrics page provides a high-level overview of partner activity and remissions. It helps admins track
          performance, monitor consistency, and validate data across chapters and divisions.
        </p>

        <h2>Accessing the metrics page</h2>
        <ol>
          <li>Log in to the platform using your admin account.</li>
          <li>
            Click on <strong>Admin View</strong> from the menu or from the dashboard shortcut.
          </li>
          <li>
            You will be taken directly to the <strong>Metrics</strong> page.
          </li>
        </ol>

        <h2>Understanding scope and visibility</h2>
        <ul>
          <li>
            Chapter admins can only view metrics for their own chapter.
          </li>
          <li>
            Divisional admins can view metrics across all chapters in their division.
          </li>
          <li>
            Divisional admins can switch between chapters or view combined data for the entire division.
          </li>
        </ul>

        <h2>Partner metrics</h2>
        <p>
          The partner section shows an overview of partners and how they are classified based on activity.
        </p>

        <ul>
          <li>
            <strong>Consistent partners</strong> – partners who have been consistent in their payments across the year.
          </li>
          <li>
            <strong>Active partners</strong> – partners who have made at least one payment in the last three months.
          </li>
          <li>
            <strong>Passive partners</strong> – partners who have not made any payments in the last three months.
          </li>
        </ul>

        <p>
          You can also see partners grouped by category and the <strong>Total Sign-up Value</strong>, which represents the
          minimum amount partners have committed to. This helps with planning and target setting.
        </p>

        <h2>Currency selection</h2>
        <p>
          Metrics can be viewed in different currencies. Changing the currency will show the equivalent value based on
          your selected preference, while still reflecting the same underlying data.
        </p>

        <h2>Remission metrics</h2>
        <p>
          The remission section provides insight into financial inflows and payment activity.
        </p>

        <ul>
          <li>Inflow from the beginning of the month</li>
          <li>Inflow from the beginning of the quarter</li>
          <li>Inflow from the beginning of the year</li>
          <li>Total number of payments</li>
          <li>Average payment value</li>
          <li>Pending remissions awaiting review or approval</li>
        </ul>

        <p>
          Pending remissions reflect offline payment claims that require verification. Divisional admins can approve or
          reject these, while chapter admins can review and communicate with divisional admins.
        </p>

        <h2>Drilling down into metrics</h2>
        <p>
          Some metrics allow you to view the underlying data that contributes to the displayed values.
        </p>

        <ul>
          <li>
            Metrics that are clickable or underlined can be selected to drill down.
          </li>
          <li>
            Clicking a metric automatically applies filters to show the relevant records.
          </li>
          <li>
            For example, clicking a total inflow value shows the individual payments that make up that total.
          </li>
          <li>
            Clicking on partner metrics such as consistent partners shows the list of partners that match that status.
          </li>
        </ul>

        <p>
          This helps with validation, investigation, and deeper analysis of the data shown.
        </p>

        <h2>Clearing applied filters</h2>
        <p>
          If filters have been applied while drilling into data, you can use the <strong>Clear</strong> option to reset
          the view.
        </p>

        <ul>
          <li>
            Chapter admins will be returned to their chapter’s default view.
          </li>
          <li>
            Divisional admins will be returned to the full division-level view.
          </li>
        </ul>

        <h2>Why metrics are important</h2>
        <p>
          The Metrics page helps admins track growth, monitor consistency, verify payment activity, and make informed
          decisions based on accurate and transparent data.
        </p>

        <h2>Need help?</h2>
        <p>
          If you have any questions about interpreting metrics or accessing specific data, please contact the support
          team by emailing{" "}
          <a href="mailto:support@globalgospelpartnership.org">
            support@globalgospelpartnership.org
          </a>.
        </p>
      </>
    ),
  },
  {
    slug: "manage-remissions-admin",
    title: "Manage Remissions (Admin)",
    intro: "This guide explains how admins can view, filter, and inspect partner remissions within their authorised scope.",
    category: "Admin",
    videoUrl: "https://drive.google.com/file/d/1eO5aI7Gcqi67VL1V9q9Z6gKnLqqq2Y4M/view?usp=drive_link",
    content: (
      <>
        <h2>Overview</h2>
        <p>
          The Remission Management page allows admins to monitor and manage all partner payments within their scope. This includes viewing payment details,
          understanding approval status, and filtering remissions by different criteria such as status, payment type, and date ranges.
        </p>

        <h2>Accessing remission management</h2>
        <ol>
          <li>Log in using your admin account.</li>
          <li>
            Access the <strong>Admin</strong> views.
          </li>
          <li>
            Click on <strong>Remission Management</strong>.
          </li>
        </ol>

        <h2>Understanding scope and visibility</h2>
        <ul>
          <li>Chapter admins can only view remissions within their chapter.</li>
          <li>Divisional admins can view remissions across all chapters within their division.</li>
          <li>
            By default, payments are sorted by <strong>payment date</strong> in descending order.
          </li>
        </ul>

        <h2>Viewing payment records</h2>
        <p>The remission table displays all payments within your scope, showing key information at a glance.</p>

        <ul>
          <li>Payment amount and currency</li>
          <li>Payment date</li>
          <li>Remission period</li>
          <li>Approval status</li>
          <li>Payment type (online or manual)</li>
        </ul>

        <p>
          Clicking on any payment record opens a detailed view where you can see additional information such as the payment provider, who approved the payment,
          and any associated description.
        </p>

        <h2>Online vs manual payments</h2>
        <ul>
          <li>Online payments are automatically approved by the payment provider.</li>
          <li>Online payments may show providers such as Paystack or Stripe, depending on the division.</li>
          <li>Automated monthly remissions display as online, monthly, along with the payment provider.</li>
          <li>Manually logged payments require admin approval and show which admin approved them.</li>
        </ul>

        <h2>Filtering remission records</h2>
        <p>You can refine the data shown using the filter options available at the top of the table.</p>

        <h3>Status filters</h3>
        <ul>
          <li>
            <strong>Paid</strong> – confirmed and completed payments
          </li>
          <li>
            <strong>Pending</strong> – logged but not yet approved payments
          </li>
          <li>
            <strong>Cancelled / Rejected</strong> – payments under dispute or resolution
          </li>
        </ul>

        <h3>Payment type filters</h3>
        <ul>
          <li>
            Filter by <strong>Online payments</strong> to see payments processed through providers.
          </li>
          <li>
            Filter by <strong>Manual payments</strong> to track admin-approved remissions.
          </li>
        </ul>

        <h3>Date-based filters</h3>
        <ul>
          <li>
            Filter by <strong>Payment Date Range</strong> to view payments made within a specific timeframe.
          </li>
          <li>
            Filter by <strong>Remission Period Range</strong> to view payments for specific months or periods.
          </li>
        </ul>

        <p>Multiple filters can be combined to narrow down results. Filters can be adjusted, cleared individually, or reset entirely as needed.</p>

        <h2>Why this page is important</h2>
        <p>
          Remission Management helps admins maintain financial oversight, track partner consistency, resolve disputes, and ensure accountability across chapters
          and divisions.
        </p>

        <h2>Need help?</h2>
        <p>
          If you need assistance with viewing specific remissions or understanding payment details, please contact the support team by emailing{" "}
          <a href="mailto:support@globalgospelpartnership.org">support@globalgospelpartnership.org</a>.
        </p>
      </>
    ),
  },
  {
    slug: "log-offline-remission-chapter-admin",
    title: "Log Offline Remissions (Chapter Admin)",
    intro:
      "This guide explains how chapter admins can record offline remissions made by partners, such as bank transfers or manual payments.",
    category: "Admin",
    videoUrl: "https://drive.google.com/file/d/1aph5FpRcn__9uq-wouHwbMh2A0lWq4GU/view?usp=drive_link",
    content: (
      <>
        <h2>Overview</h2>
        <p>
          Chapter admins can log remissions that were made outside the platform, such as manual transfers or offline
          payments. These remissions are recorded as pending and are later reviewed and approved at the divisional level.
        </p>

        <h2>Accessing remission management</h2>
        <ol>
          <li>
            Log in using your chapter admin account.
          </li>
          <li>
            Access the <strong>Admin</strong> views.
          </li>
          <li>
            Click on <strong>Remission Management</strong>.
          </li>
          <li>
            At the top of the page, click <strong>Log an Offline Remission</strong>.
          </li>
        </ol>

        <h2>Identifying the correct partner</h2>
        <p>
          To record a remission accurately, you must provide the partner’s unique personal code.
        </p>

        <ol>
          <li>
            Navigate to <strong>Partner Management</strong>.
          </li>
          <li>
            Search for the partner by name.
          </li>
          <li>
            Open the partner’s details and copy their personal code.
          </li>
          <li>
            Return to the Remission Management page and paste the code into the partner code field.
          </li>
        </ol>

        <p>
          Once entered, the partner’s name will appear beneath the code to confirm you are recording the remission for the
          correct person. If an invalid code is entered, the system will indicate that the user is unknown.
        </p>

        <h2>Entering offline remission details</h2>
        <ol>
          <li>
            Enter the remission amount.
          </li>
          <li>
            Optionally, add useful details such as how the payment was made or any transfer references. This helps with
            verification during review.
          </li>
          <li>
            Confirm that the chapter and division details are correctly pre-filled.
          </li>
          <li>
            If any pre-filled details appear incorrect, take a screenshot and report the issue to the support team.
          </li>
        </ol>

        <h2>Selecting remission period and payment date</h2>
        <ol>
          <li>
            Select the remission period the payment applies to.
          </li>
          <li>
            Select the date the payment was actually made.
          </li>
          <li>
            Note that future payment dates cannot be selected, as payments must have already occurred.
          </li>
        </ol>

        <h2>Submitting the remission</h2>
        <ol>
          <li>
            Review all entered details carefully.
          </li>
          <li>
            Click <strong>Submit</strong> to log the remission.
          </li>
          <li>
            The remission will be recorded with a <strong>Pending</strong> status.
          </li>
        </ol>

        <h2>After submission</h2>
        <p>
          Once logged, the remission will appear in the pending remissions list for your chapter. Divisional admins will
          review and approve the remission before it is marked as completed.
        </p>

        <h2>Why this process matters</h2>
        <p>
          Logging offline remissions ensures accurate reporting, proper statistics, and easy traceability across both
          chapter and division levels.
        </p>

        <h2>Need help?</h2>
        <p>
          If you encounter any issues or need further assistance while logging offline remissions, please contact the
          support team by emailing{" "}
          <a href="mailto:support@globalgospelpartnership.org">
            support@globalgospelpartnership.org
          </a>.
        </p>
      </>
    ),
  },
  {
    slug: "partner-management-overview",
    title: "Partner Management Overview (Admin)",
    intro:
      "This guide explains how admins can view, search, filter, and inspect partner records to effectively manage partners within their chapter or division.",
    category: "Admin",
    videoUrl: "https://drive.google.com/file/d/1SZxO3KAShscTYJre-b7btOCQywLQQjmX/view?usp=drive_link",
    content: (
      <>
        <h2>Overview</h2>
        <p>
          The Partner Management section allows admins to manage partners under their care. From this page, you can view
          partner details, search for specific individuals, and apply powerful filters to segment partners for follow-up,
          engagement, and administration.
        </p>

        <h2>Accessing partner management</h2>
        <ol>
          <li>Log in to the platform using your admin account.</li>
          <li>Access the <strong>Admin</strong> views.</li>
          <li>Click on <strong>Partner Management</strong>.</li>
        </ol>

        <h2>Understanding scope and visibility</h2>
        <ul>
          <li>
            Chapter admins can only view partners within their chapter.
          </li>
          <li>
            Divisional admins can view partners across the entire division.
          </li>
          <li>
            Divisional admins can further filter down to specific chapters as needed.
          </li>
        </ul>

        <h2>Partner table overview</h2>
        <p>
          The main table provides a high-level view of partner information.
        </p>

        <ul>
          <li>Partner name</li>
          <li>Unique partner code</li>
          <li>Date of birth</li>
          <li>Phone number</li>
          <li>Category</li>
          <li>Chapter</li>
          <li>Partner status</li>
        </ul>

        <h2>Viewing partner details</h2>
        <ol>
          <li>
            Click anywhere on a partner’s row in the table.
          </li>
          <li>
            A side panel will open displaying more detailed information about the partner.
          </li>
        </ol>

        <p>
          The side panel shows additional details such as:
        </p>

        <ul>
          <li>Email address</li>
          <li>Partner category</li>
          <li>Contribution overview</li>
          <li>Gender and nationality (if provided)</li>
          <li>Preferred remission day</li>
          <li>Whether the partner has an active recurring remission</li>
        </ul>

        <h2>Searching for partners</h2>
        <p>
          You can quickly find a specific partner by using the search bar at the top of the table. Searching by name or
          code filters the list in real time.
        </p>

        <h2>Filtering partner data</h2>
        <p>
          The filter functionality allows you to narrow down partners based on multiple criteria.
        </p>

        <h3>Status-based filters</h3>
        <ul>
          <li>
            Filter by <strong>Consistent</strong> partners.
          </li>
          <li>
            Use <strong>Not Equals</strong> to find partners who are not yet consistent.
          </li>
        </ul>

        <h3>Birthday filters</h3>
        <ul>
          <li>
            Filter by a specific birthday.
          </li>
          <li>
            Filter by a birthday range (for example, partners with birthdays within a given month).
          </li>
        </ul>

        <p>
          Birthday filters are useful for planning outreach, celebrations, and engagement activities.
        </p>

        <h3>Combining filters</h3>
        <ul>
          <li>
            Apply multiple filters together, such as birthday and consistency status.
          </li>
          <li>
            Remove individual filter conditions without clearing all filters.
          </li>
        </ul>

        <h3>Admin and role-based filters</h3>
        <ul>
          <li>
            Filter by admin level to see non-individual partners such as chapter or divisional reps.
          </li>
        </ul>

        <h3>Preferred remission day filters</h3>
        <ul>
          <li>
            Filter partners by a specific preferred remission day.
          </li>
          <li>
            Filter by a range of preferred remission days.
          </li>
        </ul>

        <h3>Recurring remission filters</h3>
        <ul>
          <li>
            Filter partners who have an active recurring remission.
          </li>
          <li>
            Filter partners who have not yet automated their remissions.
          </li>
        </ul>

        <h2>Clearing filters</h2>
        <p>
          You can reset the table view at any time by using the <strong>Clear</strong> option.
        </p>

        <ul>
          <li>
            Clearing filters returns the table to its default state.
          </li>
          <li>
            Chapter admins return to their chapter view.
          </li>
          <li>
            Divisional admins return to the full division view.
          </li>
        </ul>

        <h2>Why this page is important</h2>
        <p>
          Partner Management enables admins to segment partners, identify engagement opportunities, monitor consistency,
          and take informed actions that support growth and accountability across chapters and divisions.
        </p>

        <h2>Need help?</h2>
        <p>
          If you have any questions about managing partners or using filters effectively, please contact the support team
          by emailing{" "}
          <a href="mailto:support@globalgospelpartnership.org">
            support@globalgospelpartnership.org
          </a>.
        </p>
      </>
    ),
  },
  {
    slug: "using-partner-actions",
    title: "Using Partner Actions (Admin)",
    intro:
      "This guide explains how admins can take action on partner records, including updating roles, categories, preferred remission days, and migrating partners between chapters.",
    category: "Admin",
    videoUrl: "https://drive.google.com/file/d/1fbdEoZ9Ezk1hD_Uxc-zaPEkIcDXr-Ite/view?usp=drive_link",
    content: (
      <>
        <h2>Overview</h2>
        <p>
          The Partner Management section allows admins to perform actions that affect how partners are managed on the
          platform. These actions are available through the Actions column and open dedicated modals where changes can be
          made safely and intentionally.
        </p>

        <h2>Accessing partner actions</h2>
        <ol>
          <li>Log in to the platform using your admin account.</li>
          <li>Navigate to <strong>Partner Management</strong>.</li>
          <li>
            Locate the partner you want to manage and use the <strong>Actions</strong> column.
          </li>
        </ol>

        <p>
          Unlike clicking on a partner row, which opens a drawer showing details, the Actions column opens modals designed
          specifically for making updates.
        </p>

        <h2>Updating partner details</h2>
        <p>
          From the actions modal, admins can update several partner-related settings.
        </p>

        <ul>
          <li>
            <strong>Partner category</strong> – update the category the partner belongs to.
          </li>
          <li>
            <strong>Permission type</strong> – assign roles based on your admin level.
          </li>
        </ul>

        <p>
          Admins cannot assign a permission level higher than their own. For example, a chapter admin can promote a
          partner to chapter admin or chapter assistant, but not beyond that.
        </p>

        <h2>Updating preferred remission day</h2>
        <p>
          Admins can update a partner’s preferred remission day based on direct communication with the partner.
        </p>

        <ol>
          <li>
            Enter the preferred day of the month the partner wishes to remit.
          </li>
          <li>
            Save the change to update the partner’s record.
          </li>
        </ol>

        <p>
          If a partner later sets up automated remissions, the preferred remission day will automatically reflect the
          day chosen during automation, and the partner will show as having an active recurring remission.
        </p>

        <h2>Migrating a partner to another chapter</h2>
        <p>
          In cases of relocation or reassignment, admins can move a partner from one chapter to another.
        </p>

        <ol>
          <li>
            Open the partner’s actions menu.
          </li>
          <li>
            Select <strong>Migrate</strong>.
          </li>
          <li>
            Choose the new division and chapter the partner is moving to.
          </li>
          <li>
            Click <strong>Migrate</strong> to confirm.
          </li>
        </ol>

        <p>
          Once migrated, the partner will belong to the new chapter. Historical records remain with the previous chapter,
          while all future payments and activity are recorded under the new chapter.
        </p>

        <h2>Important note on admin permissions</h2>
        <p>
          When a partner is migrated to another chapter, any admin or representative rights they previously had are
          removed.
        </p>

        <ul>
          <li>
            A chapter or divisional representative becomes a regular partner after migration.
          </li>
          <li>
            Admin rights must be reassigned manually in the new chapter if required.
          </li>
          <li>
            Admin permissions do not transfer automatically between chapters.
          </li>
        </ul>

        <h2>Why this matters</h2>
        <p>
          Properly managing partner actions ensures accurate records, correct chapter assignment, fair permission
          handling, and reliable reporting across the platform.
        </p>

        <h2>Need help?</h2>
        <p>
          If you have any questions about updating partner details or migrating partners between chapters, please contact
          the support team by emailing{" "}
          <a href="mailto:support@globalgospelpartnership.org">
            support@globalgospelpartnership.org
          </a>.
        </p>
      </>
    ),
  },
  {
    slug: "add-partner-manually",
    title: "Add a Partner Manually (Admin)",
    intro:
      "This guide explains how admins can manually create a partner account on the platform, useful for partners registered through paper forms or older records.",
    category: "Admin",
    videoUrl: "https://drive.google.com/file/d/1dkLibk6iWkf6qC47zGEWYwXuTYlJSINh/view?usp=drive_link",
    content: (
      <>
        <h2>Overview</h2>
        <p>
          As an admin, you can manually create a partner account on the platform. This is useful when partners are unable to sign up themselves or when records
          are collected through offline or manual processes.
        </p>

        <h2>Accessing partner management</h2>
        <ol>
          <li>Log in using your admin account.</li>
          <li>
            Navigate to the <strong>Admin</strong> view.
          </li>
          <li>
            Click on <strong>Partner Management</strong>.
          </li>
          <li>
            At the top of the page, click <strong>Add New Partner</strong>.
          </li>
        </ol>

        <h2>Filling in partner details</h2>
        <p>A modal will open allowing you to enter the partner’s details. Fill in the required fields carefully.</p>

        <ul>
          <li>First name and last name</li>
          <li>Email address</li>
          <li>Phone number</li>
          <li>Division and chapter</li>
          <li>Category and permission type</li>
          <li>Date of birth</li>
          <li>Gender and nationality</li>
          <li>Residential address</li>
        </ul>

        <h2>Admin permissions and visibility</h2>
        <ul>
          <li>Divisional admins can view and assign partners to multiple chapters within their division.</li>
          <li>Chapter admins can only add partners to their own chapter.</li>
          <li>You cannot assign a permission level higher than your own admin role.</li>
        </ul>

        <h2>Creating the partner account</h2>
        <ol>
          <li>Review all entered details to ensure they are accurate.</li>
          <li>
            Click <strong>Create Partner</strong>.
          </li>
          <li>A partner record will be created on the platform.</li>
          <li>The partner will receive an email and message containing their login details and a default password.</li>
        </ol>

        <h2>If the partner already exists</h2>
        <p>
          If the partner is already registered, you will see a notification indicating that the user already exists. You can then choose to continue creating
          new partners or take another appropriate action.
        </p>

        <h2>Things to note</h2>
        <ul>
          <li>Always ensure partner details are entered correctly to avoid duplication.</li>
          <li>Partners should be advised to change their default password after logging in for the first time.</li>
        </ul>

        <h2>Need help?</h2>
        <p>
          If you have any questions while adding partners manually, please contact the support team by emailing{" "}
          <a href="mailto:support@globalgospelpartnership.org">support@globalgospelpartnership.org</a>.
        </p>
      </>
    ),
  },
];

export const divisionalAdminGuides: AdminGuide[] = [
  {
    slug: "record-offline-payment-divisional-admin",
    title: "Record Offline Payments (Divisional Admin)",
    intro: "This guide explains how divisional admins can record offline payments made by partners, such as bank transfers or manual payments.",
    category: "Admin",
    videoUrl: "https://drive.google.com/file/d/1piE_vdxMTVFxE-rTXvjOR2GLjkjP6RAe/view?usp=drive_link",
    content: (
      <>
        <h2>Overview</h2>
        <p>
          Divisional admins can record payments that were made outside the platform, such as bank transfers or other offline payment methods. This ensures
          partner records remain accurate and up to date.
        </p>

        <h2>Accessing remission management</h2>
        <ol>
          <li>Log in using your divisional admin account.</li>
          <li>
            Navigate to the <strong>Admin</strong> views.
          </li>
          <li>
            Click on <strong>Remission Management</strong>.
          </li>
        </ol>

        <h2>Adding a new offline remission</h2>
        <ol>
          <li>
            On the Remission Management page, click <strong>Add New Remission</strong>.
          </li>
          <li>A modal will open allowing you to record a payment manually.</li>
        </ol>

        <h2>Identifying the correct partner</h2>
        <p>To ensure the payment is recorded against the correct partner, you will need the partner’s unique code.</p>

        <ol>
          <li>
            Go to <strong>Partner Management</strong>.
          </li>
          <li>Search for the partner by name.</li>
          <li>Open the partner’s details and copy their unique partner code.</li>
          <li>
            Return to <strong>Remission Management</strong> and paste the code into the partner code field.
          </li>
        </ol>

        <p>
          Once entered, the partner’s name will appear beneath the code to confirm you are working with the correct person. If an invalid code is entered, the
          system will indicate that the user is unknown.
        </p>

        <h2>Entering payment details</h2>
        <ol>
          <li>Enter the remission amount.</li>
          <li>Optionally, add a description to provide context for the payment (for example, bank transfer reference).</li>
          <li>Confirm that the partner’s division and chapter are correctly pre-filled.</li>
          <li>If any details appear incorrect, take a screenshot and report the issue to the support team.</li>
        </ol>

        <h2>Selecting remission month and payment date</h2>
        <ol>
          <li>Select the remission month the payment is intended for.</li>
          <li>Select the actual date the payment was made.</li>
          <li>Note that future payment dates cannot be selected, as payments must have already occurred.</li>
        </ol>

        <h2>Submitting the payment</h2>
        <ol>
          <li>Review all entered details carefully.</li>
          <li>
            Click <strong>Submit</strong> to record the payment.
          </li>
          <li>The payment will be logged immediately against the partner’s record.</li>
        </ol>

        <h2>After submission</h2>
        <p>
          Once recorded, the payment will appear in the remission list showing the amount, remission period, and the name of the admin who approved the payment.
        </p>

        <h2>Things to note</h2>
        <ul>
          <li>Only divisional admins can record offline payments across multiple chapters.</li>
          <li>Your name will be displayed as the approving admin for the payment.</li>
          <li>Always verify partner details before submitting to avoid misallocation.</li>
        </ul>

        <h2>Need help?</h2>
        <p>
          If you have any questions or encounter issues while recording offline payments, please contact the support team by emailing{" "}
          <a href="mailto:support@globalgospelpartnership.org">support@globalgospelpartnership.org</a>.
        </p>
      </>
    ),
  },
  {
    slug: "review-pending-remissions",
    title: "Reviewing Pending Remissions (Divisional Admin)",
    intro:
      "This guide explains how divisional admins can review, verify, approve, or reject pending offline remission claims.",
    category: "Admin",
    videoUrl: "https://drive.google.com/file/d/123WAo5IwErTjqPNBSmq7cAGyBKjqCbhT/view?usp=drive_link",
    content: (
      <>
        <h2>Overview</h2>
        <p>
          Pending remissions are offline payments logged by chapter admins or partners that require verification before
          being confirmed. As a divisional admin, you are responsible for reviewing these claims to ensure accuracy and
          integrity of remission records.
        </p>

        <h2>Accessing pending remissions</h2>
        <ol>
          <li>
            Log in using your divisional admin account.
          </li>
          <li>
            Access the <strong>Admin</strong> views.
          </li>
          <li>
            Click on <strong>Pending Remissions</strong> from the navigation.
          </li>
        </ol>

        <p>
          This will display a list of all pending remissions within your authorised scope.
        </p>

        <h2>Filtering and searching pending remissions</h2>
        <p>
          Because the list of pending remissions can be large, you can narrow down records using search and filter tools.
        </p>

        <ul>
          <li>
            Search for specific partners by name or personal code.
          </li>
          <li>
            Apply filters such as <strong>Chapter</strong> to view pending remissions for a specific chapter.
          </li>
          <li>
            Clear or adjust filters as needed to refine your view.
          </li>
        </ul>

        <h2>Reviewing a pending remission</h2>
        <ol>
          <li>
            Click on a pending remission record.
          </li>
          <li>
            A modal will open showing the full details of the remission claim.
          </li>
        </ol>

        <p>
          Unlike other views where details open in a side panel, this modal is designed for action because you are
          expected to either approve or reject the record.
        </p>

        <h2>Verifying remission details</h2>
        <p>
          Carefully review the information provided in the remission claim.
        </p>

        <ul>
          <li>
            Confirm the personal code and partner name match the intended individual.
          </li>
          <li>
            Verify the amount claimed matches the actual amount received.
          </li>
          <li>
            Review the remission period to ensure it reflects the correct month.
          </li>
          <li>
            Check the payment date and adjust it if necessary to reflect when funds were actually received.
          </li>
          <li>
            Confirm the chapter and division details are correct.
          </li>
          <li>
            Update or add descriptive details if additional context is required.
          </li>
        </ul>

        <p>
          These checks ensure that offline claims are accurate and prevent incorrect or inflated records from entering
          the system.
        </p>

        <h2>Approving a pending remission</h2>
        <ol>
          <li>
            If all details are correct, make any necessary adjustments.
          </li>
          <li>
            Click <strong>Approve</strong> to confirm the remission.
          </li>
          <li>
            The payment will be marked as approved and included in official records.
          </li>
        </ol>

        <h2>Rejecting a pending remission</h2>
        <p>
          If the claim is incorrect or no payment was actually received, you should reject the remission.
        </p>

        <ol>
          <li>
            Click <strong>Reject</strong>.
          </li>
          <li>
            The payment will be cancelled and removed from confirmed records.
          </li>
        </ol>

        <p>
          Rejected remissions do not contribute to statistics or totals, ensuring data accuracy and accountability.
        </p>

        <h2>Why this process matters</h2>
        <p>
          The pending remissions workflow prevents unverified claims from affecting reports and ensures that all offline
          payments are either validated through online systems or reviewed and approved by divisional admins.
        </p>

        <h2>Need help?</h2>
        <p>
          If you need clarification or assistance with approving or rejecting remission claims, please contact the
          support team by emailing{" "}
          <a href="mailto:support@globalgospelpartnership.org">
            support@globalgospelpartnership.org
          </a>.
        </p>
      </>
    ),
  },
  {
    slug: "manage-media-assets",
    title: "Manage Media Assets (Divisional Admin)",
    intro:
      "This guide explains how division Admins can upload, view, and manage media assets for use in emails and other communications.",
    category: "Admin",
    videoUrl: "https://drive.google.com/file/d/1nliyaMoNndPlXym08FBuJX9m4E4G5Tj_/view?usp=drive_link",
    content: (
      <>
        <h2>Overview</h2>
        <p>
          Media Assets allow division Admins to upload and manage images that can be reused across the platform, especially
          for mailing and partner communications. All uploaded assets are scoped to your division.
        </p>

        <h2>Accessing media asset management</h2>
        <ol>
          <li>
            Log in using your division Admin account.
          </li>
          <li>
            Navigate to the <strong>Admin</strong> page.
          </li>
          <li>
            Open the <strong>Tools</strong> section.
          </li>
          <li>
            Click on <strong>Manage Media Assets</strong>.
          </li>
        </ol>

        <h2>Viewing existing media assets</h2>
        <p>
          Once on the Manage Media Assets page, you will see a list of all images that have been uploaded within your
          division.
        </p>

        <ul>
          <li>
            These images can be reused for emails and other communication features.
          </li>
          <li>
            Clicking on an image allows you to view it in a larger size.
          </li>
        </ul>

        <h2>Using media assets in mailings</h2>
        <ol>
          <li>
            Open any uploaded image.
          </li>
          <li>
            Click on <strong>Copy URL</strong> to copy the image link.
          </li>
          <li>
            Use the copied URL when composing emails or sending communications to partners.
          </li>
        </ol>

        <h2>Uploading a new image</h2>
        <ol>
          <li>
            Click on the option to add a new picture.
          </li>
          <li>
            Enter a title for the image to help identify it later.
          </li>
          <li>
            Select an image file from your device.
          </li>
          <li>
            Click <strong>Upload</strong> to add the image to your media assets.
          </li>
        </ol>

        <p>
          Once uploaded, the image becomes immediately available for use across your division.
        </p>

        <h2>Important things to note</h2>
        <ul>
          <li>
            Only image files can be uploaded to the media assets section.
          </li>
          <li>
            All uploaded images are scoped to your division and cannot be accessed by other divisions.
          </li>
        </ul>

        <h2>Why this tool is useful</h2>
        <p>
          Managing media assets centrally ensures consistent messaging, faster email creation, and easy reuse of approved
          images across communications.
        </p>

        <h2>Need help?</h2>
        <p>
          If you have any questions about uploading or managing media assets, please contact the support team by emailing{" "}
          <a href="mailto:support@globalgospelpartnership.org">
            support@globalgospelpartnership.org
          </a>.
        </p>
      </>
    ),
  },
  {
    slug: "send-email-messages-to-partners",
    title: "Send Email Messages to Partners (Divisional Admin)",
    intro:
      "This guide explains how admins can compose, preview, and send email messages to partners using dynamic content, filters, and media assets.",
    category: "Admin",
    videoUrl: "https://drive.google.com/file/d/1lg7yVPO8_7gmhJDp7LQpC53ah32wMfGi/view?usp=drive_link",
    content: (
      <>
        <h2>Overview</h2>
        <p>
          The Partner Messaging feature allows admins to send formatted email messages to partners within their scope.
          Messages can include dynamic placeholders, images, links, and can be targeted to specific groups using filters.
        </p>

        <h2>Accessing partner messaging</h2>
        <ol>
          <li>Log in using your admin account.</li>
          <li>Access the <strong>Admin</strong> views.</li>
          <li>Click on <strong>Partner Messaging</strong>.</li>
        </ol>

        <h2>Creating your email message</h2>
        <p>
          It is recommended to start by composing the message before selecting recipients.
        </p>

        <ol>
          <li>
            Enter the <strong>Subject</strong> of the email.
          </li>
          <li>
            Use the <strong>Message Body</strong> editor to write the email content.
          </li>
          <li>
            Use the editor toolbar to format text, including bold, italics, underline, lists, and text alignment.
          </li>
        </ol>

        <h2>Using dynamic placeholders</h2>
        <p>
          Placeholders allow your message to adapt automatically to each recipient.
        </p>

        <ul>
          <li>First name and last name</li>
          <li>Email address and phone number</li>
          <li>Address and nationality</li>
          <li>Partner status</li>
          <li>Date of birth</li>
          <li>Category</li>
          <li>Unique partner code</li>
          <li>Chapter name and division name</li>
        </ul>

        <p>
          To insert a placeholder, place your cursor where the value should appear and select the desired placeholder from
          the list. The system will replace it dynamically for each recipient.
        </p>

        <h2>Previewing your message</h2>
        <ol>
          <li>
            Select one or more users to enable preview.
          </li>
          <li>
            Click <strong>Preview</strong> to see how the email will appear for the selected user.
          </li>
          <li>
            Preview with different users to confirm placeholders are resolving correctly.
          </li>
        </ol>

        <h2>Formatting tips</h2>
        <ul>
          <li>
            Press <strong>Enter</strong> to create a larger space between paragraphs.
          </li>
          <li>
            Press <strong>Shift + Enter</strong> to move text to a new line without adding extra spacing.
          </li>
          <li>
            Use lists and alignment tools to improve readability.
          </li>
        </ul>

        <h2>Adding links</h2>
        <p>
          You can paste links directly into the message body, such as payment links or external resources. These links
          will appear as clickable links in the email.
        </p>

        <h2>Working with images</h2>
        <p>
          The editor supports inserting images using different layouts.
        </p>

        <ul>
          <li>Single image in a row</li>
          <li>Two images side-by-side</li>
          <li>Three images in a row (maximum)</li>
        </ul>

        <h3>Uploading and using images</h3>
        <ol>
          <li>
            Open <strong>Manage Media Assets</strong> in a separate tab.
          </li>
          <li>
            Upload a new image or select an existing one.
          </li>
          <li>
            Copy the image URL.
          </li>
          <li>
            Return to the message editor and insert the image using the URL.
          </li>
          <li>
            Add descriptive alternative text if required.
          </li>
        </ol>

        <h2>Selecting recipients</h2>
        <p>
          Once your message is ready, choose who should receive it.
        </p>

        <ul>
          <li>Select individual partners by searching their names.</li>
          <li>Use <strong>Select All</strong> to send to everyone in your scope.</li>
          <li>Clear selections to start again if needed.</li>
        </ul>

        <h2>Using filters to target recipients</h2>
        <p>
          Filters allow you to target specific groups of partners.
        </p>

        <ul>
          <li>Filter by partner status (for example, not consistent).</li>
          <li>Filter by deferred remission day or date ranges.</li>
          <li>Combine filters to narrow down recipients further.</li>
        </ul>

        <p>
          After applying filters, you can select all users in the filtered list, preview the message again, and proceed
          to send.
        </p>

        <h2>Sending the email</h2>
        <ol>
          <li>
            Always preview the message one final time.
          </li>
          <li>
            It is recommended to send the message to yourself first for confirmation.
          </li>
          <li>
            Once satisfied, click <strong>Send</strong> to deliver the email to all selected recipients.
          </li>
        </ol>

        <h2>Why this feature is important</h2>
        <p>
          Partner Messaging helps admins keep partners informed, send reminders, and communicate important updates using
          personalised and well-formatted emails.
        </p>

        <h2>Need help?</h2>
        <p>
          If you need assistance with sending messages or using placeholders and filters, please contact the support team
          by emailing{" "}
          <a href="mailto:support@globalgospelpartnership.org">
            support@globalgospelpartnership.org
          </a>.
        </p>
      </>
    ),
  },
  {
    slug: "manage-chapters",
    title: "Manage Chapters (Divisional Admin)",
    intro:
      "This guide explains how division Admins can manage chapters within their division, including viewing, updating, and creating chapters.",
    category: "Admin",
    videoUrl: "https://drive.google.com/file/d/1c9iixGBj3Y7xjW1_xjV5eWrsMjzIlquD/view?usp=drive_link",
    content: (
      <>
        <h2>Overview</h2>
        <p>
          As a division Admin, you have access to tools that allow you to manage chapters under your division. This
          includes viewing chapter details, updating chapter information, and creating new chapters where necessary.
        </p>

        <h2>Accessing manage entities</h2>
        <ol>
          <li>
            Log in using your division Admin account.
          </li>
          <li>
            Open the <strong>Tools</strong> navigation.
          </li>
          <li>
            Click on <strong>Manage Entities</strong>.
          </li>
        </ol>

        <h2>Viewing chapters under your division</h2>
        <p>
          On the Manage Entities page, you will see a list of chapters that fall under your division.
        </p>

        <ul>
          <li>
            You can expand the list to view more chapters.
          </li>
          <li>
            Visibility is limited to chapters within your division.
          </li>
          <li>
            Filtering options allow you to narrow the list if needed.
          </li>
        </ul>

        <h2>Updating chapter details</h2>
        <p>
          You can click on any chapter row to view and update its details.
        </p>

        <ol>
          <li>
            Select a chapter from the list.
          </li>
          <li>
            Update editable fields such as the chapter name.
          </li>
          <li>
            If required, change the division the chapter belongs to (for example, if a chapter is transferred).
          </li>
          <li>
            Update the country associated with the chapter if necessary.
          </li>
          <li>
            Update the chapter’s operating currency.
          </li>
          <li>
            Click <strong>Update</strong> to save your changes.
          </li>
        </ol>

        <p>
          Updating the chapter currency will affect how remissions and calculations are handled for that chapter.
        </p>

        <h2>Creating a new chapter</h2>
        <ol>
          <li>
            From the Manage Entities page, click on the option to add a new chapter.
          </li>
          <li>
            Enter the chapter name.
          </li>
          <li>
            Select the division the chapter belongs to.
          </li>
          <li>
            Choose the country where the chapter is based.
          </li>
          <li>
            Select the operating currency for the chapter.
          </li>
          <li>
            Submit the form to create the new chapter.
          </li>
        </ol>

        <p>
          Once created, the new chapter will appear in the list under the selected division.
        </p>

        <h2>Understanding chapter representatives</h2>
        <p>
          Each chapter includes information about its representative.
        </p>

        <ul>
          <li>
            Hover over the representative icons in the table to view the names of chapter representatives.
          </li>
          <li>
            This helps identify who is responsible for each chapter.
          </li>
        </ul>

        <h2>Why this tool is important</h2>
        <p>
          Managing chapters effectively ensures accurate reporting, correct currency handling, and proper organisational
          structure across divisions.
        </p>

        <h2>Need help?</h2>
        <p>
          If you have any questions about managing chapters or creating new chapters, please contact the support team by
          emailing{" "}
          <a href="mailto:support@globalgospelpartnership.org">
            support@globalgospelpartnership.org
          </a>.
        </p>
      </>
    ),
  },
];
