import { Card, CardContent } from "@/components/ui/card";
import { ReactNode } from "react";

interface ProfileCardWrapperProps {
  children: ReactNode;
}

export const ProfileCardWrapper = ({ children }: ProfileCardWrapperProps) => {
  return (
    <section className="w-full px-4 pb-10 pt-4 md:px-6 lg:px-10 xl:px-14">
      <div className="mx-auto flex w-full max-w-[1440px] justify-center">
        <Card className="w-full rounded-[2rem] border border-slate-200/70 bg-[linear-gradient(135deg,rgba(241,245,249,0.96),rgba(248,250,252,0.94)_48%,rgba(226,232,240,0.92))] shadow-[0_24px_90px_rgba(15,23,42,0.08)] dark:border-slate-800/60 dark:bg-[linear-gradient(145deg,rgba(20,27,45,0.96),rgba(30,41,59,0.94))]">
          <CardContent className="p-4 md:p-8 lg:p-10">{children}</CardContent>
        </Card>
      </div>
    </section>
  );
};
