import { RepoProps } from "@/types";

export const sortRepos = (sortBy: string, repos: RepoProps[]) => {
    if (sortBy === "stars") {
        return repos.sort((a, b) => b.stargazers_count - a.stargazers_count);
    }
    if (sortBy === "forks") {
        return repos.sort((a, b) => b.forks_count - a.forks_count);
    }
    if (sortBy === "updated") {
        repos.sort((a: any, b: any) => {
            const dateA = new Date(a.updated_at);
            const dateB = new Date(b.updated_at);

            return dateB.getTime() - dateA.getTime();
        });
    }
    return repos;
};