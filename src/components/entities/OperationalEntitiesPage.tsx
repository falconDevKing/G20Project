import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AddEntityDialog from "./AddEntityDialog";
import OperationalEntityDataTable from "./OperationalEntityDataTable";
import { operationalTabItems, shepherdColumns, governorColumns, presidentColumns } from "@/interfaces/tools";
import { useAppSelector } from "@/redux/hooks";

export default function OperationalEntitiesPage() {
  const appState = useAppSelector((state) => state.app);
  const shepherdData = appState.adminShepherdEntities?.length ? appState.adminShepherdEntities : appState.shepherdEntities;
  const governorData = appState.adminGovernorEntities?.length ? appState.adminGovernorEntities : appState.governorEntities;
  const presidentData = appState.adminPresidentEntities?.length ? appState.adminPresidentEntities : appState.presidentEntities;

  const shepherdOptions = shepherdData.map((shepherd) => ({ id: shepherd.id, name: shepherd.name }));
  const governorOptions = governorData.map((governor) => ({ id: governor.id, name: governor.name }));

  return (
    <div>
      <div>
        <h1 className="md:text-2xl text-lg font-bold dark:text-white text-GGP-dark">Operational Entities</h1>
        <p className="max-w-[650px] font-light text-base dark:text-white text-GGP-dark/75">
          Manage Shepherds, Governors, and Presidents under the operational hierarchy.
        </p>
      </div>

      <Tabs defaultValue="shepherd" className="w-full">
        <div className="flex justify-end">
          <TabsList>
            {operationalTabItems.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value}>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <TabsContent value="shepherd">
          <AddEntityDialog label="Shepherd" />
          <OperationalEntityDataTable label="Shepherd" data={shepherdData} columns={shepherdColumns} />
        </TabsContent>

        <TabsContent value="governor">
          <AddEntityDialog label="Governor" />
          <OperationalEntityDataTable label="Governor" data={governorData} columns={governorColumns(shepherdOptions)} />
        </TabsContent>

        <TabsContent value="president">
          <AddEntityDialog label="President" />
          <OperationalEntityDataTable label="President" data={presidentData} columns={presidentColumns(shepherdOptions, governorOptions)} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
