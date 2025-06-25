import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { QRCodeCanvas } from "qrcode.react";
import { Button } from "@/components/ui/button";
import { Clipboard, Check } from "lucide-react";
import { Share2 } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Countdown } from "@/types/countdown";

interface SharingDialogProps {
  countdowns: Countdown[];
    buttonStyleClass?: string; // Optional class for the button styling
}

const SharingDialog: React.FC<SharingDialogProps> = ({ countdowns, buttonStyleClass}) => {
  const [copied, setCopied] = useState(false);

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

  const copyToClipboard = async (url: string): Promise<void> => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      // Reset the copied state after 2 seconds
      setTimeout(() => setCopied(false), 1000);
    } catch (error) {
      console.error(">>> Failed to copy to clipboard:", error);
    }
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
          <TooltipContent>Share {countdowns.length === 1 ? 'countdown' : 'countdowns'}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Share {countdowns.length === 1 ? 'Countdown' : 'Countdowns'}</DialogTitle>
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
              variant={copied ? "default" : "ghost"}
              size="icon"
              onClick={() => copyToClipboard(generateShareableUrl())}
              aria-label="Copy to Clipboard"
              className={copied ? "bg-green-600 hover:bg-green-700 text-white" : ""}
            >
              {copied ? <Check className="h-5 w-5" /> : <Clipboard className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SharingDialog;
