"use client";

import Collection from "@/components/Collection";
import { useMyStore } from "@/context/store/ZustandStore";
import { Loader } from "lucide-react";
import { useSession } from "next-auth/react";
import React from "react";
import { useQuery } from "react-query";

const CollectionsPage = () => {
  const { data: session, status } = useSession();
  const { setMyCollections, myCollections } = useMyStore();

  const { isLoading, error } = useQuery({
    queryKey: ["mycollections"],
    queryFn: () => {
      fetch("/api/user/collection")
        .then((res) => res.json())
        .then((data) => {
          setMyCollections(data.collections);
          return data;
        });
    },
    staleTime: 1000 * 60 * 10, // 10 minutes
  });

  return (
    <div className="w-full h-full overflow-y-auto">
      {error !== null && (
        <p className="text-red-600 text-center">{`${error}`}</p>
      )}
      {(status === "loading" || isLoading) && (
        <div className="w-full h-full flex justify-center items-center">
          <Loader className="w-20 h-20 animate-spin" />
        </div>
      )}
      {session?.user && status === "authenticated" && !isLoading && (
        <div className="w-full flex flex-col gap-2">
          <h1 className="text-xl font-semibold">My Collections</h1>
          <hr />
          {!isLoading && myCollections.length <= 0 && (
            <h1 className="text-lg text-center font-semibold">
              No Collections Yet!
            </h1>
          )}
          {myCollections?.length > 0 &&
            myCollections.map((collection, i) => (
              <Collection collection={collection} key={i} />
            ))}
        </div>
      )}
    </div>
  );
};

export default CollectionsPage;
