import { Card, CardContent } from "@/components/ui/card";
import { ReactNode } from "react";

interface ProfileCardWrapperProps {
  children: ReactNode;
}

export const ProfileCardWrapper = ({ children }: ProfileCardWrapperProps) => {
  return (
    <section className="h-auto w-full flex flex-col md:flex-row">
      <div className="flex-1 flex justify-center overflow-y-auto items-center py-4 md:px-0">
        <Card className="shadow-none rounded-lg border-none w-full flex-grow">
          <CardContent className="mt-4">{children}</CardContent>
        </Card>
      </div>
    </section>
  );
};
