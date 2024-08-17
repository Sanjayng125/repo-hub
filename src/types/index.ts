export interface UserProfile {
    name: string;
    login: string
    email: string;
    avatar?: string;
    avatar_url?: string;
    location?: string;
    followers: number;
    following: number;
    url: string
    bio?: string
    public_repos: number
}

export interface RepoProps {
    _id: string
    id: string
    name: string
    owner: UserProfile
    stargazers_count: number
    language: string
    forks_count: number
    topics?: string[]
    clone_url: string
    ssh_url: string
    url: string
    updated_at: string
    repoOwnerUsername?: string
    repoOwnerAvatar?: string
    repoName?: string
}

export interface collectionProps {
    _id: string
    name: string
    ownerId: string
    createdAt: string
    reposCount: number
}