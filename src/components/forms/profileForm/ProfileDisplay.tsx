import { ArrowLeft, Edit } from "lucide-react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { PartnerRowType } from "@/supabase/modifiedSupabaseTypes";

import { ProfileInfoItem, sectionCardClass } from "./profileShared";

type ProfileDisplayProps = {
  userProfile: PartnerRowType;
  fileUrlToUse?: string;
  displayName: string;
  roleLabel: string;
  divisionName: string;
  chapterName: string;
  nationalityLabel: string;
  formattedDob: string;
  formattedAnniversary: string;
  shepherdName: string;
  governorName: string;
  presidentName: string;
  onEditProfile: () => void;
  onChangePassword: () => void;
};

export const ProfileDisplay = ({
  userProfile,
  fileUrlToUse,
  displayName,
  roleLabel,
  divisionName,
  chapterName,
  nationalityLabel,
  formattedDob,
  formattedAnniversary,
  shepherdName,
  governorName,
  presidentName,
  onEditProfile,
  onChangePassword,
}: ProfileDisplayProps) => {
  return (
    <div className="grid gap-8 lg:grid-cols-[380px_minmax(0,1fr)] xl:grid-cols-[430px_minmax(0,1fr)]">
      <aside className="space-y-6">
        <div className="overflow-hidden rounded-[2rem] border border-[#d7c8a3]/55 bg-[linear-gradient(160deg,rgba(247,238,214,0.95),rgba(255,255,255,0.95)_40%,rgba(241,228,194,0.82))] p-5 shadow-[0_20px_60px_rgba(17,28,48,0.08)] dark:border-[#6b86b8]/35 dark:bg-[linear-gradient(160deg,rgba(38,56,89,0.97),rgba(51,71,109,0.94))]">
          <div className="relative">
            <div className="absolute -left-12 -top-12 h-36 w-36 rounded-full bg-[#d4b062]/20 blur-3xl" />
            <div className="absolute -bottom-10 right-0 h-28 w-28 rounded-full bg-[#111c30]/10 blur-3xl dark:bg-[#7ca2dd]/15" />
            <div className="relative space-y-5">
              <div className="flex items-center justify-between">
                <Link
                  to={"/dashboard"}
                  className="inline-flex items-center gap-2 rounded-full border border-[#d7c8a3]/60 bg-white/75 px-3 py-1.5 text-xs font-medium uppercase tracking-[0.16em] text-GGP-dark transition hover:bg-white dark:border-[#88a2d0]/30 dark:bg-white/10 dark:text-white"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Dashboard
                </Link>
                <span className="rounded-full bg-[#111c30] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-white dark:bg-[#d4b062] dark:text-[#111c30]">
                  {roleLabel}
                </span>
              </div>

              <div className="mx-auto flex h-[280px] w-[280px] items-center justify-center overflow-hidden rounded-[2.25rem] border border-white/80 bg-[#f6efe0] shadow-[0_20px_40px_rgba(17,28,48,0.12)] dark:border-[#88a2d0]/25 dark:bg-[linear-gradient(180deg,rgba(56,76,118,0.85),rgba(44,62,97,0.92))] sm:h-[320px] sm:w-[320px]">
                {fileUrlToUse ? (
                  <img src={fileUrlToUse} alt="Profile Avatar" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_top,rgba(212,176,98,0.28),transparent_55%),linear-gradient(180deg,#f5ecd7,#efe2be)] dark:bg-[radial-gradient(circle_at_top,rgba(124,162,221,0.2),transparent_55%),linear-gradient(180deg,rgba(62,84,128,0.95),rgba(45,65,102,0.96))]">
                    <svg className="h-24 w-24 text-[#c6a14a]/55 dark:text-[#d7e4fb]/45" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 12c2.75 0 5-2.25 5-5s-2.25-5-5-5-5 2.25-5 5 2.25 5 5 5zm0 2c-4.418 0-8 3.582-8 8h16c0-4.418-3.582-8-8-8z" />
                    </svg>
                  </div>
                )}
              </div>

              <div className="space-y-3 text-center lg:text-left">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.28em] text-[#8c7a58] dark:text-[#c8d7f1]">Profile</p>
                  <h1 className="mt-2 text-3xl font-semibold text-GGP-dark dark:text-white">{displayName}</h1>
                  <p className="mt-2 text-sm leading-6 text-GGP-dark/70 dark:text-white/75">
                    Keep your identity, partnership details, and account security in one place.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <ProfileInfoItem label="Partner Code" value={userProfile.unique_code || "Pending"} />
                  <ProfileInfoItem label="Phone" value={userProfile.phone_number || "Not provided"} />
                </div>
              </div>

              <div className="grid gap-3">
                <Button variant="custom" className="w-full" onClick={onEditProfile}>
                  <Edit />
                  Edit Profile
                </Button>

                <Button
                  variant="outline"
                  className="w-full border-[#bfa05a] bg-white/70 text-GGP-dark hover:bg-white dark:border-[#88a2d0]/35 dark:bg-white/10 dark:text-white"
                  onClick={onChangePassword}
                >
                  <Edit />
                  Change Password
                </Button>
              </div>
            </div>
          </div>
        </div>
      </aside>

      <div className="space-y-6">
        <section className={`${sectionCardClass} overflow-hidden`}>
          <div className="flex flex-col gap-4 border-b border-[#e8dcc0] pb-6 dark:border-[#88a2d0]/20 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-[0.28em] text-[#8c7a58] dark:text-[#c8d7f1]">Overview</p>
              <h2 className="mt-2 text-2xl font-semibold text-GGP-dark dark:text-white">Personal Identity</h2>
              <p className="mt-2 max-w-2xl text-sm text-GGP-dark/70 dark:text-white/75">
                Your core profile identity, contact details, and background information.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-3 md:w-[320px]">
              <ProfileInfoItem label="Partner Code" value={userProfile.unique_code || ""} />
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <ProfileInfoItem label="First Name" value={userProfile.first_name || ""} />
            <ProfileInfoItem label="Last Name" value={userProfile.last_name || ""} />
            <ProfileInfoItem label="Email" value={userProfile.email || ""} className="md:col-span-2 xl:col-span-1" />
            <ProfileInfoItem label="Phone Number" value={userProfile.phone_number || ""} />
            <ProfileInfoItem label="Date of Birth" value={formattedDob || "Not provided"} />
            <ProfileInfoItem label="Gender" value={userProfile.gender || ""} />
            <ProfileInfoItem label="Nationality" value={nationalityLabel || ""} />
            <ProfileInfoItem label="Address" value={userProfile.address || "Not provided"} className="md:col-span-2 xl:col-span-1" />
            <ProfileInfoItem label="Married" value={userProfile.married ? "Yes" : "Not yet"} />
            <ProfileInfoItem label="Marriage Anniversary" value={formattedAnniversary || "---"} />
          </div>
        </section>

        <section className={sectionCardClass}>
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-[0.28em] text-[#8c7a58] dark:text-[#c8d7f1]">Partnership</p>
              <h2 className="mt-2 text-2xl font-semibold text-GGP-dark dark:text-white">G20 And Commitment Details</h2>
              <p className="max-w-xl text-sm text-GGP-dark/70 dark:text-white/75">A clearer view of your giving profile and personal motivation.</p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <ProfileInfoItem label="G20 Category" value={userProfile.g20_category || "Not selected"} />
            <ProfileInfoItem label="G20 Amount" value={userProfile.g20_amount || 0} />
            <ProfileInfoItem label="Motivation" value={userProfile.motivation || "Not provided"} className="md:col-span-2 xl:col-span-2" />
          </div>
        </section>

        <section className={sectionCardClass}>
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-[0.28em] text-[#8c7a58] dark:text-[#c8d7f1]">Operational</p>
              <h2 className="mt-2 text-2xl font-semibold text-GGP-dark dark:text-white">Operational Structure</h2>
            </div>
            <p className="max-w-xl text-sm text-GGP-dark/70 dark:text-white/75">
              Your current division, chapter, and leadership structure within the partnership.
            </p>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <ProfileInfoItem label="Division" value={divisionName || "Not assigned"} />
            <ProfileInfoItem label="Chapter" value={chapterName || "Not assigned"} />
            <ProfileInfoItem label="Shepherd" value={shepherdName || "Not assigned"} />
            <ProfileInfoItem label="Governor" value={governorName || "Not assigned"} />
            <ProfileInfoItem label="President" value={presidentName || "Not assigned"} />
          </div>
        </section>

        <section className={sectionCardClass}>
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-[0.28em] text-[#8c7a58] dark:text-[#c8d7f1]">Security</p>
              <h2 className="mt-2 text-2xl font-semibold text-GGP-dark dark:text-white">Account Access</h2>
            </div>
            <p className="max-w-xl text-sm text-GGP-dark/70 dark:text-white/75">
              Use the password dialog to keep your account secure without exposing stored credentials here.
            </p>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <ProfileInfoItem label="Current Password" value="Hidden for security" />
            <ProfileInfoItem label="New Password" value="Updated in dialog" />
            <ProfileInfoItem label="Confirm Password" value="Updated in dialog" />
          </div>
        </section>
      </div>
    </div>
  );
};
