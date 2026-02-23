// import { useState } from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AddEntityDialog from "./AddEntityDialog";
import EntityDataTable from "./EntityDataTable";
import { tabItems, chapterColumns, divisionColumns } from "@/interfaces/tools";
import { useAppSelector } from "@/redux/hooks";
import { initialiseDataList, ToolAccess } from "@/lib/utils";

export default function EntitiesPage() {
  const appState = useAppSelector((state) => state.app);
  const permission_type = useAppSelector((state) => state.auth.userDetails.permission_type);

  const userToolsAccess = ToolAccess[permission_type as string] || [];

  const { modifiedDivisions, modifiedChapters } = initialiseDataList(appState);

  return (
    <div>
      <div>
        <h1 className="md:text-2xl text-lg font-bold dark:text-white text-GGP-dark">Entities</h1>
        <p className="max-w-[530px] font-light text-base dark:text-white text-GGP-dark/75">
          Manage Chapters and Divisions Data
        </p>
      </div>

      <Tabs defaultValue="chapter" className="w-full">
        <div className="flex justify-end">
          <TabsList>
            {tabItems.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value}>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <TabsContent value="chapter">
          {userToolsAccess.includes("chapter") ? <AddEntityDialog label="Chapter" /> : <div className="min-h-[68px]"> </div>}
          <EntityDataTable label="Chapter" chapters={modifiedChapters} columns={chapterColumns(modifiedDivisions)} divisions={modifiedDivisions} />
        </TabsContent>

        <TabsContent value="division">
          {userToolsAccess.includes("division") ? <AddEntityDialog label="Division" /> : <div className="min-h-[68px]"> </div>}
          <EntityDataTable chapters={modifiedChapters} columns={divisionColumns} label="Division" divisions={modifiedDivisions} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
