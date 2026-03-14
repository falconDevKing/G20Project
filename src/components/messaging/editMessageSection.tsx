import { Button } from "../ui/button";
import { PartnerRowType } from "@/supabase/modifiedSupabaseTypes";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandItem, CommandList } from "@/components/ui/command";
import MessageToolbar from "./toolbar";
import { Editor, EditorContent } from "@tiptap/react";
import { placeholderOptions } from "@/constants";
import { Check } from "lucide-react";
import { Input } from "../ui/input";
import { insertPlaceholder } from "./messagingTools";
import { DynamicFilter } from "../dynamicFilters/DynamicFilters";
import { useState } from "react";
import { useAppSelector } from "@/redux/hooks";

interface EditMessageSectionProps {
  selectAllUsers: boolean;
  selectedUsers: PartnerRowType[];
  tableDataCount: number;
  tableData: PartnerRowType[];
  updateTableData: (data: Record<string, any>[]) => void;
  updateTableDataCount: (count: number) => void;
  getFilterData: React.Dispatch<React.SetStateAction<Record<string, any>[]>>;
  selectAllUsersFunction: () => void;
  clearSelection: () => void;
  editor: Editor;
  inputOnChange: (e: any) => void;
  subject: string;
  toggleUser: (user: PartnerRowType) => void;
}

const PAGE_SIZE = "20";
const page = 1;

const EditMessageSection = ({
  editor,
  subject,
  tableData,
  toggleUser,
  getFilterData,
  inputOnChange,
  selectedUsers,
  clearSelection,
  tableDataCount,
  selectAllUsers,
  updateTableData,
  updateTableDataCount,
  selectAllUsersFunction,
}: EditMessageSectionProps) => {
  const permission_type = useAppSelector((state) => state.auth.userDetails.permission_type);
  const [_, setPage] = useState<number>(1);
  return (
    <div className="p-1 pr-3 border-r-4 dark:border-GGP-darkGold space-y-3 ">
      {/* Filter by Chapter */}

      <div className="flex justify-between items-center">
        <div className="font-semibold text-lg sm:text-2xl dark:text-GGP-darkGold">Select Honourables</div>
        {/* <div className="block font-semibold mb-1">Filters</div> */}
        <DynamicFilter
          name={"Filter Users"}
          filterType={"Partner"}
          permission_type={permission_type}
          allow={"Admin"}
          getFilterData={getFilterData}
          updateTableData={updateTableData}
          updateTableDataCount={updateTableDataCount}
          paymentType=""
          page={page}
          setPage={setPage}
          pageSize={PAGE_SIZE}
          showPills={false}
          showSearch
        />
      </div>

      {/* Select Users */}
      <div>
        <div className="flex justify-end items-center py-2 gap-2">
          <Button variant={"destructive"} onClick={clearSelection} className="text-sm underline">
            Clear All Selection
          </Button>

          <Button variant={"custom"} onClick={selectAllUsersFunction} className="text-sm tunderline">
            Select All Users ({tableDataCount})
          </Button>
        </div>
        <Popover>
          <PopoverTrigger asChild className=" h-12">
            <Button variant="outline" className="w-full justify-between">
              {selectAllUsers
                ? `All ${tableDataCount} users selected`
                : selectedUsers.length === 1
                  ? `${selectedUsers.length} user selected`
                  : selectedUsers.length > 1
                    ? `${selectedUsers.length} user(s) selected`
                    : "Select users"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-0 w-full md:w-[575px]">
            <Command>
              {/* <CommandInput placeholder="Search users..." /> */}
              <CommandList className="max-h-48 overflow-auto">
                {tableData.map((user: any) => {
                  const isSelected = selectAllUsers || selectedUsers.some((u: any) => u.id === user.id);

                  return (
                    <CommandItem key={user.id} onSelect={() => toggleUser(user)} className="flex items-center justify-between">
                      <span>
                        {user.first_name || ""} {user.last_name || ""} – {user.email}
                      </span>
                      {isSelected && <Check className="w-4 h-4 text-green-600" />}
                    </CommandItem>
                  );
                })}
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        <p className="italic text-xs  text-muted-foreground mt-2">N.B: list showing top 10 honourables. Narrow filter to see specific details</p>
      </div>

      <div>
        <div className="block font-semibold mb-1 dark:text-GGP-darkGold">Message Subject</div>
        <Input type="text" value={subject} onChange={inputOnChange} placeholder="Enter subject (e.g., Gentle Reminder)" className="w-full p-2 border rounded" />
      </div>

      <div>
        <div className="block font-semibold mb-1 dark:text-GGP-darkGold">Insert Placeholder</div>
        <div className="flex flex-wrap gap-2">
          {placeholderOptions.map((opt) => (
            <button
              key={opt.key}
              onClick={() => insertPlaceholder(editor, opt.key)}
              className="px-1 py-1 text-xs border border-GGP-darkGold rounded dark:bg-transparent bg-gray-100 hover:bg-gray-200"
            >
              {"{"}
              {opt.label}
              {"}"}
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="block font-semibold mb-1 mt-4 dark:text-GGP-darkGold">Message Body</div>
        <div className="border rounded p-2 min-h-[200px]">
          <MessageToolbar MessageEditor={editor} />
          <EditorContent editor={editor} className="tiptap" placeholder="Type your message here.." />
        </div>
      </div>
    </div>
  );
};

export default EditMessageSection;
