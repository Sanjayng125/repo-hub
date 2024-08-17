"use client";

import Repo from "@/components/Repo";
import { useToast } from "@/components/ui/use-toast";
import { RepoProps } from "@/types";
import { Loader } from "lucide-react";
import React, { useState } from "react";
import { useQuery } from "react-query";

const Collection = ({ params }: { params: { id: string } }) => {
  const [repos, setRepos] = useState<RepoProps[]>([]);
  const { toast } = useToast();

  const { isLoading: loading } = useQuery({
    queryKey: ["mycollectionrepos"],
    queryFn: () => {
      return fetch(`/api/user/collection/repo/${params.id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setRepos(data.repos);
          } else {
            toast({
              description: data?.message ?? "Something went wrong!",
              variant: "destructive",
            });
          }
          return data;
        });
    },
  });

  return (
    <div className="w-full h-full overflow-y-auto">
      {loading && (
        <div className="w-full flex justify-center items-center">
          <Loader className="w-20 h-20 animate-spin" />
        </div>
      )}
      <div className="flex flex-col gap-3 p-3">
        {repos?.length > 0 && (
          <>
            <h1 className="text-xl font-semibold my-2">Repos</h1>
            <hr />
          </>
        )}
        {repos &&
          repos?.map((repo, i) => (
            <Repo addToBtn={false} repo={repo} key={i} />
          ))}
        {!loading && repos?.length <= 0 && (
          <p className="text-lg font-semibold text-center">
            No Repo Added Yet!
          </p>
        )}
      </div>
    </div>
  );
};

export default Collection;
