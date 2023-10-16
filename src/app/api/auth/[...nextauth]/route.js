import NextAuth  from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter"

import { PrismaClient } from "@prisma/client"

import bcrypt from 'bcrypt'
import { NextResponse } from "next/server";

const prisma = new PrismaClient()

  
export const authOptions = {
    session:{
        strategy:'jwt'
    },
    providers: [
        CredentialsProvider({
          // The name to display on the sign in form (e.g. "Sign in with...")
          name: "Credentials",
          // `credentials` is used to generate a form on the sign in page.
          // You can specify which fields should be submitted, by adding keys to the `credentials` object.
          // e.g. domain, username, password, 2FA token, etc.
          // You can pass any HTML attribute to the <input> tag through the object.
          credentials: {
            email: { label: "Email", type: "email", placeholder: "jsmith" },
            password: { label: "Password", type: "password" }
          },
          async authorize(credentials, req) {
            let { email, password } = credentials
            if (!email || !password) {
                console.log('here');
                return { error: 'my custom error' };

                
            }
            const exist = await prisma.user.findUnique({
              where:{
                  email: email
              }
          });
          if(!exist){
              return null;
          }
          const passwordMatch = await bcrypt.compare(password, exist.hashedPassword)
          if (!passwordMatch) {
            return null
          }
          return exist;
          }
        })
      ],
      session:{
        strategy: "jwt"
      },
      secret: process.env.NEXTAUTH_SECRET,
      debug: process.env.NODE_ENV == "development",
      callbacks:{
        async jwt({token, user, session})
        {
          console.log('token',{token, user, session})
          return token
        },
        async session({token, user, session})
        {
          console.log('session',{token, user, session})
          return session

        },
        async redirect({url, baseUrl}) {
          console.log('url', url);
          console.log('baseUrl', baseUrl);
          
          return url.startsWith(baseUrl) ? url : baseUrl + '/dashboard';
        },
        async signIn({ user, account, profile, email, credentials }) {
          const isAllowedToSignIn = true
          if (isAllowedToSignIn) {
            return true
          } else{
            return false
          }
        }
      }

}
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST }
