import { ContainerFluid } from "@/components/containerFluid";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Church, Image, CirclePause, UserRoundCog } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { pauseMemberSubscription } from "@/services/payment";
import { useState } from "react";

const ToolsPage = () => {
  const [loading, setLoading] = useState(false);
  const [userCode, setUserCode] = useState("");

  const pauseSubscriptionRequest = async () => {
    setLoading(true);
    await pauseMemberSubscription(userCode);
    setLoading(false);
  };

  const tools = [
    {
      title: "Manage Entities",
      description: "Manage chapters and divisions",
      icon: Church,
      href: "/entities",
    },
    {
      title: "Assign Partners to Operational Reps",
      description: "Assign selected or filtered partners to Shepherd/Governor/President",
      icon: UserRoundCog,
      href: "/operational-assignments",
    },
    {
      title: "Manage Media Assets",
      description: "Upload and manage media files",
      icon: Image,
      href: "/media-assets",
    },
    {
      title: "Pause Member Subscription",
      description: (
        <div className="flex items-center gap-2">
          <Input
            type="text"
            className="mr-2 border-black dark:border-white  border-2"
            value={userCode}
            onChange={(e) => setUserCode(e.target.value)}
            placeholder="User Unique Code"
          />
          <Button onClick={pauseSubscriptionRequest} disabled={loading}>
            {loading ? "Pausing..." : "Pause Subscription"}
          </Button>
        </div>
      ),
      icon: CirclePause,
    },
  ];

  return (
    <ContainerFluid>
      <div className="py-6">
        <div>
          <h1 className="md:text-2xl text-lg font-bold dark:text-white text-GGP-dark">Admin Tools</h1>
          <p className="max-w-[530px] font-light text-base dark:text-white text-GGP-dark/75  mb-6">Access extra tools to make functions easier</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool) => {
            const Icon = tool.icon;
            return tool.href ? (
              <Link key={tool.href} to={tool.href} className="block">
                <Card
                  className={cn(
                    "h-full transition-all duration-200 cursor-pointer",
                    "hover:shadow-lg hover:scale-105",
                    "dark:border-GGP-lightGold",
                    "dark:hover:border-GGP-darkGold",
                  )}
                >
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-lg bg-primary/10 dark:bg-primary/20">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <CardTitle className="text-xl dark:text-GGP-darkGold">{tool.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base dark:text-GGP-lightGold">{tool.description}</CardDescription>
                  </CardContent>
                </Card>
              </Link>
            ) : (
              <Card
                className={cn(
                  "h-full transition-all duration-200 cursor-pointer",
                  "hover:shadow-lg hover:scale-105",
                  "dark:border-GGP-lightGold",
                  "dark:hover:border-GGP-darkGold",
                )}
              >
                <CardHeader key={tool.title}>
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-lg bg-primary/10 dark:bg-primary/20">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl dark:text-GGP-darkGold">{tool.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base dark:text-GGP-lightGold">{tool.description}</CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </ContainerFluid>
  );
};

export default ToolsPage;
