"use client";

import { useToast } from "@/components/ui/use-toast";
import { useMyStore } from "@/context/store/ZustandStore";
import { useSession } from "next-auth/react";
import React, { useEffect } from "react";

const CustomLayout = ({ children }: { children: React.ReactNode }) => {
  const { data: session } = useSession();
  const { myCollections, setMyCollections, setIsLoading } = useMyStore();
  const { toast } = useToast();

  const fetchCollections = async () => {
    try {
      await fetch("/api/user/collection")
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setMyCollections(data.collections);
          } else {
            toast({
              description: data?.message ?? "Something went wrong!",
              variant: "destructive",
            });
          }
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
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (session?.user && myCollections?.length <= 0) fetchCollections();
  }, [myCollections, session?.user]);

  return children;
};

export default CustomLayout;
