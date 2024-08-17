import 'next-auth'
import { DefaultSession } from "next-auth"
import { JWT } from "next-auth/jwt" // can remove this.

// Declaring Next auth session to add extra fields id and username for typescript.
declare module "next-auth" {
    interface User {
        username: string
        name: string
        email: string
        location: string
        url: string
        repos_count: number
        followers_count: number
        following_count: number
        bio: string
        repos_url: string
    }
    interface Session {
        user: {
            username: string
            name: string
            email: string
            location: string
            url: string
            repos_count: number
            followers_count: number
            following_count: number
            bio: string
            repos_url: string
        } & DefaultSession["user"]
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        username: string
        name: string
        email: string
        location: string
        url: string
        repos_count: number
        followers_count: number
        following_count: number
        bio: string
        repos_url: string
    }
}
