"use client";

import { Search } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const SearchBar = () => {
  const [search, setSearch] = useState("");
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (
      search === "" &&
      pathname.startsWith("/search/") &&
      typeof pathname.split("/").pop() === "string" &&
      pathname.split("/").pop() !== ""
    ) {
      setSearch(pathname.split("/").pop() || "");
    }
  }, [pathname]);

  return (
    <div className="w-full max-w-lg flex-1">
      <div className="flex items-center border rounded-lg p-1">
        <input
          type="text"
          className="bg-transparent outline-none sm:p-1 w-full flex-1"
          placeholder="john_cena"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) =>
            e.key === "Enter" &&
            search !== "" &&
            router.push(`/search/${search}`)
          }
        />
        <button
          onClick={() => search !== "" && router.push(`/search/${search}`)}
          className="flex items-center sm:gap-1 bg-slate-900 p-1 sm:p-2 rounded-lg hover:opacity-70 font-semibold"
        >
          <span className="max-sm:hidden">Search</span>
          <Search className="max-[450px]:size-5" />
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
