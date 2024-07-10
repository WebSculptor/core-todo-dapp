"use client";

import Image from "next/image";
import { TaskModal } from "./task-modal";
import { Button } from "../ui/button";
import { Loader, Trash } from "lucide-react";
import { useState } from "react";
import { deleteTask, toggleCompleted } from "@/services/contract";
import { toast } from "sonner";
import { GoTasklist } from "react-icons/go";
import { useAccount } from "wagmi";
import { cn } from "@/lib/utils";

export default function TaskCard(task: ITask) {
  const { isConnected } = useAccount();

  const [isLoading, setIsLoading] = useState<{ [key: number]: boolean }>({});
  const [isUpdatingStatus, setIsUpdatingStatus] = useState<{
    [key: number]: boolean;
  }>({});

  const handleDeleteTask = async (taskId: number) => {
    setIsLoading((prev) => ({ ...prev, [taskId]: true }));
    try {
      const result = await deleteTask(Number(taskId));
      if (result) {
        toast.success("Successfully deleted task!");
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    } finally {
      setIsLoading((prev) => ({ ...prev, [taskId]: false }));
    }
  };

  const toggleIsCompleted = async (taskId: number) => {
    setIsUpdatingStatus((prev) => ({ ...prev, [taskId]: true }));
    try {
      const result = await toggleCompleted(Number(taskId));
      if (result) {
        toast.success("Successfully updated task status!");
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    } finally {
      setIsUpdatingStatus((prev) => ({ ...prev, [taskId]: false }));
    }
  };

  return (
    <div
      className={cn("rounded-sm bg-secondary/50 p-4 flex flex-col gap-4", {
        "sm:aspect-[1.2]": isConnected,
      })}>
      {isConnected && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isUpdatingStatus[task?.$id!] ? (
              <Loader size={20} className="animate-spin" />
            ) : (
              <Image
                src={task?.isDone ? "/stCORE.svg" : "/tCORE.svg"}
                alt="tCORE"
                width={20}
                height={20}
                priority
              />
            )}
            <p className="text-xs sm:text-sm font-medium">
              {isUpdatingStatus[task?.$id!]
                ? "Updating..."
                : task?.isDone
                ? "Completed"
                : "Pending"}
            </p>
          </div>

          <div
            className={
              isUpdatingStatus[task?.$id!]
                ? "pointer-events-none opacity-50"
                : "cursor-pointer pointer-events-auto opacity-100"
            }
            onClick={() => toggleIsCompleted(Number(task?.$id))}>
            <GoTasklist size={20} />
          </div>
        </div>
      )}

      <div className="flex flex-col gap-1">
        <h1 className="text-base sm:text-lg font-semibold leading-none">
          {task?.title}
        </h1>

        <p className="text-sm text-muted-foreground flex-1">
          {task?.description}
        </p>
      </div>

      {isConnected && (
        <div className="flex items-center gap-3 mt-auto">
          <TaskModal type="update" id={task?.id} taskId={task?.$id}>
            <Button
              className="rounded-full flex-1"
              size="lg"
              variant="secondary"
              disabled={isLoading[task?.$id!] || task?.isDone}>
              Update Task
            </Button>
          </TaskModal>

          <Button
            size="icon"
            variant="destructive"
            disabled={isLoading[task?.$id!]}
            onClick={() => handleDeleteTask(Number(task?.$id))}>
            {isLoading[task?.$id!] ? (
              <Loader className="animate-spin" size={18} />
            ) : (
              <Trash size={18} />
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
