import { useEffect, useState } from "react";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
// import Color from "@tiptap/extension-color";

import { ContainerFluid } from "@/components/containerFluid";
import { useValueDebounce } from "@/hooks/useValueDebounce";
import wrapInTemplate from "@/mailTemplates/appMessagingTemplateNew";

import { PartnerRowType } from "@/supabase/modifiedSupabaseTypes";

import { useAppSelector } from "@/redux/hooks";
import { initialiseDataList } from "@/lib/utils";
import { ErrorHandler, SuccessHandler } from "@/lib/toastHandlers";
import { PostPaymentReceiverHandler } from "@/services/paymentPostProcessor";
import { personaliseMessage } from "@/components/messaging/messagingTools";
import PreviewSection from "@/components/messaging/previewSection";
import EditMessageSection from "@/components/messaging/editMessageSection";
import { useTheme } from "@/components/themeProvider/theme-provider";
import { ImageRow } from "@/components/messaging/ImageRow";

const MessagePartners = () => {
  const appState = useAppSelector((state) => state.app);
  const user = useAppSelector((state) => state.auth.userDetails);
  const { theme } = useTheme();
  const { modifiedDivisions, modifiedChapters } = initialiseDataList(appState);

  const [selectedUsers, setSelectedUsers] = useState<PartnerRowType[]>([]);

  const { permission_type, division_id, chapter_id } = user;
  const [previewHtml, setPreviewHtml] = useState<string>("");
  const [subject, setSubject] = useState<string>("");
  const [hasPreviewed, setHasPreviewed] = useState<boolean>(false);
  const [selectAllUsers, setSelectAllUsers] = useState<boolean>(false);

  const [filterData, getFilterData] = useState<Record<string, any>[]>([]);
  const [tableData, setTableData] = useState<PartnerRowType[]>([]);
  const [tableDataCount, setTableDataCount] = useState<number>(1);

  const scopeFilter = [
    {
      field: `${permission_type}_id`,
      operator: "Equals",
      value: permission_type === "division" ? division_id : permission_type === "chapter" ? chapter_id : "all",
    },
  ];

  const updateTableData = (data: Record<string, any>[]) => {
    setTableData(data as PartnerRowType[]);
    selectAllUsers && setSelectedUsers([]);
    setSelectAllUsers(false);
  };
  const updateTableDataCount = (count: number) => {
    setTableDataCount(count);
  };

  const toggleUser = (user: PartnerRowType) => {
    setSelectAllUsers(false);
    setSelectedUsers((prev) => (prev.find((u) => u.id === user.id) ? prev.filter((u) => u.id !== user.id) : [...prev, user]));
  };

  const selectAllUsersFunction = () => {
    setSelectAllUsers(true);
    setSelectedUsers(tableData);
  };

  const clearSelection = () => {
    setSelectedUsers([]);
    setSelectAllUsers(false);
  };

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2] },
      }),
      // Color,
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          style: "color:#2563eb; text-decoration:underline;",
        },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Image.extend({
        addAttributes() {
          return {
            src: {
              default: null,
            },
            alt: {
              default: null,
            },
            title: {
              default: null,
            },
            width: {
              default: null,
            },
            height: {
              default: null,
            },
            style: {
              default: null,
              parseHTML: (element) => element.getAttribute("style"),
              renderHTML: (attributes) => {
                if (!attributes.style) {
                  return {};
                }
                return {
                  style: attributes.style,
                };
              },
            },
          };
        },
      }).configure({
        // inline: true,
        allowBase64: true,
        HTMLAttributes: {
          class: "tiptap-image",
        },
      }),
      ImageRow,
    ],

    content: "",
  });

  const inputOnChange = (e: any) => {
    setSubject(e?.target?.value);
    setHasPreviewed(false); // invalidate preview on change
  };

  const handlePreview = (): void => {
    const rawHtml = editor?.getHTML() || "";
    const first = selectAllUsers ? tableData[0] : selectedUsers[0];
    if (!first) return;

    const personalisedSubject = personaliseMessage(subject, first, modifiedDivisions, modifiedChapters);
    const personalisedBody = personaliseMessage(rawHtml, first, modifiedDivisions, modifiedChapters);
    const wrapped = wrapInTemplate(personalisedBody, personalisedSubject, theme === "dark");

    setPreviewHtml(wrapped);
    setHasPreviewed(true);
  };

  const handleSend = async (): Promise<void> => {
    try {
      if (!hasPreviewed) {
        ErrorHandler("Please preview the message before sending.");
        return;
      }
      setHasPreviewed(false); // Reset to avoid double click

      const body = editor?.getHTML() ?? "";

      const sendMessageRequest = {
        subject,
        body,
        filterData: selectAllUsers ? [...filterData, scopeFilter] : [],
        selectedUsersIds: selectAllUsers ? [] : selectedUsers.map((user) => user.id),
      };

      await PostPaymentReceiverHandler({
        processingCase: "send_user_messages",
        processingPayload: sendMessageRequest,
      });

      clearSelection();
      setSubject("");
      setPreviewHtml(""); //editor.chain().clearContent().run();
      SuccessHandler("Messages sent successfully!");
    } catch (err: any) {
      console.log("error in sending mail", err?.message, err);
      ErrorHandler("Error in sending mails");
    }
  };

  const contentHtml = editor?.getHTML() ?? "";
  const debouncedHtml = useValueDebounce(contentHtml, 1000);

  useEffect(() => {
    handlePreview();
  }, [theme]);

  useEffect(() => {
    if (hasPreviewed) {
      setHasPreviewed(false);
    }
  }, [debouncedHtml]);

  return (
    <ContainerFluid>
      {/* <div className=""> */}
      <div className="grid grid-cols-1 md:grid-cols-2 h-screen">
        {/* Left Panel */}
        <EditMessageSection
          selectAllUsers={selectAllUsers}
          selectedUsers={selectedUsers}
          tableDataCount={tableDataCount}
          tableData={tableData}
          updateTableData={updateTableData}
          updateTableDataCount={updateTableDataCount}
          getFilterData={getFilterData}
          selectAllUsersFunction={selectAllUsersFunction}
          clearSelection={clearSelection}
          editor={editor}
          toggleUser={toggleUser}
          inputOnChange={inputOnChange}
          subject={subject}
        />

        {/* Right Panel */}
        <PreviewSection
          selectAllUsers={selectAllUsers}
          selectedUsers={selectedUsers}
          tableDataCount={tableDataCount}
          tableData={tableData}
          handlePreview={handlePreview}
          handleSend={handleSend}
          hasPreviewed={hasPreviewed}
          previewHtml={previewHtml}
          subject={subject}
        />
      </div>
    </ContainerFluid>
  );
};

export default MessagePartners;
