import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter"

import { PrismaClient } from "@prisma/client"

import bcrypt from 'bcrypt'
import { NextResponse } from "next/server";

const prisma = new PrismaClient()


export const authOptions = {
  session: {
    strategy: 'jwt'
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "jsmith" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        let { email, password } = credentials
        console.log(email)
        console.log(password)
        if (!email || !password) {
          return { error: 'my custom error' };
        }

        const user = await prisma.user.findUnique({
          where: {
            email: email
          }
        });
        if(user){
          const matched = await bcrypt.compare(password,user.hashedPassword);
          if(matched)
          {
            return user
          }
          
        }
        return null;


      }
    })
  ],
  session: {
    strategy: "jwt"
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV == "development",
  callbacks: {
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url
      return baseUrl+'/dashboard'
    }, 
    async jwt({ token, user, session }) {
      console.log("jwt")
      console.log({ token, user, session });
      if (user) {
        return {
          ...token,
          id:user.id
        }
      }
      return token
    
    },
    async session({ session, token, user }) {
      console.log("session")
      console.log({ session, token, user })
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
          address: token.address
        }
      }
      
      
      return session
    }, 
    async signIn({ user, account, profile, email, credentials }) {
      console.log("signIn")
      console.log({  user, account, profile, email, credentials })
      const isAllowedToSignIn = true
      if (user?.error === 'my custom error') {
        throw new Error('custom error to the client')
      }
      if (isAllowedToSignIn) {
        return true
      } else {
        // Return false to display a default error message
        return false
        // Or you can return a URL to redirect to:
        // return '/unauthorized'
      }
    }
  }

}
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST }

