"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { tasks } from "@/lib/constants";
import { Textarea } from "@/components/ui/textarea";
import { taskSchema } from "@/lib/validators";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { createNewTask, getAllTasks, updateTask } from "@/services/contract";
import { Loader } from "lucide-react";
import { useAccount } from "wagmi";
import { ConnectKitButton, useIsMounted } from "connectkit";

export function TaskModal({
  children,
  type,
  id,
  taskId,
}: {
  children: React.ReactNode;
  type: "update" | "create";
  id?: number;
  taskId?: number;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [task, setTask] = useState<ITask | null>(null);

  const form = useForm<z.infer<typeof taskSchema>>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const result = await getAllTasks();
        const foundTask = result.find((task: ITask) => task.id === id);
        setTask(foundTask || null);
      } catch (error) {
        console.log(error);
      }
    };

    if (type === "update") {
      fetchTask();
    }
  }, [type, id]);

  useEffect(() => {
    if (task) {
      form.reset({
        title: task.title,
        description: task.description,
      });
    } else {
      form.reset({
        title: "",
        description: "",
      });
    }
  }, [task, form]);

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof taskSchema>) {
    try {
      setIsLoading(true);

      if (type === "create") {
        const result = await createNewTask(values.title, values.description);

        if (result) {
          toast.success("A new task has been created!");
          setIsLoading(false);
        }
      } else {
        const result = await updateTask(
          Number(taskId),
          values.title,
          values.description
        );

        if (result) {
          toast.success("Task has been updated!");
          setIsLoading(false);
        }
      }
    } catch (error) {
      console.log(error);
      toast.error("Error performing transaction");
      setIsLoading(false);
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {type === "create" ? "Create a new Task" : "Update task"}
          </DialogTitle>
          <DialogDescription>
            {type === "create"
              ? "What is your task about? Click save when you're done."
              : "Make changes to your task. Click save when you're done."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid gap-4 sm:gap-2 py-3">
            <FormField
              control={form.control}
              disabled={isLoading}
              name="title"
              render={({ field }) => (
                <FormItem className="sm:grid sm:grid-cols-4 sm:items-center sm:gap-4">
                  <FormLabel className="sm:text-right">Title</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      {...field}
                      className="col-span-3"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              disabled={isLoading}
              name="description"
              render={({ field }) => (
                <FormItem className="sm:grid sm:grid-cols-4 sm:items-start sm:gap-4">
                  <FormLabel className="sm:text-right sm:mt-3">
                    Description
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      disabled={isLoading}
                      {...field}
                      className="col-span-3 resize-none"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="mt-4">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader size={16} className="animate-spin mr-2" />
                    Please wait...
                  </>
                ) : type === "create" ? (
                  "Create task"
                ) : (
                  "Save changes"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
