import NextAuth from "next-auth"
import GithunProvider from "next-auth/providers/github"
import { authConfig } from "./auth.config"
import { connectToDb } from "@/utils/db"
import { User } from "@/models/user.model"

export const { handlers, signIn, signOut, auth } = NextAuth({
    ...authConfig,
    providers: [
        GithunProvider,
    ],
    callbacks: {
        async signIn({ account, profile }) {
            if (account?.provider === "github") {
                connectToDb();
                try {
                    const userExists = await User.findOne({ email: profile?.email });

                    if (!userExists) {
                        const newUser = new User({
                            username: profile?.login,
                            email: profile?.email,
                        });
                        const savedUser = await newUser.save();
                        if (!savedUser) {
                            return false;
                        }
                    }
                } catch (error) {
                    console.log(error);
                    return false;
                }
            }
            return true;
        },
        ...authConfig.callbacks
    }
})