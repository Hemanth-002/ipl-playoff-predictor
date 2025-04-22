import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StandingsTable from "@/components/standings-table";
import PlayoffChances from "@/components/playoff-chances";
import TeamPerformance from "@/components/team-performance";
import ScenarioSimulator from "@/components/scenario-simulator";

export default function Home() {
  return (
    <main className="container mx-auto py-8 px-4">
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">
            IPL 2025 Playoff Predictor
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Track current standings, analyze playoff chances, and simulate
            scenarios for your favorite IPL teams
          </p>
        </div>

        <Tabs defaultValue="standings" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="standings">Standings</TabsTrigger>
            <TabsTrigger value="chances">Playoff Chances</TabsTrigger>
            <TabsTrigger value="simulator">Scenario Simulator</TabsTrigger>
          </TabsList>
          <TabsContent value="standings" className="mt-6">
            <StandingsTable />
          </TabsContent>
          <TabsContent value="chances" className="mt-6">
            <PlayoffChances />
          </TabsContent>
          <TabsContent value="simulator" className="mt-6">
            <ScenarioSimulator />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
