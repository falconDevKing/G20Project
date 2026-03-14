interface MobileTableCardProps {
  tableType: string;
  isDivision?: boolean;
}

const MobileTableHeader = ({ tableType, isDivision = false }: MobileTableCardProps) => {
  return (
    <div className=" bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-GGP-lightGold to-GGP-darkGold md:hidden rounded">
      {tableType === "entity" ? (
        <div>
          <div className="rounded-lg p-2 shadow-md m-1 min-w-[300px]">
            <div className="flex justify-between items-end p-0.5">
              <div>Name</div>
            </div>

            {!isDivision && (
              <div className="flex justify-between items-end p-0.5 capitalize">
                <div>Division Name</div>
                <div>Chapter Currency</div>
              </div>
            )}
            <div className="p-0.5">Rep Names</div>
          </div>
        </div>
      ) : tableType === "users" ? (
        <div>
          <div className="rounded-lg p-2 shadow-md m-1 min-w-[300px]">
            <div className="flex justify-between items-end p-0.5">
              <div className="text-sm font-bold">Name</div>
              <div>Birthday</div>
            </div>

            <div className="flex justify-between items-end p-0.5 py-1 capitalize">
              <div>Honourable Code</div>
              <div>Phone Number</div>
            </div>

            <div className="flex justify-between items-end p-0.5 py-1 capitalize">
              <div>G20 Category</div>
              <div>Status</div>
            </div>
            <div className="flex justify-between items-end p-0.5 capitalize">
              <div>Governor Name</div>
              <div>House</div>
            </div>
            <div className="flex justify-between items-end p-0.5 py-1">
              <div>Actions</div>
            </div>
          </div>
        </div>
      ) : tableType === "assignment" ? (
        <div>
          <div className="rounded-lg p-2 shadow-md m-1 min-w-[300px]">
            <div className="flex justify-between items-end p-0.5">
              <div className="text-sm font-bold">Name</div>
              <div>Email</div>
            </div>

            <div className="flex justify-between items-end p-0.5 py-1 capitalize">
              <div>Division</div>
              <div>Chapter</div>
            </div>
          </div>
        </div>
      ) : tableType === "hogUsers" ? (
        <div>
          <div className="rounded-lg p-2 shadow-md m-1 min-w-[300px]">
            <div className="flex justify-between items-end p-0.5">
              <div className="text-sm font-bold">Name</div>
              <div>G20 Code</div>
            </div>

            <div className="flex justify-between items-end p-0.5 capitalize">
              <div>Governor Name</div>
              <div>House</div>
            </div>

            <div className="flex justify-between items-end p-0.5 capitalize">
              <div>Remitted</div>
              <div>Forced</div>
            </div>

            <div className="flex justify-between items-end p-0.5 py-1 capitalize">
              <div>G20 Category</div>
              <div>Actions</div>
            </div>
          </div>
        </div>
      ) : tableType === "proposedSchedule" ? (
        <div>
          <div className="rounded-lg p-2 shadow-md m-1 min-w-[300px]">
            <div className="flex justify-between items-end p-0.5">
              <div>Proposed Date</div>
              <div>Status</div>
            </div>
            <div className="flex justify-between p-0.5">
              <div>Scheduled Year</div>
              <div>Line</div>
            </div>
            <div className="flex justify-between p-0.5">
              <div>Proposed Amount</div>
            </div>
          </div>
        </div>
      ) : tableType === "remissionHistoy" ? (
        <div>
          <div className="rounded-lg p-2 shadow-md m-1 min-w-[300px]">
            <div className="flex justify-between items-end p-0.5">
              <div>Payment Date</div>
            </div>
            <div className="flex justify-between  p-0.5">
              <div>Remission Period</div>
              <div>Amount</div>
            </div>
            <div className="flex justify-between italic text-xs  p-0.5">
              <div>Chapter Name</div>
              <div>Approved By</div>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <div className="rounded-lg p-2 shadow-md m-1 min-w-[300px]">
            <div className="flex justify-between items-end p-0.5">
              <div>Payment Date</div>
              <div>Honourable</div>
            </div>
            <div className="flex justify-between  p-0.5">
              <div>Remission Period</div>
              <div>Amount</div>
            </div>
            <div className="flex justify-between  p-0.5">
              <div>Chapter Name</div>
              <div>Approved By</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileTableHeader;
