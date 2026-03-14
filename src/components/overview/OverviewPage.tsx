// import { useState } from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { overviewItems } from "@/interfaces/tools";
import { PartnersOverview } from "./PartnersOverview";
import { RemissionsOverview } from "./RemissionsOverview";
import { useAppSelector } from "@/redux/hooks";

export default function OverviewPage() {
  const user = useAppSelector((state) => state.auth.userDetails);

  return (
    <div className="mb-4">
      <Tabs defaultValue="partners" className="w-full">
        <div className="flex flex-col md:flex-row md:justify-between">
          <div>
            <div className="pt-2 text-2xl lg:text-3xl font-bold dark:text-GGP-darkGold"> Welcome, Honourable {user.first_name}.</div>
            {/* <p className="max-w-[530px] mb-4 font-light text-base dark:text-white text-GGP-dark/75">
            Thank you for your commitment towards your partnership. Below are the records of your remissions.
            </p> */}
          </div>
          <TabsList>
            {overviewItems.map((tab) => (
              <TabsTrigger className="dark:text-white" key={tab.value} value={tab.value}>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <TabsContent value="partners">
          <PartnersOverview
          // label="Partners"
          // data={modifiedChapters}
          //  columns={chapterColumns(modifiedDivisions)}
          />
        </TabsContent>

        <TabsContent value="remissions">
          <RemissionsOverview
          //  data={modifiedremissionss}
          //  columns={divisionColumns}
          //   label="Remissions"
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
