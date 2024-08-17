import { collectionProps, RepoProps } from "@/types"
import { create } from "zustand"

interface MyStore {
    isLoading: boolean
    exploreRepos: RepoProps[]
    myRepos: RepoProps[]
    myCollections: collectionProps[]
    setExploreRepos: (repos: RepoProps[]) => void
    setMyRepos: (repos: RepoProps[]) => void
    setMyCollections: (collections: collectionProps[]) => void
    setIsLoading: (loadingState: boolean) => void
}

export const useMyStore = create<MyStore>((set) => ({
    isLoading: false,
    exploreRepos: [],
    myRepos: [],
    myCollections: [],
    setExploreRepos: (repos) => set(() => ({ exploreRepos: repos })),
    setMyRepos: (repos) => set(() => ({ myRepos: repos })),
    setMyCollections: (collections) => set(() => ({ myCollections: collections })),
    setIsLoading: (loadingState) => set(() => ({ isLoading: loadingState })),
}));