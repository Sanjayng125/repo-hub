"use client";

import Collection from "@/components/Collection";
import { useMyStore } from "@/context/store/ZustandStore";
import { Loader } from "lucide-react";
import { useSession } from "next-auth/react";
import React from "react";

const CollectionsPage = () => {
  const { data: session, status } = useSession();
  const { myCollections, isLoading } = useMyStore();

  return (
    <div className="w-full h-full overflow-y-auto">
      {(status === "loading" || isLoading) && (
        <div className="w-full h-full flex justify-center items-center">
          <Loader className="w-20 h-20 animate-spin" />
        </div>
      )}
      {session?.user && status === "authenticated" && !isLoading && (
        <div className="w-full flex flex-col gap-2">
          <h1 className="text-xl font-semibold">My Collections</h1>
          <hr />
          {!isLoading && myCollections?.length <= 0 && (
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
