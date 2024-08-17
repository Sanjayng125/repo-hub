import { type NextAuthConfig } from "next-auth";

export const authConfig: NextAuthConfig = {
    pages: {
        signIn: "/signin",
    },
    providers: [],
    callbacks: {
        async jwt({ token, profile }) {
            if (profile) {
                token.username = profile.login as string;
                token.location = profile.location as string;
                token.url = profile.url as string;
                token.repos_count = profile.public_repos as number;
                token.followers_count = profile.followers as number;
                token.following_count = profile.following as number;
                token.bio = profile.bio as string;
                token.repos_url = profile.repos_url as string;
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user.username = token.username;
                session.user.location = token.location;
                session.user.url = token.url;
                session.user.repos_count = token.repos_count;
                session.user.followers_count = token.followers_count;
                session.user.following_count = token.following_count;
                session.user.bio = token.bio;
                session.user.repos_url = token.repos_url;
            }
            return session;
        },
        authorized({ auth, request }: any) {
            const user = auth?.user;

            const isOnProfilePage = request.nextUrl?.pathname?.startsWith("/profile");
            const isOnCollectionsPage = request.nextUrl?.pathname?.startsWith("/collections");
            const isOnLoginPage = request.nextUrl?.pathname?.startsWith("/login");

            // ONLY AUTHENTICATED USERS CAN REACH PROFILE PAGE
            if (isOnProfilePage && !user) {
                return false;
            }
            if (isOnCollectionsPage && !user) {
                return false;
            }

            // ONLY UNAUTHENTICATED USERS CAN REACH LOGIN PAGE
            if (isOnLoginPage && user) {
                return Response.redirect(new URL("/", request.nextUrl));
            }

            return true;
        },
    },
};
