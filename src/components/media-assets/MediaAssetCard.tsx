import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, ExternalLink } from "lucide-react";
import { MailingMediaRow } from "@/services/mediaAssets";
import dayjs from "dayjs";
import { SuccessHandler } from "@/lib/toastHandlers";
import { cn } from "@/lib/utils";

interface MediaAssetCardProps {
  media: MailingMediaRow;
}

export default function MediaAssetCard({ media }: MediaAssetCardProps) {
  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(media.media_url);
      SuccessHandler("Media URL copied to clipboard");
    } catch (error) {
      console.error("Failed to copy URL", error);
    }
  };

  const handleOpenInNewTab = () => {
    window.open(media.media_url, "_blank", "noopener,noreferrer");
  };

  const formattedDate = dayjs(media.created_at).format("MMM DD, YYYY");

  return (
    <Card className={cn("h-full flex flex-col overflow-hidden", "hover:shadow-lg transition-shadow")}>
      <div className="relative aspect-video bg-gray-100 dark:bg-gray-800 overflow-hidden">
        <img
          src={media.media_url}
          alt={media.media_name}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "";
            (e.target as HTMLImageElement).style.display = "none";
          }}
        />
      </div>
      <CardHeader className="flex-1">
        <h3 className="font-semibold text-lg dark:text-white line-clamp-2">{media.media_name}</h3>
        <p className="text-sm text-muted-foreground">Uploaded on {formattedDate}</p>
        {media.uploader_name && (
          <p className="text-xs text-muted-foreground">By {media.uploader_name}</p>
        )}
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopyUrl}
            className="flex-1 dark:text-white"
          >
            <Copy className="h-4 w-4 mr-2" />
            Copy URL
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleOpenInNewTab}
            className="flex-1 dark:text-white"
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Open
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
