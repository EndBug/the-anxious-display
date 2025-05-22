import React, { useState, useEffect } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Countdown } from "@/types/countdown";
import { calculateTimeRemaining, formatDateTime } from "@/utils/countdownUtils";
import { Clock, Trash2, Edit2 } from "lucide-react";
import { cn } from "@/lib/utils";

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
    if (days < 3) return "border-red-500 border-2"; // Red for less than 3 days
    if (days < 7) return "border-orange-500 border-2"; // Orange for less than 7 days
    return ""; // Default color otherwise
  };

  return (
    <Card className={cn("h-full", getCardClasses())}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <h3 className={cn("text-lg font-semibold", 
              !isExpired && days < 3 && "text-red-500",
              !isExpired && days < 7 && days >= 3 && "text-orange-500"
            )}>
              {countdown.title}
            </h3>
            {countdown.description && (
              <p className="text-sm text-muted-foreground mt-1">{countdown.description}</p>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(countdown)}
              className="h-8 w-8 text-muted-foreground hover:text-primary"
            >
              <Edit2 size={18} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(countdown.id)}
              className="h-8 w-8 text-muted-foreground hover:text-destructive"
            >
              <Trash2 size={18} />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-1 text-sm text-muted-foreground mb-4">
          <Clock size={14} />
          <span>{formatDateTime(countdown.targetDate)}</span>
        </div>

        {isExpired ? (
          <div className="text-center py-4">
            <p className="text-xl font-semibold text-muted-foreground">Countdown completed!</p>
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-2 text-center">
            <div className={cn("flex flex-col bg-secondary rounded-md p-2", 
              days < 3 && "bg-red-100 dark:bg-red-900/20",
              days < 7 && days >= 3 && "bg-orange-100 dark:bg-orange-900/20"
            )}>
              <span className={cn("text-2xl font-bold", 
                days < 3 && "text-red-500",
                days < 7 && days >= 3 && "text-orange-500"
              )}>
                {days}
              </span>
              <span className="text-xs text-muted-foreground">Days</span>
            </div>
            <div className={cn("flex flex-col bg-secondary rounded-md p-2", 
              days < 3 && "bg-red-100 dark:bg-red-900/20",
              days < 7 && days >= 3 && "bg-orange-100 dark:bg-orange-900/20"
            )}>
              <span className={cn("text-2xl font-bold", 
                days < 3 && "text-red-500",
                days < 7 && days >= 3 && "text-orange-500"
              )}>
                {hours}
              </span>
              <span className="text-xs text-muted-foreground">Hours</span>
            </div>
            <div className={cn("flex flex-col bg-secondary rounded-md p-2", 
              days < 3 && "bg-red-100 dark:bg-red-900/20",
              days < 7 && days >= 3 && "bg-orange-100 dark:bg-orange-900/20"
            )}>
              <span className={cn("text-2xl font-bold", 
                days < 3 && "text-red-500",
                days < 7 && days >= 3 && "text-orange-500"
              )}>
                {minutes}
              </span>
              <span className="text-xs text-muted-foreground">Minutes</span>
            </div>
            <div className={cn("flex flex-col bg-secondary rounded-md p-2", 
              days < 3 && "bg-red-100 dark:bg-red-900/20",
              days < 7 && days >= 3 && "bg-orange-100 dark:bg-orange-900/20"
            )}>
              <span className={cn("text-2xl font-bold", 
                days < 3 && "text-red-500",
                days < 7 && days >= 3 && "text-orange-500"
              )}>
                {seconds}
              </span>
              <span className="text-xs text-muted-foreground">Seconds</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CountdownCard;
