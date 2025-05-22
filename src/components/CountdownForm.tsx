import React, { useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format, parseISO } from "date-fns";
import { CalendarIcon, Clock, Plus } from "lucide-react";
import { Countdown } from "@/types/countdown";
import { cn } from "@/lib/utils";

interface CountdownFormProps {
  onAddCountdown: (countdown: Omit<Countdown, "id">) => void;
  onUpdateCountdown?: (countdown: Countdown) => void;
  countdownToEdit?: Countdown | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  date: z.date({
    required_error: "Date is required"
  }),
  time: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: "Please enter a valid time in the format HH:MM"
  })
});

const CountdownForm: React.FC<CountdownFormProps> = ({
  onAddCountdown,
  onUpdateCountdown,
  countdownToEdit,
  open,
  onOpenChange
}) => {
  const isEditMode = !!countdownToEdit;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      time: format(new Date(), "HH:mm")
    }
  });

  // Reset form when opening the dialog
  useEffect(() => {
    if (open) {
      if (countdownToEdit) {
        const targetDate = new Date(countdownToEdit.targetDate);
        form.reset({
          title: countdownToEdit.title,
          description: countdownToEdit.description || "",
          date: targetDate,
          time: format(targetDate, "HH:mm"),
        });
      } else {
        form.reset({
          title: "",
          description: "",
          date: undefined,
          time: format(new Date(), "HH:mm")
        });
      }
    }
  }, [open, countdownToEdit, form]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    const {
      date,
      time,
      ...rest
    } = values;

    // Combine date and time
    const [hours, minutes] = time.split(":").map(Number);
    const targetDate = new Date(date);
    targetDate.setHours(hours, minutes, 0, 0);
    
    if (isEditMode && countdownToEdit) {
      onUpdateCountdown?.({
        id: countdownToEdit.id,
        title: values.title,
        description: values.description,
        targetDate: targetDate.toISOString()
      });
    } else {
      onAddCountdown({
        title: values.title,
        description: values.description,
        targetDate: targetDate.toISOString()
      });
    }
    
    form.reset();
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogTrigger asChild>
          <Button size="lg" className="gap-2" disabled={isEditMode}>
            <Plus size={18} />
            <span>Add New Countdown</span>
          </Button>
        </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Edit Countdown" : "Add New Countdown"}
          </DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2">
            <FormField control={form.control} name="title" render={({
            field
          }) => <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="New Year's Eve" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>} />

            <FormField control={form.control} name="description" render={({
            field
          }) => <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Add some details about this countdown" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField control={form.control} name="date" render={({
              field
            }) => <FormItem className="flex flex-col">
                    <FormLabel>Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button variant={"outline"} className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                            {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={date => date < new Date(new Date().setHours(0, 0, 0, 0))} initialFocus className="p-3 pointer-events-auto" />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>} />

              <FormField control={form.control} name="time" render={({
              field
            }) => <FormItem className="flex flex-col">
                    <FormLabel>Time</FormLabel>
                    <FormControl>
                      <div className="flex items-center">
                        <Clock className="mr-2 h-4 w-4 opacity-50" />
                        <Input type="time" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>} />
            </div>
            
            <DialogFooter className="pt-4">
              <DialogClose asChild>
                <Button type="button" variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit">
                {isEditMode ? "Update Countdown" : "Add Countdown"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CountdownForm;
