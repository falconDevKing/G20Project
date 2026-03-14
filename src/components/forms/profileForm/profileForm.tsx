import * as z from "zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updatePassword } from "aws-amplify/auth";
import dayjs from "dayjs";

import { profileFormSchema, profilePasswordSchema } from "@/lib/schemas";
import { useAppSelector } from "@/redux/hooks";
import { initialiseOptions } from "@/lib/utils";
import { updateUser } from "@/services/auth";
import { getFileUrl } from "@/services/storage";
import { SuccessHandler, ErrorHandler } from "@/lib/toastHandlers";
import { PartnerRowType } from "@/supabase/modifiedSupabaseTypes";
import { Countries } from "../../../constants/index";
import { getG20CategoryLabel, getG20CategoryOptions } from "@/lib/g20Categories";

import { ProfileCardWrapper } from "./ProfileCard-wapper";
import { ProfileDisplay } from "./ProfileDisplay";
import { EditProfileDialog } from "./EditProfileDialog";
import { ChangePasswordDialog } from "./ChangePasswordDialog";
import { G20DashboardHeader } from "@/components/dashboard/g20DashboardHeader";

export const ProfileForm = () => {
  const user = useAppSelector((state) => state.auth.userDetails);
  const appState = useAppSelector((state) => state.app);

  const { DivisionOptions, ChapterOptions } = initialiseOptions(appState);

  const [userProfile, setUserProfile] = useState<PartnerRowType>(user as PartnerRowType);
  const [isOpenProfile, setIsOpenProfile] = useState(false);
  const [isOpenHeroChangePassword, setIsOpenHeroChangePassword] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [currentPasswordVisible, setCurrentPasswordVisible] = useState(false);
  const [newPasswordVisible, setNewPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [fileUrlToUse, setFileUrlToUse] = useState<string>();
  const g20CategoryOptions = getG20CategoryOptions({
    chapterId: userProfile?.chapter_id,
    locationCurrency: appState.locationCurrency,
    fallbackCurrency: appState.fallbackCurrency,
  });

  const profileFormInstance = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      unique_code: userProfile?.unique_code || "",
      last_name: userProfile?.last_name || "",
      first_name: userProfile?.first_name || "",
      phone_number: userProfile?.phone_number || "",
      image_url: userProfile?.image_url || "",
      address: userProfile?.address || "",
      gender: userProfile?.gender || "",
      nationality: userProfile?.nationality || "",
      birth_day: dayjs(userProfile?.date_of_birth).date().toString() || "1",
      birth_month: dayjs(userProfile?.date_of_birth).month().toString() || "0",
      email: userProfile?.email || "",
      division_id: userProfile?.division_id || "",
      chapter_id: userProfile?.chapter_id || "",
      g20_category: userProfile?.g20_category || "",
      g20_amount: userProfile?.g20_amount || 0,
      married: userProfile?.married ? "Yes" : "No",
      anniversary_day: userProfile?.marriage_anniversary ? dayjs(userProfile?.marriage_anniversary).format("DD") : "",
      anniversary_month: userProfile?.marriage_anniversary ? dayjs(userProfile?.marriage_anniversary).format("MM") : "",
      motivation: userProfile?.motivation || "",
    },
  });

  const passwordFormInstance = useForm<z.infer<typeof profilePasswordSchema>>({
    resolver: zodResolver(profilePasswordSchema),
    defaultValues: {
      current_password: "",
      new_password: "",
      confirm_password: "",
    },
  });

  const handleProfileSubmit = async (values: z.infer<typeof profileFormSchema>) => {
    try {
      setIsPending(true);

      const updatedUserProfile = await updateUser({
        id: userProfile.id,
        last_name: values.last_name,
        first_name: values.first_name,
        phone_number: values.phone_number,
        address: values.address,
        gender: values.gender,
        image_url: values.image_url,
        nationality: values.nationality,
        g20_category: values.g20_category || null,
        g20_amount: Number(values.g20_amount || 0),
        married: values.married === "Yes",
        marriage_anniversary:
          values.married === "Yes" && values.anniversary_month && values.anniversary_day
            ? dayjs()
                .month(parseInt(values.anniversary_month) - 1)
                .date(parseInt(values.anniversary_day))
                .format("YYYY-MM-DD")
            : null,
        motivation: values.motivation || null,
        date_of_birth:
          values.birth_month && values.birth_day
            ? dayjs()
                .month(parseInt(values.birth_month) - 1)
                .date(parseInt(values.birth_day))
                .toISOString()
            : userProfile?.date_of_birth,
      });

      if (!updatedUserProfile) {
        throw new Error("Could update profile");
      }

      setUserProfile(updatedUserProfile);
      SuccessHandler("Profile updated");
      setIsOpenProfile(false);
    } catch (error) {
      console.log("update profile error", error);
      ErrorHandler("Something went wrong");
    } finally {
      setIsPending(false);
    }
  };

  const handlePasswordSubmit = async (values: z.infer<typeof profilePasswordSchema>) => {
    try {
      setIsPending(true);

      await updatePassword({
        oldPassword: values.current_password,
        newPassword: values.new_password,
      });

      setIsOpenHeroChangePassword(false);
      passwordFormInstance.reset();
      SuccessHandler("Password updated successfully");
    } catch (error) {
      console.log("update password error", error);
      ErrorHandler("Something went wrong");
    } finally {
      setIsPending(false);
    }
  };

  useEffect(() => {
    const filePath = userProfile.image_url;

    const updateFileUrl = async () => {
      const fileUrl = await getFileUrl(filePath as string);
      setFileUrlToUse(fileUrl || "");
    };

    if (filePath) {
      updateFileUrl();
    } else {
      setFileUrlToUse("");
    }
  }, [userProfile.image_url]);

  useEffect(() => {
    setUserProfile(user as PartnerRowType);
  }, [user]);

  useEffect(() => {
    profileFormInstance.reset({
      unique_code: userProfile?.unique_code || "",
      last_name: userProfile?.last_name || "",
      first_name: userProfile?.first_name || "",
      phone_number: userProfile?.phone_number || "",
      image_url: userProfile?.image_url || "",
      address: userProfile?.address || "",
      gender: userProfile?.gender || "",
      nationality: userProfile?.nationality || "",
      birth_day: userProfile?.date_of_birth ? dayjs(userProfile.date_of_birth).date().toString() : "1",
      birth_month: userProfile?.date_of_birth ? (dayjs(userProfile.date_of_birth).month() + 1).toString() : "1",
      email: userProfile?.email || "",
      division_id: userProfile?.division_id || "",
      chapter_id: userProfile?.chapter_id || "",
      g20_category: userProfile?.g20_category || "",
      g20_amount: userProfile?.g20_amount || 0,
      married: userProfile?.married ? "Yes" : "No",
      anniversary_day: userProfile?.marriage_anniversary ? dayjs(userProfile.marriage_anniversary).format("DD") : "",
      anniversary_month: userProfile?.marriage_anniversary ? dayjs(userProfile.marriage_anniversary).format("MM") : "",
      motivation: userProfile?.motivation || "",
    });
  }, [profileFormInstance, userProfile]);

  const divisionName = DivisionOptions.find((division) => division.value === userProfile.division_id)?.name || "";
  const chapterName = ChapterOptions.find((chapter) => chapter.value === userProfile.chapter_id)?.name || "";
  const nationalityLabel = Countries.find((country) => country.value === userProfile.nationality)?.label || "";
  const shepherdName = (appState.shepherdEntities || []).find((shepherd) => shepherd.id === userProfile.shepherd_id)?.name || "";
  const governorName = (appState.governorEntities || []).find((governor) => governor.id === userProfile.governor_id)?.name || "";
  const presidentName = (appState.presidentEntities || []).find((president) => president.id === userProfile.president_id)?.name || "";
  const displayName = `${userProfile.first_name || ""} ${userProfile.last_name || ""}`.trim() || "Partner profile";
  const roleLabel =
    getG20CategoryLabel(userProfile.g20_category, {
      chapterId: userProfile.chapter_id,
      locationCurrency: appState.locationCurrency,
      fallbackCurrency: appState.fallbackCurrency,
    }) || "Partner";
  const g20CategoryLabel =
    getG20CategoryLabel(userProfile.g20_category, {
      chapterId: userProfile.chapter_id,
      locationCurrency: appState.locationCurrency,
      fallbackCurrency: appState.fallbackCurrency,
    }) || "Not selected";
  const formattedDob = userProfile.date_of_birth ? dayjs(userProfile.date_of_birth).format("DD MMMM") : "";
  const formattedAnniversary = userProfile.marriage_anniversary ? dayjs(userProfile.marriage_anniversary).format("DD MMMM") : "";

  return (
    <>
      <G20DashboardHeader page="profile" />

      <ProfileCardWrapper>
        <EditProfileDialog
          open={isOpenProfile}
          setOpen={setIsOpenProfile}
          form={profileFormInstance}
          isPending={isPending}
          onSubmit={handleProfileSubmit}
          userId={user.id}
          DivisionOptions={DivisionOptions}
          ChapterOptions={ChapterOptions}
          g20CategoryOptions={g20CategoryOptions}
        />

        <ChangePasswordDialog
          open={isOpenHeroChangePassword}
          setOpen={setIsOpenHeroChangePassword}
          form={passwordFormInstance}
          isPending={isPending}
          onSubmit={handlePasswordSubmit}
          currentPasswordVisible={currentPasswordVisible}
          setCurrentPasswordVisible={setCurrentPasswordVisible}
          newPasswordVisible={newPasswordVisible}
          setNewPasswordVisible={setNewPasswordVisible}
          confirmPasswordVisible={confirmPasswordVisible}
          setConfirmPasswordVisible={setConfirmPasswordVisible}
        />

        <ProfileDisplay
          userProfile={userProfile}
          fileUrlToUse={fileUrlToUse}
          displayName={displayName}
          roleLabel={roleLabel}
          g20CategoryLabel={g20CategoryLabel}
          divisionName={divisionName}
          chapterName={chapterName}
          nationalityLabel={nationalityLabel}
          formattedDob={formattedDob}
          formattedAnniversary={formattedAnniversary}
          shepherdName={shepherdName}
          governorName={governorName}
          presidentName={presidentName}
          onEditProfile={() => setIsOpenProfile(true)}
          onChangePassword={() => setIsOpenHeroChangePassword(true)}
        />
      </ProfileCardWrapper>
    </>
  );
};
