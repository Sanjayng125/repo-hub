"use server"

import { auth } from "./auth"

const GITHUB_API_BASE_URL = process.env.GITHUB_API_URL || "https://api.github.com"

export const getMyRepos = async () => {
    const session = await auth()
    if (session?.user?.repos_url === undefined) {
        return { repos: [] };
    }
    try {
        const res = await fetch(session?.user?.repos_url, {
            headers: {
                authorization: `token ${process.env.GITHUB_API_KEY}`,
            }
        });

        const repos = await res.json()

        return { repos }
    } catch (error) {
        console.log(error);
        return { repos: [] }
    }
}

export const getRepos = async ({ query = "language:javascript", sortBy = "stars", sortOrder = "desc", page = 1 }: { query: string, sortBy?: string, sortOrder?: string, page?: number }) => {
    try {
        const res = await fetch(`${GITHUB_API_BASE_URL}/search/repositories?q=${query}&sort=${sortBy}&order=${sortOrder}&per_page=30&page=${page}`, {
            headers: {
                authorization: `token ${process.env.GITHUB_API_KEY}`,
            }
        });

        const repos = await res.json()

        return { repos }
    } catch (error) {
        console.log(error);
        return { repos: [] }
    }
}

export const getUserAndRepos = async (username: string) => {
    try {
        const userRes = await fetch(`${GITHUB_API_BASE_URL}/users/${username}`, {
            headers: {
                authorization: `token ${process.env.GITHUB_API_KEY}`,
            }
        });

        const user = await userRes.json()
        if (user && user?.repos_url) {
            const userReposRes = await fetch(user.repos_url, {
                headers: {
                    authorization: `token ${process.env.GITHUB_API_KEY}`,
                }
            });

            const userRepos = await userReposRes.json()

            return { userProfile: user, userRepos }
        }

        return { userProfile: null, userRepos: [] }
    } catch (error) {
        console.log(error);
    }
}