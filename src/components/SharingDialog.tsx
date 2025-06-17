import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { QRCodeCanvas } from "qrcode.react";
import { Button } from "@/components/ui/button";
import { Clipboard } from "lucide-react";
import { Share2 } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Countdown } from "@/types/countdown";

interface SharingDialogProps {
  countdowns: Countdown[];
    buttonStyleClass?: string; // Optional class for the button styling
}

const SharingDialog: React.FC<SharingDialogProps> = ({ countdowns, buttonStyleClass}) => {
  const generateShareableUrl = (): string => {
    const countdownsToShare = countdowns.map(({ title, targetDate, description }) => ({
      title,
      date: targetDate,
      description,
    }));
    const url = new URL(window.location.href);
    const encodedCountdowns = btoa(encodeURIComponent(JSON.stringify(countdownsToShare))); // Base64 encode with URI encoding
    url.searchParams.set("countdowns", encodedCountdowns);
    return url.toString();
  };

  const copyToClipboard = (url: string): void => {
    navigator.clipboard.writeText(url);
    alert("Countdown link copied to clipboard!");
  };

  return (
    <Dialog>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Share Countdowns" className={buttonStyleClass}>
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
