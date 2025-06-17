import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { QRCodeCanvas } from "qrcode.react";
import { Button } from "@/components/ui/button";
import { Clipboard } from "lucide-react";
import { Share2 } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface SharingDialogProps {
  generateShareableUrl: () => string;
  copyToClipboard: (url: string) => void;
}

const SharingDialog: React.FC<SharingDialogProps> = ({ generateShareableUrl, copyToClipboard }) => {
  return (
    <Dialog>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Share Countdowns">
                <Share2 />
              </Button>
            </DialogTrigger>
          </TooltipTrigger>
          <TooltipContent>Share countdowns</TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Share Countdowns</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center gap-4">
          <QRCodeCanvas value={generateShareableUrl()} size={200} />
          <div className="flex items-center gap-2 w-full">
            <input
              type="text"
              readOnly
              value={generateShareableUrl()}
              className="flex-1 p-2 border rounded text-sm text-muted-foreground"
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => copyToClipboard(generateShareableUrl())}
              aria-label="Copy to Clipboard"
            >
              <Clipboard />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SharingDialog;
