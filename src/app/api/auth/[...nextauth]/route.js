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
            
          }
        })
      ],
      callbacks:{
        async signIn({ user, account, profile, email, credentials }) {
          if(user?.error === 'my custom error') {
             throw new Error('custom error to the client')
          }
       }
      }

}
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST }

