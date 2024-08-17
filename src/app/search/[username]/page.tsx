"use client";

import Repo from "@/components/Repo";
import { getUserAndRepos } from "@/lib/actions";
import { RepoProps, UserProfile } from "@/types";
import { sortRepos } from "@/utils";
import { ArrowUpRight, Loader, Mail, MapPin, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const Search = ({ params }: { params: { username: string } }) => {
  const [userRepos, setUserRepos] = useState<RepoProps[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [sortBy, setSortBy] = useState("updated");
  const [isLoading, setIsLoading] = useState(true);

  const fetchUser = async () => {
    try {
      setIsLoading(true);
      await getUserAndRepos(decodeURIComponent(params.username)).then((res) => {
        setUserProfile(res?.userProfile);
        setUserRepos(
          res?.userRepos.length > 0
            ? sortRepos(sortBy, res?.userRepos)
            : res?.userRepos
        );
      });
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [params]);

  //   console.log(myRepos);

  return (
    <div className="w-full h-full overflow-y-auto">
      {isLoading && (
        <div className="w-full h-full flex justify-center items-center">
          <Loader className="w-20 h-20 animate-spin" />
        </div>
      )}
      {!userProfile && !isLoading && (
        <p className="text-xl font-semibold text-center">User Not Found</p>
      )}
      {userProfile && !isLoading && (
        <>
          <div className="w-full flex items-center gap-5">
            <Image
              src={userProfile.avatar_url || "/noavatar.png"}
              alt="DP"
              width={100}
              height={100}
              quality={100}
              className="w-full max-w-52 max-sm:w-3/4 h-auto aspect-square  rounded-full"
            />
            <div className="w-full break-all">
              {userProfile.name && (
                <p className="text-3xl max-[390px]:text-2xl font-semibold">
                  {userProfile.name}
                </p>
              )}
              <p className="text-xl max-[368px]:text-lg text-gray-600">
                {userProfile.login}
              </p>
              {userProfile.bio && <p className="mt-5">{userProfile?.bio}</p>}
            </div>
          </div>
          <p className="flex items-center gap-1 my-1">
            <Users />
            followers: {userProfile?.followers || "0"} &#x2022; following:{" "}
            {userProfile?.following || "0"}
          </p>
          {userProfile.email && (
            <p className="flex items-center gap-1 my-1">
              <Mail />
              {userProfile?.email}
            </p>
          )}
          {userProfile.location && (
            <p className="flex items-center gap-1 my-1">
              <MapPin />
              {userProfile?.location}
            </p>
          )}
          <Link
            href={`https://github.com/${userProfile.login}`}
            target="_blank"
            className="w-max flex items-center gap-1 my-2 bg-transparent border p-2 rounded-lg hover:underline"
          >
            <span>View On Github</span>
            <span>
              <ArrowUpRight />
            </span>
          </Link>
          <hr />
          <div className="flex items-center gap-2 p-3">
            <button
              onClick={() => {
                setSortBy("updated");
                setUserRepos(sortRepos("updated", userRepos));
              }}
              className={`px-3 py-2 border rounded-lg max-sm:px-2 max-sm:py-1 max-sm:text-sm ${
                sortBy === "updated" && "bg-white text-black"
              }`}
            >
              Recent
            </button>
            <button
              onClick={() => {
                setSortBy("stars");
                setUserRepos(sortRepos("stars", userRepos));
              }}
              className={`px-3 py-2 border rounded-lg max-sm:px-2 max-sm:py-1 max-sm:text-sm ${
                sortBy === "stars" && "bg-white text-black"
              }`}
            >
              Stars
            </button>
            <button
              onClick={() => {
                setSortBy("forks");
                setUserRepos(sortRepos("forks", userRepos));
              }}
              className={`px-3 py-2 border rounded-lg max-sm:px-2 max-sm:py-1 max-sm:text-sm ${
                sortBy === "forks" && "bg-white text-black"
              }`}
            >
              Forks
            </button>
          </div>
          {userRepos.length === 0 && !isLoading && (
            <p className="text-xl font-semibold text-center">No Repos Found</p>
          )}
          {userRepos && userRepos.length > 0 && (
            <div className="flex flex-col gap-3 p-3">
              <p className="text-xl font-semibold">
                Repos: {userProfile.public_repos}
              </p>
              {userRepos.map((repo, i) => (
                <Repo repo={repo} key={i} myProfile={true} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Search;
