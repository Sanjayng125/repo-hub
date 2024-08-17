import { auth } from "@/lib/auth"
import { Collection } from "@/models/collection.model"
import { Repo } from "@/models/repo.model"
import { User } from "@/models/user.model"
import { connectToDb } from "@/utils/db"

export const POST = async (req: Request) => {
    const session = await auth()
    const { collectionId, repoId, repoName, repoOwnerUsername, repoOwnerAvatar, topics, language } = await req.json()

    if (session?.user) {
        try {
            await connectToDb()

            const validUser = await User.findOne({ email: session.user.email })
            if (!validUser) {
                return Response.json({ success: false, message: "User not found!" }, { status: 400 })
            }

            if ((!collectionId || collectionId === "") || (!repoName || repoName === "") || (!repoOwnerUsername || repoOwnerUsername === "") || (!repoId || repoId === "")) {
                return Response.json({ success: false, message: "All fields are required!" }, { status: 400 })
            }

            const collectionExists = await Collection.findOne({ _id: collectionId, ownerId: validUser._id })

            if (!collectionExists) {
                return Response.json({ success: false, message: "Collection not found!" }, { status: 400 })
            }

            const repoExists = await Repo.findOne({ collectionId, repoId })

            if (repoExists) {
                return Response.json({ success: true, message: "Repo already added!" }, { status: 200 })
            }

            const newRepo = new Repo({
                ownerId: validUser._id, collectionId, repoName, repoOwnerUsername, repoOwnerAvatar, repoId, topics, language
            })
            await newRepo.save()

            if (!newRepo) {
                return Response.json({ success: false, message: "Something went wrong while adding repo!" }, { status: 400 })
            }

            return Response.json({ success: true, message: "Repo added" }, { status: 200 })
        } catch (error) {
            console.log(error);
            return Response.json({ success: false, message: "Something went wrong while adding repo!" }, { status: 500 })
        }
    } else {
        return Response.json({ success: false, message: "Unauthorized!" }, { status: 401 })
    }
}

export const DELETE = async (req: Request) => {
    const session = await auth()
    const { repoId } = await req.json()

    if (session?.user) {
        try {
            await connectToDb()

            const validUser = await User.findOne({ email: session.user.email })
            if (!validUser) {
                return Response.json({ success: false, message: "User not found!" }, { status: 400 })
            }

            if (!repoId || repoId === "") {
                return Response.json({ success: false, message: "Repo Id is required!" }, { status: 400 })
            }

            const repoExists = await Repo.findById(repoId)

            if (!repoExists) {
                return Response.json({ success: false, message: "Repo not found!" }, { status: 400 })
            }

            if (repoExists.ownerId.toString() !== validUser._id.toString()) {
                return Response.json({ success: false, message: "You can only remove your repos!" }, { status: 401 })
            }

            await Repo.findByIdAndDelete(repoId)

            return Response.json({ success: true, message: "Repo removed" }, { status: 200 })
        } catch (error) {
            console.log(error);
            return Response.json({ success: false, message: "Something went wrong while removing repo!" }, { status: 500 })
        }
    } else {
        return Response.json({ success: false, message: "Unauthorized!" }, { status: 401 })
    }
}