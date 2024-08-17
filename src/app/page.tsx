"use client";

import Repo from "@/components/Repo";
import { useMyStore } from "@/context/store/ZustandStore";
import { getRepos } from "@/lib/actions";
import { Loader } from "lucide-react";
import { useState } from "react";
import { useQuery } from "react-query";

const HomePage = () => {
  const [query, setQuery] = useState("language:javascript");
  const [language, setLanguage] = useState("javascript");
  const [topic, setTopic] = useState("mern");
  const [sortOrder, setSortOrder] = useState("desc");
  const [sortBy, setSortBy] = useState("stars");
  const {
    isLoading: storeLoading,
    setIsLoading,
    setExploreRepos,
    exploreRepos: repos,
  } = useMyStore();
  const { isLoading } = useQuery({
    queryKey: ["repos"],
    queryFn: () => {
      return getRepos({ query, sortBy, sortOrder }).then((res) => {
        setExploreRepos(res.repos?.items);
        return res;
      });
    },
    staleTime: 1000 * 60 * 10, // 10 minutes
  });

  const fetchRepos = async (
    query: string,
    sortBy: string,
    sortOrder: string
  ) => {
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
  };

  return (
    <div className="w-full h-full overflow-y-auto">
      {(isLoading || storeLoading) && (
        <div className="w-full h-full flex justify-center items-center">
          <Loader className="w-20 h-20 animate-spin" />
        </div>
      )}
      {!isLoading && !storeLoading && (
        <div className="w-full flex flex-col gap-3 p-1">
          <div className="w-full bg-transparent flex flex-wrap gap-2">
            <select
              className="w-min bg-slate-900 p-2 rounded-lg"
              onChange={(e) => {
                fetchRepos(`language:${e.target.value}`, sortBy, sortOrder);
                setQuery(`language:${e.target.value}`);
                setLanguage(e.target.value);
              }}
              defaultValue={language}
            >
              <option value="javascript">Javascript</option>
              <option value="python">Python</option>
              <option value="typescript">Typescript</option>
              <option value="java">Java</option>
              <option value="cpp">Cpp</option>
              <option value="c">C</option>
            </select>
            <select
              className="w-min bg-slate-900 p-2 rounded-lg"
              onChange={(e) => {
                fetchRepos(`topic:${e.target.value}`, sortBy, sortOrder);
                setQuery(`topic:${e.target.value}`);
                setTopic(e.target.value);
              }}
              defaultValue={topic}
            >
              <option value="mern">MERN</option>
              <option value="ai">AI</option>
              <option value="ml">Machine Learning</option>
              <option value="web-devolopment">Web Devolopment</option>
              <option value="app-devolopment">App Devolopment</option>
              <option value="frontend">Frontend</option>
              <option value="backend">Backend</option>
              <option value="data-structures">Data Structures</option>
            </select>
            <select
              className="w-min bg-slate-900 p-2 rounded-lg"
              onChange={(e) => {
                fetchRepos(query, sortBy, e.target.value);
                setSortOrder(e.target.value);
              }}
              defaultValue={sortOrder}
            >
              <option value="desc">Desc</option>
              <option value="asc">Asc</option>
            </select>
            <select
              className="w-min bg-slate-900 p-2 rounded-lg"
              onChange={(e) => {
                fetchRepos(query, e.target.value, sortOrder);
                setSortBy(e.target.value);
              }}
              defaultValue={sortBy}
            >
              <option value="stars">Stars</option>
              <option value="forks">Forks</option>
            </select>
          </div>
          <hr />
          <div className="flex flex-col gap-3 p-3">
            {repos && repos?.map((repo, i) => <Repo repo={repo} key={i} />)}
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
