import React, { useState, useEffect } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Countdown } from "@/types/countdown";
import { calculateTimeRemaining, formatDateTime } from "@/utils/countdownUtils";
import { Clock, Trash2, Edit2 } from "lucide-react";
import { cn } from "@/lib/utils";
import SharingDialog from "./SharingDialog";

interface CountdownCardProps {
  countdown: Countdown;
  onDelete: (id: string) => void;
  onEdit: (countdown: Countdown) => void;
}

const CountdownCard: React.FC<CountdownCardProps> = ({ countdown, onDelete, onEdit }) => {
  const [timeRemaining, setTimeRemaining] = useState(
    calculateTimeRemaining(countdown.targetDate)
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(calculateTimeRemaining(countdown.targetDate));
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown.targetDate]);

  const { days, hours, minutes, seconds, isExpired } = timeRemaining;
  
  // Determine card color based on remaining time
  const getCardClasses = () => {
    if (isExpired) return ""; // Default color for expired events
    if (days < 3) return "bg-red-500 dark:bg-red-600 text-white"; // Red for less than 3 days
    if (days < 7) return "bg-amber-500 dark:bg-amber-500 text-white"; // Amber for less than 7 days
    return ""; // Default color otherwise
  };

  const isColored = days < 7 && !isExpired;

  return (
    <Card className={cn("h-full", getCardClasses())}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <h3 className={cn("text-lg font-semibold", 
              isColored && "text-white"
            )}>
              {countdown.title}
            </h3>
            {countdown.description && (
              <p className={cn("text-sm mt-1", isColored ? "text-white/80" : "text-muted-foreground")}>
                {countdown.description}
              </p>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(countdown)}
              className={cn("h-8 w-8", isColored ? "text-white/80 hover:text-white" : "text-muted-foreground hover:text-primary")}
            >
              <Edit2 size={18} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(countdown.id)}
              className={cn("h-8 w-8", isColored ? "text-white/80 hover:text-white" : "text-muted-foreground hover:text-destructive")}
            >
              <Trash2 size={18} />
            </Button>
            <SharingDialog countdowns={[countdown]} buttonStyleClass={cn("h-8 w-8", isColored ? "text-white/80 hover:text-white" : "text-muted-foreground hover:text-primary")} />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className={cn("flex items-center gap-1 text-sm mb-4", isColored ? "text-white/80" : "text-muted-foreground")}>
          <Clock size={14} />
          <span>{formatDateTime(countdown.targetDate)}</span>
        </div>

        {isExpired ? (
          <div className="text-center py-4">
            <p className="text-xl font-semibold text-muted-foreground">Countdown completed!</p>
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-2 text-center">
            <div className={cn("flex flex-col rounded-md p-2", 
              days < 3 && "bg-red-600 dark:bg-red-700",
              days < 7 && days >= 3 && "bg-amber-600 dark:bg-amber-700"
            )}>
              <span className={cn("text-2xl font-bold", isColored ? "text-white" : "")}>
                {days}
              </span>
              <span className={cn("text-xs", isColored ? "text-white/80" : "text-muted-foreground")}>Days</span>
            </div>
            <div className={cn("flex flex-col rounded-md p-2", 
              days < 3 && "bg-red-600 dark:bg-red-700",
              days < 7 && days >= 3 && "bg-amber-600 dark:bg-amber-700"
            )}>
              <span className={cn("text-2xl font-bold", isColored ? "text-white" : "")}>
                {hours}
              </span>
              <span className={cn("text-xs", isColored ? "text-white/80" : "text-muted-foreground")}>Hours</span>
            </div>
            <div className={cn("flex flex-col rounded-md p-2", 
              days < 3 && "bg-red-600 dark:bg-red-700",
              days < 7 && days >= 3 && "bg-amber-600 dark:bg-amber-700"
            )}>
              <span className={cn("text-2xl font-bold", isColored ? "text-white" : "")}>
                {minutes}
              </span>
              <span className={cn("text-xs", isColored ? "text-white/80" : "text-muted-foreground")}>Minutes</span>
            </div>
            <div className={cn("flex flex-col rounded-md p-2", 
              days < 3 && "bg-red-600 dark:bg-red-700",
              days < 7 && days >= 3 && "bg-amber-600 dark:bg-amber-700"
            )}>
              <span className={cn("text-2xl font-bold", isColored ? "text-white" : "")}>
                {seconds}
              </span>
              <span className={cn("text-xs", isColored ? "text-white/80" : "text-muted-foreground")}>Seconds</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CountdownCard;
