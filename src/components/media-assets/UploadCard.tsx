import { Card, CardContent } from "@/components/ui/card";
import { Upload } from "lucide-react";
import { cn } from "@/lib/utils";

interface UploadCardProps {
  onClick: () => void;
}

export default function UploadCard({ onClick }: UploadCardProps) {
  return (
    <Card
      className={cn(
        "h-full flex flex-col cursor-pointer",
        "hover:shadow-lg transition-all duration-200",
        "border-2 border-dashed border-gray-300 dark:border-gray-700",
        "hover:border-primary dark:hover:border-primary"
      )}
      onClick={onClick}
    >
      <CardContent className="flex flex-col items-center justify-center h-full min-h-[300px] p-6">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="p-4 rounded-full bg-primary/10 dark:bg-primary/20">
            <Upload className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-lg dark:text-white mb-1">Upload New Picture</h3>
            <p className="text-sm text-muted-foreground">Click to upload a new media asset</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
