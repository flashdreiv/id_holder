import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { base64ToFile } from "@/lib/utils";

export function ImagePreview({ base64 }: { base64: string }) {
  const fileUrl = URL.createObjectURL(base64ToFile(base64, "preview.png"));

  return (
    <Dialog>
      <DialogTrigger asChild>
        <img
          src={fileUrl}
          alt="Preview"
          className="w-full h-full rounded-md cursor-pointer object-contain"
        />
      </DialogTrigger>
      <DialogContent className="p-0 w-screen h-screen max-w-full flex items-center justify-center">
        <div className="w-[calc(100vw-40px)] h-[calc(100vh-40px)] overflow-hidden flex items-center justify-center">
          <img
            src={fileUrl}
            alt="Fullscreen"
            className="object-contain w-full h-full transform rotate-90"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
