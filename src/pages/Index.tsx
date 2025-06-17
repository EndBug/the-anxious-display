import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import CountdownForm from "@/components/CountdownForm";
import CountdownList from "@/components/CountdownList";
import { Countdown } from "@/types/countdown";
import { GitHubIcon } from '@/components/icons/github';
import { ThemeToggle } from "@/components/ThemeToggle";
import { Filter, SortDesc, Share2, Clipboard } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import SharingDialog from "@/components/SharingDialog";

const Index = () => {
  const [countdowns, setCountdowns] = useState<Countdown[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [countdownToEdit, setCountdownToEdit] = useState<Countdown | null>(null);
  const [isSortedByTime, setIsSortedByTime] = useState(false);
  const [isFilteringCompleted, setIsFilteringCompleted] = useState(false);
  const [searchParams] = useSearchParams();

  // Load countdowns from local storage on initial render
  useEffect(() => {
    const savedCountdowns = localStorage.getItem("countdowns");
    if (savedCountdowns) {
      try {
        setCountdowns(JSON.parse(savedCountdowns));
      } catch (error) {
        console.error("Error loading countdowns:", error);
        toast.error("Failed to load saved countdowns");
      }
    }
  }, []);

  // Save countdowns to local storage whenever they change
  useEffect(() => {
    localStorage.setItem("countdowns", JSON.stringify(countdowns));
  }, [countdowns]);

  // Parse query parameters and add countdown if valid parameters are detected
  useEffect(() => {
    const title = searchParams.get("title");
    const targetDate = searchParams.get("date");
    const description = searchParams.get("description");

    if (title && targetDate) {
      const newCountdown = {
        title,
        targetDate,
        description: description || "",
      };
      handleAddCountdown(newCountdown);
      toast.success("Countdown added from URL!");
      searchParams.delete("title");
      searchParams.delete("date");
      searchParams.delete("description");
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [searchParams]);

  const generateUUID = () => {
    if (typeof crypto !== "undefined" && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  };

  const handleAddCountdown = (newCountdown: Omit<Countdown, "id">) => {
    const countdown: Countdown = {
      ...newCountdown,
      id: generateUUID()
    };
    setCountdowns(prev => [...prev, countdown]);
    toast.success("Countdown added successfully!");
  };

  const handleUpdateCountdown = (updatedCountdown: Countdown) => {
    setCountdowns(prev => 
      prev.map(countdown => 
        countdown.id === updatedCountdown.id ? updatedCountdown : countdown
      )
    );
    setCountdownToEdit(null);
    toast.success("Countdown updated successfully!");
  };

  const handleDeleteCountdown = (id: string) => {
    setCountdowns(prev => prev.filter(countdown => countdown.id !== id));
    toast.success("Countdown deleted");
  };

  const handleEditCountdown = (countdown: Countdown) => {
    setCountdownToEdit(countdown);
    setIsFormOpen(true);
  };

  const handleReorderCountdowns = (reorderedCountdowns: Countdown[]) => {
    setCountdowns(reorderedCountdowns);
  };

  const handleToggleSort = () => {
    setIsSortedByTime((prev) => !prev);
  };

  const handleToggleFilter = () => {
    setIsFilteringCompleted((prev) => !prev);
  };


  useEffect(() => {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const countdownsParam = urlSearchParams.get("countdowns");

    if (countdownsParam) {
      try {
        console.log("Raw countdownsParam:", countdownsParam); // Debugging log
        const decodedString = decodeURIComponent(atob(countdownsParam)); // Decode base64 and URI
        console.log("Decoded string:", decodedString); // Debugging log
        const decodedCountdowns = JSON.parse(decodedString); // Parse JSON
        if (Array.isArray(decodedCountdowns)) {
          decodedCountdowns.forEach((countdown) => {
            const { title, date, description } = countdown;
            if (title && date) {
              handleAddCountdown({
                title,
                targetDate: date,
                description: description || "",
              });
            }
          });
          toast.success("Countdowns added from URL!");
        }
      } catch (error) {
        console.error("Failed to parse countdowns from URL", error);
        toast.error("Invalid countdowns parameter: "+ error.message);
      }

      urlSearchParams.delete("countdowns");
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="border-b">
        <div className="container max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-end gap-2">
          <ThemeToggle />
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={isSortedByTime ? "secondary" : "ghost"}
                  size="icon"
                  onClick={handleToggleSort}
                  aria-label="Toggle Sort"
                >
                  <SortDesc className={isSortedByTime ? "text-primary" : ""} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Sort by time</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={isFilteringCompleted ? "secondary" : "ghost"}
                  size="icon"
                  onClick={handleToggleFilter}
                  aria-label="Toggle Filter"
                >
                  <Filter className={isFilteringCompleted ? "text-primary" : ""} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Filter completed countdowns</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <SharingDialog 
            countdowns={countdowns}
          />
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  asChild
                >
                  <a
                    href="https://github.com/EndBug/the-anxious-display"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="View on GitHub"
                  >
                    <GitHubIcon className="size-5" />
                  </a>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>GitHub repo</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </header>

      <main className="flex-1 container max-w-6xl mx-auto py-8 px-4 sm:px-6">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-4">The Anxious Display</h1>
          <p className="text-xl text-muted-foreground mb-6">
            Track of the deadlines you'd like to ignore
          </p>
          <CountdownForm 
            onAddCountdown={handleAddCountdown}
            onUpdateCountdown={handleUpdateCountdown}
            countdownToEdit={countdownToEdit}
            open={isFormOpen} 
            onOpenChange={(open) => {
              setIsFormOpen(open);
              if (!open) setCountdownToEdit(null);
            }}
          />
        </div>

        <div className="mt-10">
          <CountdownList 
            countdowns={countdowns} 
            onDelete={handleDeleteCountdown}
            onEdit={handleEditCountdown}
            onReorder={handleReorderCountdowns}
            isSortedByTime={isSortedByTime}
            isFilteringCompleted={isFilteringCompleted}
          />
        </div>
      </main>
    </div>
  );
};

export default Index;
