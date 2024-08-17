"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useMyStore } from "@/context/store/ZustandStore";
import { useToast } from "./ui/use-toast";
import { useState } from "react";
import { RepoProps } from "@/types";
import { Loader, PlusSquare } from "lucide-react";
import { useQueryClient } from "react-query";

export function AddToModal({ repo }: { repo: RepoProps }) {
  const { myCollections } = useMyStore();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  const handleRepoAdd = async (collectionId: string) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/user/collection/repo`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          collectionId,
          repoId: repo.id,
          repoName: repo.name,
          repoOwnerUsername: repo.owner.login,
          repoOwnerAvatar: repo.owner.avatar_url,
          topics: repo.topics,
          language: repo.language,
        }),
      });

      const data = await res.json();

      if (data.success) {
        queryClient.invalidateQueries(["mycollections"]);
      }

      toast({
        description: data.message,
        variant: data.success ? "default" : "destructive",
      });
    } catch (error) {
      console.log(error);
      if (error instanceof Error) {
        toast({
          description: error?.message ?? "Something went wrong!",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild className="p-0">
        <button
          // size={"sm"}
          className="bg-yellow-500 text-xs 2xl:text-sm font-semibold hover:bg-white hover:text-black flex items-center gap-1 text-white rounded-xl p-1 disabled:opacity-70"
        >
          <span>Add to</span>
          <span>
            <PlusSquare className="max-sm:size-3 size-4 2xl:size-6" />
          </span>
        </button>
      </DialogTrigger>
      <DialogContent
        aria-describedby={undefined}
        className="sm:max-w-[425px] bg-slate-900 max-h-[80%] overflow-y-auto"
      >
        <DialogHeader>
          <DialogTitle>My Collections</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col overflow-y-auto gap-2">
          {myCollections?.length > 0 ? (
            myCollections.map((collection, i) => (
              <Button
                key={i}
                disabled={loading}
                variant={"outline"}
                onClick={() => handleRepoAdd(collection._id)}
                className="w-full bg-transparent hover:bg-white hover:text-black flex justify-start items-center gap-1 disabled:opacity-50"
              >
                {collection.name}
                {loading && <Loader className="ml-2 w-4 h-4 animate-spin" />}
              </Button>
            ))
          ) : (
            <p>No Collections Yet!</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
