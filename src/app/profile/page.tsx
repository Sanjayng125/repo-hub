"use client";

import { CollectionModal } from "@/components/CollectionModal";
import { Options } from "@/components/Options";
import Repo from "@/components/Repo";
import { Button } from "@/components/ui/button";
import { useMyStore } from "@/context/store/ZustandStore";
import { getMyRepos } from "@/lib/actions";
import { sortRepos } from "@/utils";
import { Loader, Mail, MapPin, Menu, Users } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { Separator } from "@/components/ui/separator";

const Profile = () => {
  const { data: session, status } = useSession();
  const { myRepos, setMyRepos } = useMyStore();
  const [sortBy, setSortBy] = useState("updated");
  const { isLoading } = useQuery({
    queryKey: ["myrepos"],
    queryFn: () => {
      const res = getMyRepos();
      return res;
    },
    onSuccess: (data: any) => {
      setMyRepos(data.repos);
    },
    staleTime: 1000 * 60 * 10, // 10 minutes
  });

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/signin", redirect: true });
  };

  useEffect(() => {
    if (myRepos.length === 0) return;
    setMyRepos(sortRepos(sortBy, myRepos));
  }, [myRepos]);

  //   console.log(myRepos);

  return (
    <div className="w-full h-full overflow-y-auto">
      {(status === "loading" || isLoading) && (
        <div className="w-full h-full flex justify-center items-center">
          <Loader className="w-20 h-20 animate-spin" />
        </div>
      )}
      {session?.user && status === "authenticated" && !isLoading && (
        <>
          <div className="w-full flex items-center gap-5">
            <Image
              src={session?.user?.image || "/noavatar.png"}
              alt="DP"
              width={100}
              height={100}
              quality={100}
              className="w-full max-w-52 max-sm:w-3/4 h-auto aspect-square  rounded-full"
            />
            <div className="w-full break-all">
              <p className="text-3xl max-[390px]:text-2xl font-semibold">
                {session?.user?.name}
              </p>
              <p className="text-xl max-[368px]:text-lg text-gray-600">
                {session?.user?.username}
              </p>
              {session.user.bio && <p className="mt-5">{session?.user?.bio}</p>}
            </div>
          </div>
          <p className="flex items-center gap-1 my-1">
            <Users />
            followers: {session?.user?.followers_count || "0"} &#x2022;
            following: {session?.user?.following_count || "0"}
          </p>
          <p className="flex items-center gap-1 my-1">
            <Mail />
            {session?.user?.email}
          </p>
          {session.user.location && (
            <p className="flex items-center gap-1 my-1">
              <MapPin />
              {session?.user?.location}
            </p>
          )}
          <div className="flex flex-wrap items-center space-x-1 my-2">
            <Button
              onClick={handleSignOut}
              variant={"outline"}
              className="bg-red-600 p-2 rounded-lg my-2"
            >
              Sign Out
            </Button>
            <Options Icon={Menu}>
              <CollectionModal border={false} />
              <Separator />
              <Button variant={"ghost"} className="text-white w-full  ">
                <Link href={"/collections"} className="w-full">
                  My Collections
                </Link>
              </Button>
            </Options>
          </div>
          <hr />
          <div className="flex items-center gap-2 p-3">
            <button
              onClick={() => {
                setSortBy("updated");
                setMyRepos(sortRepos("updated", myRepos));
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
                setMyRepos(sortRepos("stars", myRepos));
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
                setMyRepos(sortRepos("forks", myRepos));
              }}
              className={`px-3 py-2 border rounded-lg max-sm:px-2 max-sm:py-1 max-sm:text-sm ${
                sortBy === "forks" && "bg-white text-black"
              }`}
            >
              Forks
            </button>
          </div>
          <div className="flex flex-col gap-3 p-3">
            {myRepos.map((repo, i) => (
              <Repo repo={repo} key={i} myProfile={true} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Profile;
