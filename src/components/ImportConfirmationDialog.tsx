import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Countdown } from "@/types/countdown";
import { format } from "date-fns";

interface ImportCountdown {
  title: string;
  date: string;
  description?: string;
}

interface ImportConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  countdownsToImport: ImportCountdown[];
  onConfirm: (selectedCountdowns: ImportCountdown[]) => void;
}

const ImportConfirmationDialog: React.FC<ImportConfirmationDialogProps> = ({
  open,
  onOpenChange,
  countdownsToImport,
  onConfirm
}) => {
  const [selectedCountdowns, setSelectedCountdowns] = useState<Set<number>>(new Set());

  // Initialize all countdowns as selected when dialog opens
  useEffect(() => {
    if (open && countdownsToImport.length > 0) {
      const allSelected = new Set(countdownsToImport.map((_, index) => index));
      setSelectedCountdowns(allSelected);
    }
  }, [open, countdownsToImport]);

  const handleToggleCountdown = (index: number) => {
    const newSelected = new Set(selectedCountdowns);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelectedCountdowns(newSelected);
  };

  const handleSelectAll = () => {
    const allSelected = new Set(countdownsToImport.map((_, index) => index));
    setSelectedCountdowns(allSelected);
  };

  const handleDeselectAll = () => {
    setSelectedCountdowns(new Set());
  };

  const handleConfirm = () => {
    const selected = countdownsToImport.filter((_, index) => selectedCountdowns.has(index));
    onConfirm(selected);
    onOpenChange(false);
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "PPP 'at' p");
    } catch {
      return dateString;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Import Countdowns</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Select which countdowns you'd like to import:
          </p>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleSelectAll}
              className="text-xs"
            >
              Select All
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDeselectAll}
              className="text-xs"
            >
              Deselect All
            </Button>
          </div>

          <div className="max-h-60 overflow-y-auto space-y-3">
            {countdownsToImport.map((countdown, index) => (
              <div
                key={index}
                className="flex items-center gap-2 space-x-3 p-3 border rounded-lg"
              >
                <Checkbox
                  id={`countdown-${index}`}
                  checked={selectedCountdowns.has(index)}
                  onCheckedChange={() => handleToggleCountdown(index)}
                />
                <div className="flex-1 min-w-0">
                  <Label
                    htmlFor={`countdown-${index}`}
                    className="text-sm font-medium cursor-pointer"
                  >
                    {countdown.title}
                  </Label>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatDate(countdown.date)}
                  </p>
                  {countdown.description && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {countdown.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={selectedCountdowns.size === 0}
          >
            Import {selectedCountdowns.size} Countdown{selectedCountdowns.size !== 1 ? 's' : ''}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ImportConfirmationDialog; 
