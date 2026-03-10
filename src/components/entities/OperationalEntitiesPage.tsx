import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AddEntityDialog from "./AddEntityDialog";
import OperationalEntityDataTable from "./OperationalEntityDataTable";
import { operationalTabItems, hosColumns, governorColumns, presidentColumns } from "@/interfaces/tools";
import { useAppSelector } from "@/redux/hooks";

export default function OperationalEntitiesPage() {
  const appState = useAppSelector((state) => state.app);
  const hosData = appState.adminHosEntities?.length ? appState.adminHosEntities : appState.hosEntities;
  const governorData = appState.adminGovernorEntities?.length ? appState.adminGovernorEntities : appState.governorEntities;
  const presidentData = appState.adminPresidentEntities?.length ? appState.adminPresidentEntities : appState.presidentEntities;

  const hosOptions = hosData.map((hos) => ({ id: hos.id, name: hos.name }));
  const governorOptions = governorData.map((governor) => ({ id: governor.id, name: governor.name }));

  return (
    <div>
      <div>
        <h1 className="md:text-2xl text-lg font-bold dark:text-white text-GGP-dark">Operational Entities</h1>
        <p className="max-w-[650px] font-light text-base dark:text-white text-GGP-dark/75">
          Manage House Of Shepherds, Governors, and Presidents under the operational hierarchy.
        </p>
      </div>

      <Tabs defaultValue="hos" className="w-full">
        <div className="flex justify-end">
          <TabsList>
            {operationalTabItems.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value}>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <TabsContent value="hos">
          <AddEntityDialog label="HoS" />
          <OperationalEntityDataTable label="HoS" data={hosData} columns={hosColumns} />
        </TabsContent>

        <TabsContent value="governor">
          <AddEntityDialog label="Governor" />
          <OperationalEntityDataTable label="Governor" data={governorData} columns={governorColumns(hosOptions)} />
        </TabsContent>

        <TabsContent value="president">
          <AddEntityDialog label="President" />
          <OperationalEntityDataTable label="President" data={presidentData} columns={presidentColumns(hosOptions, governorOptions)} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
