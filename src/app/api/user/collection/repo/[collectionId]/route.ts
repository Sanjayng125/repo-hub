import { auth } from "@/lib/auth"
import { Collection } from "@/models/collection.model"
import { Repo } from "@/models/repo.model"
import { User } from "@/models/user.model"
import { connectToDb } from "@/utils/db"

export const GET = async (_req: Request, { params }: { params: { collectionId: string } }) => {
    const session = await auth()
    const collectionId = params.collectionId

    if (session?.user) {
        try {
            await connectToDb()

            const validUser = await User.findOne({ email: session.user.email })
            if (!validUser) {
                return Response.json({ success: false, message: "User not found!" }, { status: 400 })
            }

            if (!collectionId || collectionId === "") {
                return Response.json({ success: false, message: "Collection Id not provided!" }, { status: 400 })
            }

            const collectionExists = await Collection.findOne({ _id: collectionId, ownerId: validUser._id })

            if (!collectionExists) {
                return Response.json({ success: false, message: "Collection not found!" }, { status: 400 })
            }

            const repos = await Repo.find({ collectionId, ownerId: validUser._id })

            return Response.json({ success: true, message: "Repos: Ok", repos }, { status: 200 })
        } catch (error) {
            console.log(error);
            return Response.json({ success: false, message: "Something went wrong while fetching repos!" }, { status: 500 })
        }
    } else {
        return Response.json({ success: false, message: "Unauthorized!" }, { status: 401 })
    }
}