import React from "react";
import { FaGithub } from "react-icons/fa";
import SearchBar from "./SearchBar";
import { Home } from "lucide-react";
import Link from "next/link";
import { auth } from "@/lib/auth";
import Image from "next/image";

const Navbar = async () => {
  const session = await auth();

  return (
    <div className="bg-slate-800 p-3 flex items-center justify-between gap-4 relative">
      <Link
        href={"/"}
        className="text-xl sm:text-2xl font-semibold flex items-center gap-1"
      >
        <Image
          src={"/img-512.png"}
          alt="logo"
          width={32}
          height={32}
          className="w-10 h-10"
          quality={100}
        />
        <p>RepoHub</p>
      </Link>
      <SearchBar />
      <div className="flex items-center gap-2">
        <Link href={"/"} className="flex items-center gap-1">
          <span className="max-sm:hidden">Home</span>
          <Home className="sm:hidden" />
        </Link>
        {session?.user ? (
          <Link
            href={"/profile"}
            className="bg-slate-800 p-1 rounded-full w-10 h-10 flex justify-center items-center font-semibold relative"
          >
            {session?.user?.image ? (
              <Image
                src={session?.user?.image}
                alt="DP"
                fill
                className="rounded-full"
              />
            ) : (
              <span>{session?.user?.name?.[0]}</span>
            )}
          </Link>
        ) : (
          <Link href={"/signin"} className="flex items-center gap-1">
            Sign In
          </Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;
