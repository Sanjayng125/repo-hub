import { collectionProps } from "@/types";
import React from "react";
import { format } from "timeago.js";
import { Options } from "./Options";
import { CollectionModal } from "./CollectionModal";
import { EllipsisVertical, Trash } from "lucide-react";
import { Separator } from "./ui/separator";
import { Alert } from "./Alert";
import Link from "next/link";

const Collection = ({ collection }: { collection: collectionProps }) => {
  return (
    <div className="w-full flex justify-between gap-3 bg-slate-900 p-3 rounded-lg hover:scale-[0.99] transition duration-150">
      <Link
        href={`/collections/${collection._id}`}
        className="flex flex-col justify-center gap-2 flex-1 hover:underline"
      >
        <p className="text-lg font-semibold">{collection.name}</p>
        <p className="text-sm flex items-center gap-5">
          <span className="font-semibold">Repos: {collection.reposCount}</span>
          <span>{format(collection.createdAt)}</span>
        </p>
      </Link>
      <div className="flex items-center">
        <Options Icon={EllipsisVertical}>
          <CollectionModal
            create={false}
            collectionId={collection._id}
            collectionOldName={collection.name}
          />
          <Separator />
          <Alert
            Icon={Trash}
            bgcolor="bg-red-500"
            collectionId={collection._id}
          />
        </Options>
      </div>
    </div>
  );
};

export default Collection;
