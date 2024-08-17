import { auth } from "@/lib/auth";
import { Collection } from "@/models/collection.model";
import { Repo } from "@/models/repo.model";
import { User } from "@/models/user.model";
import { connectToDb } from "@/utils/db";

export const POST = async (req: Request) => {
    const session = await auth()
    const { name } = await req.json()

    if (session?.user) {
        try {
            await connectToDb()

            const validUser = await User.findOne({ email: session.user.email })
            if (!validUser) {
                return Response.json({ success: false, message: "User not found!" }, { status: 400 })
            }

            if (!name || name === "") {
                return Response.json({ success: false, message: "Name is required!" }, { status: 400 })
            }

            const collectionExists = await Collection.findOne({ name, ownerId: validUser._id })

            if (collectionExists) {
                return Response.json({ success: false, message: "Name is already taken!" }, { status: 400 })
            }

            const newCollection = new Collection({
                name,
                ownerId: validUser._id
            })

            await newCollection.save()

            if (!newCollection) {
                return Response.json({ success: false, message: "Something went wrong while creating collection!" }, { status: 400 })
            }

            return Response.json({ success: true, message: "Collection created!" }, { status: 201 })
        } catch (error) {
            console.log(error);
            return Response.json({ success: false, message: "Something went wrong while creating collection!" }, { status: 500 })
        }
    } else {
        return Response.json({ success: false, message: "Unauthorized!" }, { status: 401 })
    }
}

export const GET = async (_req: Request) => {
    const session = await auth()

    if (session?.user) {
        await connectToDb()

        try {
            const validUser = await User.findOne({ email: session.user.email })
            if (!validUser) {
                return Response.json({ success: false, message: "User not found!" }, { status: 400 })
            }

            const collections = await Collection.aggregate([
                {
                    $match: {
                        ownerId: validUser._id
                    }
                },
                {
                    $lookup: {
                        from: "repos",
                        localField: "_id",
                        foreignField: "collectionId",
                        as: "repos"
                    }
                },
                {
                    $addFields: {
                        reposCount: { $size: "$repos" },
                    }
                },
                {
                    $project: {
                        repos: 0
                    }
                }
            ])

            return Response.json({ success: true, message: "Collections: Ok", collections }, { status: 200 })
        } catch (error) {
            console.log(error);
            return Response.json({ success: false, message: "Something went wrong while fetching collections!" }, { status: 500 })
        }
    } else {
        return Response.json({ success: false, message: "Unauthorized!" }, { status: 401 })
    }
}

export const PATCH = async (req: Request) => {
    const session = await auth()
    const { name, collectionId } = await req.json()

    if (session?.user) {
        try {
            await connectToDb()

            const validUser = await User.findOne({ email: session.user.email })
            if (!validUser) {
                return Response.json({ success: false, message: "User not found!" }, { status: 400 })
            }

            if (!name || name === "" || !collectionId || collectionId === "") {
                return Response.json({ success: false, message: "All fields are required!" }, { status: 400 })
            }

            const collectionExists = await Collection.findById(collectionId)
            const collectionNameExists = await Collection.findOne({ name })

            if (!collectionExists) {
                return Response.json({ success: false, message: "Collection not found!!" }, { status: 400 })
            }

            if (collectionNameExists) {
                return Response.json({ success: false, message: "Name is already taken!" }, { status: 400 })
            }

            if (collectionExists.ownerId.toString() !== validUser._id.toString()) {
                return Response.json({ success: false, message: "You can only update your collections!" }, { status: 401 })
            }

            const updatedCollection = await Collection.findByIdAndUpdate(collectionExists._id, {
                name
            }, { new: true })

            if (!updatedCollection) {
                return Response.json({ success: false, message: "Something went wrong while updating collection!" }, { status: 400 })
            }

            return Response.json({ success: true, message: "Collection updated!" }, { status: 200 })
        } catch (error) {
            console.log(error);
            return Response.json({ success: false, message: "Something went wrong while updating collection!" }, { status: 500 })
        }
    } else {
        return Response.json({ success: false, message: "Unauthorized!" }, { status: 401 })
    }
}

export const DELETE = async (req: Request) => {
    const session = await auth()
    const { collectionId } = await req.json()

    if (session?.user) {
        try {
            await connectToDb()

            const validUser = await User.findOne({ email: session.user.email })
            if (!validUser) {
                return Response.json({ success: false, message: "User not found!" }, { status: 400 })
            }

            if (!collectionId || collectionId === "") {
                return Response.json({ success: false, message: "Collection Id is required!" }, { status: 400 })
            }

            const collectionExists = await Collection.findOne({ _id: collectionId })

            if (!collectionExists) {
                return Response.json({ success: false, message: "Collection not found!" }, { status: 400 })
            }

            if (collectionExists.ownerId.toString() !== validUser._id.toString()) {
                return Response.json({ success: false, message: "You can only delete your collections!" }, { status: 401 })
            }

            await Repo.deleteMany({ collectionId: collectionExists._id })
            await Collection.findByIdAndDelete(collectionExists._id)

            return Response.json({ success: true, message: "Collection deleted!" }, { status: 200 })
        } catch (error) {
            console.log(error);
            return Response.json({ success: false, message: "Something went wrong while deleting collection!" }, { status: 500 })
        }
    } else {
        return Response.json({ success: false, message: "Unauthorized!" }, { status: 401 })
    }
}