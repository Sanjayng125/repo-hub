"use client";

import { useToast } from "@/components/ui/use-toast";
import { useMyStore } from "@/context/store/ZustandStore";
import { useSession } from "next-auth/react";
import React, { useEffect } from "react";
import { useQuery } from "react-query";

const CustomLayout = ({ children }: { children: React.ReactNode }) => {
  const { data: session } = useSession();
  const { myCollections, setMyCollections, setIsLoading } = useMyStore();
  const { toast } = useToast();

  const fetchCollections = async () => {
    setIsLoading(true);
    const res = await fetch("/api/user/collection");
    const data = await res.json();

    if (!res.ok) {
      throw new Error(data?.message || "Something went wrong!");
    }

    return data;
  };

  useQuery({
    queryKey: ["mycollections"],
    queryFn: fetchCollections,
    enabled: !!session?.user, // Run query only if session exists
    onSuccess: (data) => {
      setMyCollections(data.collections);
    },
    onSettled: () => {
      setIsLoading(false);
    },
    onError: (error: Error) => {
      toast({
        description: error?.message ?? "Something went wrong!",
        variant: "destructive",
      });
    },
  });

  return children;
};

export default CustomLayout;
