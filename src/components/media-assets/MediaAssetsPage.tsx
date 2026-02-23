import { useState, useEffect } from "react";
import { useAppSelector } from "@/redux/hooks";
import { fetchMediaAssets, MailingMediaRow } from "@/services/mediaAssets";
import UploadCard from "./UploadCard";
import MediaAssetCard from "./MediaAssetCard";
import UploadMediaDialog from "./UploadMediaDialog";
import { Loader2 } from "lucide-react";
import { ErrorHandler } from "@/lib/toastHandlers";

export default function MediaAssetsPage() {
  const userDetails = useAppSelector((state) => state.auth.userDetails);
  const divisionId = userDetails.division_id || "";

  const [mediaAssets, setMediaAssets] = useState<MailingMediaRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);

  const loadMediaAssets = async () => {
    if (!divisionId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const assets = await fetchMediaAssets(divisionId);
      setMediaAssets(assets);
    } catch (error) {
      console.error("Error fetching media assets", error);
      ErrorHandler("Failed to load media assets");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMediaAssets();
  }, [divisionId]);

  const handleUploadSuccess = () => {
    loadMediaAssets();
  };

  if (!divisionId) {
    return (
      <div>
        <h1 className="md:text-2xl text-lg font-bold mb-4 dark:text-white text-GGP-dark">Media Assets</h1>
        <div className="mt-8 p-6 rounded-lg border dark:border-gray-800 bg-card">
          <p className="text-muted-foreground">You need to be assigned to a division to manage media assets.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="md:text-2xl text-lg font-bold mb-4 dark:text-white text-GGP-dark">Media Assets</h1>

      {loading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
          <UploadCard onClick={() => setUploadDialogOpen(true)} />
          {mediaAssets.map((media) => (
            <MediaAssetCard key={media.id} media={media} />
          ))}
        </div>
      )}

      <UploadMediaDialog
        open={uploadDialogOpen}
        onOpenChange={setUploadDialogOpen}
        onSuccess={handleUploadSuccess}
      />
    </div>
  );
}
