"use client";

import TaskCard from "@/components/shared/task-card";
import { TaskModal } from "@/components/shared/task-modal";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { siteConfig } from "@/config";
import { getAllTasks } from "@/services/contract";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { ConnectKitButton, useIsMounted } from "connectkit";
import { getTaskContract } from "@/services";

export default function Home() {
  const isMounted = useIsMounted();

  const { isConnected } = useAccount();

  const [isLoadingTasks, setIsLoadingTasks] = useState(true);
  const [filter, setFilter] = useState<"all" | "pending" | "completed">("all");
  const [tasks, setTasks] = useState<ITask[]>([]);

  const fetchAllTasks = async () => {
    try {
      const result = await getAllTasks();
      setTasks(result);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoadingTasks(false);
    }
  };

  useEffect(() => {
    (async () => {
      await fetchAllTasks();
      const contract = await getTaskContract();

      contract.on("TodoCreated", async (id, title, description, isDone) => {
        await fetchAllTasks();
        console.log("Task created");
      });

      return () => {
        contract.removeAllListeners("TodoCreated");
      };
    })();
  }, []);

  useEffect(() => {
    const listenForEvents = async () => {
      const contract = await getTaskContract();

      contract.on("TodoToggled", async (id, isDone) => {
        await fetchAllTasks();
        console.log("Task status updated");
      });
      contract.on("TodoDeleted", async (id) => {
        await fetchAllTasks();
        console.log("Task deleted");
      });
      contract.on("TodoTitleUpdated", async (id, title) => {
        await fetchAllTasks();
        console.log("Task title updated");
      });
      contract.on("TodoDescriptionUpdated", async (id, description) => {
        await fetchAllTasks();
        console.log("Task description updated");
      });

      return () => {
        contract.removeAllListeners("TodoToggled");
        contract.removeAllListeners("TodoDeleted");
        contract.removeAllListeners("TodoTitleUpdated");
        contract.removeAllListeners("TodoDescriptionUpdated");
      };
    };

    listenForEvents();
  }, []);

  const filteredTasks =
    tasks &&
    tasks.filter((task) => {
      if (filter === "all") return true;
      if (filter === "pending") return !task?.isDone;
      if (filter === "completed") return task?.isDone;
    });

  return (
    <div className="flex flex-col items-center px-4 py-10">
      <h1 className="text-center mb-8 text-3xl font-semibold">
        {siteConfig.appName}
      </h1>

      <div className="max-w-[960px] w-full mx-auto flex flex-col gap-6">
        {isConnected ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                className="px-4"
                size="sm"
                variant={filter === "all" ? "secondary" : "outline"}
                onClick={() => setFilter("all")}>
                All
              </Button>
              <Button
                className="px-4"
                size="sm"
                variant={filter === "pending" ? "secondary" : "outline"}
                onClick={() => setFilter("pending")}>
                Pending
              </Button>
              <Button
                className="px-4"
                size="sm"
                variant={filter === "completed" ? "secondary" : "outline"}
                onClick={() => setFilter("completed")}>
                Completed
              </Button>
            </div>

            <TaskModal type="create">
              <Button className="px-4" size="sm">
                Add Task
              </Button>
            </TaskModal>
          </div>
        ) : (
          <div className="flex items-center justify-end">
            {isMounted ? (
              <ConnectKitButton.Custom>
                {({ isConnected, isConnecting, show, address }) => {
                  return (
                    <Button
                      className="px-4"
                      size="sm"
                      variant="secondary"
                      onClick={show}>
                      {isConnecting ? "Connecting..." : "Connect Wallet"}
                    </Button>
                  );
                }}
              </ConnectKitButton.Custom>
            ) : (
              "Loading..."
            )}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {isLoadingTasks ? (
            Array.from({ length: 6 }).map((_, _key) => (
              <Skeleton key={_key} className="rounded-sm aspect-[1.2]" />
            ))
          ) : filteredTasks?.length === 0 ? (
            <TaskModal type="create">
              <div className="rounded-sm bg-secondary aspect-[1.2] p-4 flex flex-col gap-2 items-center justify-center cursor-pointer">
                <div className="size-20 rounded-full border border-dashed flex items-center justify-center">
                  <Plus size={38} className="text-muted-foreground" />
                </div>
                <p className="text-muted-foreground">Add a Task</p>
              </div>
            </TaskModal>
          ) : (
            filteredTasks?.map((task: ITask, _key) => {
              const cardProps = {
                ...task,
                $id: _key,
              };

              return <TaskCard key={_key} {...cardProps} />;
            })
          )}
        </div>
      </div>
    </div>
  );
}
