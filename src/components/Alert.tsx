"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "./ui/use-toast";
import { useState } from "react";
import { useQueryClient } from "react-query";

export function Alert({
  Icon,
  bgcolor,
  collectionId,
}: {
  Icon: React.ComponentType;
  bgcolor?: string;
  collectionId?: string;
}) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const queryClient = useQueryClient();

  const handleDelete = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/user/collection", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ collectionId }),
      });

      const data = await res.json();

      if (data.success) {
        queryClient.invalidateQueries({ queryKey: ["mycollections"] });
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
    <AlertDialog>
      <AlertDialogTrigger asChild className={`${bgcolor}`}>
        <Button variant="outline" className={`${bgcolor} text-white`}>
          <Icon />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-slate-900">
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            collection.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="bg-transparent border hover:bg-white hover:text-black">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            className="bg-red-500 hover:bg-white hover:text-black"
            onClick={handleDelete}
            disabled={loading}
          >
            {loading ? "Delete..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
