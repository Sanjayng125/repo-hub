"use client";

import { RepoProps } from "@/types";
import { Check, GitFork, MinusSquare, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { BiCopy } from "react-icons/bi";
import { format } from "timeago.js";
import { Button } from "./ui/button";
import { AddToModal } from "./AddToModal";
import { useToast } from "./ui/use-toast";
import { useQueryClient } from "react-query";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { getRepos } from "@/lib/actions";
import { useMyStore } from "@/context/store/ZustandStore";

const Repo = ({
  repo,
  myProfile = false,
  addToBtn = true,
}: {
  repo: RepoProps;
  myProfile?: boolean;
  addToBtn?: boolean;
}) => {
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: session, status } = useSession();
  const { setIsLoading, setExploreRepos } = useMyStore();
  const pathname = usePathname();

  const handleCloneUrlCopy = (cloneUrl: string) => {
    if (!copied) {
      setCopied(true);
      navigator.clipboard.writeText(cloneUrl);

      setTimeout(() => {
        setCopied(false);
      }, 1500);
    }
  };

  const handleRepoRemove = async (repoId: string) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/user/collection/repo`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          repoId,
        }),
      });

      const data = await res.json();

      if (data.success) {
        queryClient.invalidateQueries({ queryKey: ["mycollectionrepos"] });
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

  const fetchRepos = async (
    query: string,
    sortBy: string,
    sortOrder: string
  ) => {
    if (pathname === "/") {
      try {
        setIsLoading(true);
        setExploreRepos([]);
        await getRepos({ query, sortBy, sortOrder }).then((res) => {
          setExploreRepos(res.repos?.items);
        });
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="flex flex-col justify-center gap-2 bg-slate-900 p-3 rounded-lg">
      <div className="flex items-center gap-2">
        {!myProfile && (
          <Link
            href={`/search/${
              addToBtn ? repo?.owner?.login : repo.repoOwnerUsername
            }`}
          >
            <Image
              src={
                (addToBtn ? repo?.owner?.avatar_url : repo.repoOwnerAvatar) ||
                "/noavatar.png"
              }
              alt=""
              width={50}
              height={50}
              className="max-w-10 max-h-10 rounded-full aspect-square"
            />
          </Link>
        )}
        <div className="flex items-center gap-2 flex-wrap">
          {myProfile ? (
            <p className="text-xl font-semibold max-sm:text-sm">
              {repo.name || repo.repoName}
            </p>
          ) : (
            <Link
              href={`/search/${
                addToBtn ? repo?.owner?.login : repo.repoOwnerUsername
              }`}
              className="max-sm:text-lg text-xl 2xl:text-2xl font-semibold hover:underline"
            >
              {repo.name || repo.repoName}
            </Link>
          )}
          <div className="flex items-center gap-1">
            <button
              onClick={() => handleCloneUrlCopy(repo.clone_url)}
              // size={"sm"}
              className={`text-xs 2xl:text-sm font-semibold hover:bg-white hover:text-black flex items-center gap-1 text-white rounded-xl p-1 disabled:opacity-70 ${
                copied ? "bg-green-500" : "bg-blue-900"
              }`}
              disabled={copied}
            >
              <span>{copied ? "Copied" : "Clone"}</span>
              <span>
                {copied ? (
                  <Check className="max-sm:size-3 size-4 2xl:size-6" />
                ) : (
                  <BiCopy className="max-sm:size-3 size-4 2xl:size-6" />
                )}
              </span>
            </button>
            {addToBtn ? (
              session?.user &&
              status === "authenticated" && <AddToModal repo={repo} />
            ) : (
              <button
                onClick={() => handleRepoRemove(repo._id)}
                className={`max-sm:text-[8px] text-xs 2xl:text-sm font-semibold bg-red-500 hover:bg-white hover:text-black flex items-center gap-1 text-white rounded-xl p-1 disabled:opacity-70`}
                disabled={loading}
              >
                <span>{loading ? "Removing" : "Remove"}</span>
                <span>
                  <MinusSquare className="max-sm:size-2 size-4 2xl:size-6" />
                </span>
              </button>
            )}
          </div>
        </div>
      </div>
      {repo.topics && repo.topics?.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto">
          {repo.topics.map((topic, i) =>
            pathname === "/" ? (
              <button
                onClick={() => fetchRepos(`topic:${topic}`, "stars", "desc")}
                className="text-xs max-sm:text-[10px] max-sm: bg-slate-800 rounded-xl font-semibold px-2 py-1 text-center whitespace-nowrap hover:underline"
                key={i}
              >
                {topic}
              </button>
            ) : (
              <p
                className="text-xs max-sm:text-[10px] max-sm: bg-slate-800 rounded-xl font-semibold px-2 py-1 text-center whitespace-nowrap"
                key={i}
              >
                {topic}
              </p>
            )
          )}
        </div>
      )}
      <div className="flex flex-wrap items-center gap-2 text-xs">
        {repo.language && (
          <p className="font-semibold flex items-center gap-1">
            <span className="size-3 bg-white rounded-full"></span>
            {repo.language}
          </p>
        )}
        {repo.stargazers_count !== null &&
          repo.stargazers_count !== undefined && (
            <p className="flex items-center gap-2 max-sm:text-[10px]">
              <Star className="size-4" />
              <span>{repo.stargazers_count}</span>
            </p>
          )}
        {repo.forks_count !== null && repo.forks_count !== undefined && (
          <p className="flex items-center gap-2 max-sm:text-[10px]">
            <GitFork className="size-4" />
            <span>{repo.forks_count}</span>
          </p>
        )}
        {repo.updated_at && (
          <p className="max-sm:text-[10px]">
            Updated {format(repo.updated_at)}
          </p>
        )}
      </div>
    </div>
  );
};

export default Repo;
