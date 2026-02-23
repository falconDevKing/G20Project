import { Button } from "../ui/button";
import { PartnerRowType } from "@/supabase/modifiedSupabaseTypes";

interface PreviewSectionProps {
  selectAllUsers: boolean;
  selectedUsers: PartnerRowType[];
  tableDataCount: number;
  tableData: PartnerRowType[];
  handlePreview: () => void;
  handleSend: () => Promise<void>;
  hasPreviewed: boolean;
  previewHtml: string;
  subject: string
}

const PreviewSection = ({
  selectAllUsers,
  selectedUsers,
  tableDataCount,
  tableData,
  handlePreview,
  handleSend,
  hasPreviewed,
  previewHtml,
  subject
}: PreviewSectionProps) => {
  return (
    <div className="p-1 pl-3 flex flex-col h-full">
      {/* Top Bar */}
      <div className="flex justify-between items-center gap-2 mb-4">
        <div className="text-sm text-gray-700 dark:text-gray-400">
          {!selectAllUsers && selectedUsers.length === 0 ? (
            <span className="text-red dark:text-white">No users selected</span>
          ) : (
            <span>
              Previewing message for <strong>{selectAllUsers ? tableData[0]?.first_name : selectedUsers[0]?.first_name}</strong> —{" "}
              {(selectAllUsers && tableDataCount) || selectedUsers.length} {!selectAllUsers && selectedUsers.length === 1 ? "recipient" : "recipients"}
            </span>
          )}
        </div>

        <div className="flex gap-2">
          <Button
            onClick={handlePreview}
            variant={"outline"}
            className={`px-4 py-2 rounded dark:border-white  ${selectedUsers.length === 0 && !selectAllUsers ? "hover:cursor-not-allowed" : ""}`}
            disabled={selectedUsers.length === 0 && !selectAllUsers && !!previewHtml}
          >
            Preview
          </Button>
          <Button
            onClick={handleSend}
            variant={"custom"}
            className={`px-4 py-2 rounded ${!hasPreviewed || !subject || (selectedUsers.length === 0 && !selectAllUsers) ? "hover:cursor-not-allowed" : ""}`}
            disabled={!hasPreviewed || !subject || (selectedUsers.length === 0 && !selectAllUsers && !!previewHtml)}
          >
            Send
          </Button>
        </div>
      </div>

      {/* Preview Section */}
      <div className="flex-1 border rounded bg-white dark:bg-transparent p-4 overflow-auto shadow-sm w-full max-w-[765px] self-center">
        {previewHtml && (selectedUsers.length || selectAllUsers) ? (
          <div className="text-gray-700 dark:text-white prose max-w-full" dangerouslySetInnerHTML={{ __html: previewHtml }} />
        ) : (
          <div className="text-gray-700 dark:text-gray-400 font-normal">Preview will appear here after you select users and click "Preview"</div>
        )}
      </div>
    </div>
  );
};

export default PreviewSection;
