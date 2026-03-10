import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDropzone } from "react-dropzone";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { UploadCloud, X } from "lucide-react";
import { useAppSelector } from "@/redux/hooks";
import { uploadMediaAsset, checkDuplicateMediaName, createMediaAsset } from "@/services/mediaAssets";
import { SuccessHandler, ErrorHandler } from "@/lib/toastHandlers";
import { cn } from "@/lib/utils";

const uploadMediaSchema = z.object({
  media_name: z.string().min(1, "Media name is required"),
  file: z.instanceof(File, { message: "Please select an image file" }).refine((file) => file.type.startsWith("image/"), {
    message: "File must be an image",
  }),
});

type UploadMediaFormValues = z.infer<typeof uploadMediaSchema>;

interface UploadMediaDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export default function UploadMediaDialog({ open, onOpenChange, onSuccess }: UploadMediaDialogProps) {
  const userDetails = useAppSelector((state) => state.auth.userDetails);
  const divisionId = userDetails.division_id || "";
  const userId = userDetails.id || "";
  const userName = userDetails.name || "";

  const [isPending, setIsPending] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const form = useForm<UploadMediaFormValues>({
    resolver: zodResolver(uploadMediaSchema),
    defaultValues: {
      media_name: "",
      file: undefined,
    },
  });

  const onDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      form.setValue("file", file, { shouldValidate: true });
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    maxFiles: 1,
  });

  const onSubmit = async (values: UploadMediaFormValues) => {
    try {
      setIsPending(true);

      // Check for duplicate media name
      const isDuplicate = await checkDuplicateMediaName(values.media_name, divisionId);
      if (isDuplicate) {
        ErrorHandler("A media asset with this name already exists for your division");
        return;
      }

      // Upload to S3
      const mediaUrl = await uploadMediaAsset(values.file, divisionId);

      // Create record in Supabase
      await createMediaAsset({
        media_name: values.media_name,
        media_url: mediaUrl,
        division_id: divisionId,
        uploader_id: userId,
        uploader_name: userName,
      });

      SuccessHandler("Media asset uploaded successfully");
      form.reset();
      setPreview(null);
      onOpenChange(false);
      onSuccess();
    } catch (error) {
      console.log("Upload error", error);
      ErrorHandler("Failed to upload media asset. Please try again.");
    } finally {
      setIsPending(false);
    }
  };

  const handleClose = () => {
    if (!isPending) {
      form.reset();
      setPreview(null);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="bg-white dark:bg-[#1E1E1E] p-6 max-w-2xl">
        <DialogHeader>
          <DialogTitle className="dark:text-white">Upload New Media Asset</DialogTitle>
          <DialogDescription className="dark:text-gray-400">Upload an image file and provide a name for it</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="media_name"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center gap-1">
                    <FormLabel className="text-[#111c30] dark:text-white font-normal text-base">Media Name</FormLabel>
                    <span className="text-red-500 text-base">*</span>
                  </div>
                  <FormControl>
                    <Input className="focus-visible:ring-0 focus-visible:ring-offset-0" placeholder="Enter media name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="file"
              render={({ field: { value, onChange, ...field } }) => (
                <FormItem>
                  <div className="flex items-center gap-1">
                    <FormLabel className="text-[#111c30] dark:text-white font-normal text-base">Image File</FormLabel>
                    <span className="text-red-500 text-base">*</span>
                  </div>
                  <FormControl>
                    <div
                      {...getRootProps()}
                      className={cn(
                        "border-2 border-dashed rounded-lg p-6 cursor-pointer transition-colors",
                        isDragActive ? "border-primary bg-primary/5" : "border-gray-300 dark:border-gray-700",
                        "hover:border-primary/50",
                      )}
                    >
                      <input {...field} {...getInputProps()} />
                      {preview ? (
                        <div className="relative">
                          <img src={preview} alt="Preview" className="max-h-64 mx-auto rounded-lg" />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute top-2 right-2"
                            onClick={(e) => {
                              e.stopPropagation();
                              setPreview(null);
                              form.setValue("file", undefined as any, { shouldValidate: false });
                            }}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-2">
                          <UploadCloud className="h-10 w-10 text-gray-400" />
                          <div className="text-center">
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              <span className="text-primary">Click to upload</span> or drag and drop
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-500">Image files only</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleClose} disabled={isPending} className="dark:text-white">
                Cancel
              </Button>
              <Button size="lg" variant="custom" type="submit" disabled={isPending}>
                {isPending ? "Uploading..." : "Upload"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
