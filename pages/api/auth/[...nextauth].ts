import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials"
import prisma from '@/lib/prismadb'
import type { userType } from "@/lib/types";
import axios from "axios";

export default NextAuth({
    adapter: PrismaAdapter(prisma),
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                username: { label: 'Username', type: 'text' },
                password: { label: 'Password', type: 'password' }
            },
            async authorize(credentials, req) {
                if (credentials) {
                    const res = await axios.post(process.env.NEXTAUTH_URL + '/api/user/read/signin', { ...credentials }, {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    })

                    const user = res.data;

                    if (user && user.ok) {
                        return user
                    }

                    return null

                }
            }
        })
    ],
    session: {
        strategy: 'jwt'
    },
    callbacks: {
        jwt: async ({ token, user }) => {
            if (user) {
                let currentUser = user as userType;
                token.uid = currentUser.id;
                token.email = currentUser.email;
                token.name = currentUser.username;
                token.picture = currentUser.image;
                token.sub = (currentUser.role as any).rolePermissions
            }

            return token
        },
        session: ({ session, token }) => {
            if (token) {
                if (session?.user) {
                    session.user.email = token.email;
                    session.user.name = token.name;
                    session.user.image = token.picture;
                    (session.user as any).id = token.uid;
                    // the user that have permissions to read user will have access to read 'SECRET'environtment variable
                    (session.user as any)._XYS = (token.sub as any).readUser ? process.env.SECRET : '';
                }
            }

            return session
        }
    },
    pages: {
        signIn: '/auth/login'
    },
    secret: process.env.NEXTAUTH_SECRET,
});