"use client";

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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Edit } from "lucide-react";
import { useQueryClient } from "react-query";

export function CollectionModal({
  create = true,
  border = true,
  collectionId,
  collectionOldName,
}: {
  create?: boolean;
  border?: boolean;
  collectionId?: string;
  collectionOldName?: string;
}) {
  const [name, setName] = useState("");
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  const createCollection = async () => {
    if (name === "") {
      toast({
        description: "Please provide a name",
      });
    }
    if (!create && name === collectionOldName) {
      toast({
        description: "Please change name to update",
      });
    }
    setLoading(true);
    try {
      const res = await fetch("/api/user/collection", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      });

      const data = await res.json();

      if (data.success) {
        setName("");
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

  const updateCollection = async () => {
    if (name == "") {
      toast({
        description: "Please provide a name",
      });
    }
    setLoading(true);
    try {
      const res = await fetch("/api/user/collection", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, collectionId }),
      });

      const data = await res.json();

      if (data.success) {
        setName("");
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
    <Dialog>
      <DialogTrigger
        asChild
        className={`bg-slate-900 text-white max-sm:p-2 ${
          !border && "border-none"
        }`}
      >
        <Button variant="outline" className="w-full">
          {create ? "Create Collection" : <Edit />}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-slate-900">
        <DialogHeader>
          <DialogTitle>
            {create ? "Create Collection" : "Update Collection"}
          </DialogTitle>
          <DialogDescription>
            {create
              ? "Create collection and add your repos to it"
              : "Update an exsting collection name"}
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-4 bg-slate-900">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="col-span-3 bg-slate-900"
            placeholder="Collection Name"
          />
        </div>
        <DialogFooter>
          <Button
            onClick={() => {
              if (create) {
                createCollection();
              } else if (!create) {
                updateCollection();
              }
            }}
            variant={"outline"}
            className="bg-slate-900 disabled:opacity-50"
            disabled={
              loading || name === "" || (!create && name === collectionOldName)
            }
          >
            {create
              ? loading
                ? "Creating..."
                : "Create"
              : loading
              ? "Updating"
              : "Update"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
