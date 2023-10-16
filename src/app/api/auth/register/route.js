import bcrypt from 'bcrypt'
import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'

const prisma = new PrismaClient();

export async function POST(request)
{
    const body = await request.json();
    const {name, email, password} = body.data
    console.log(body)
    if(!name||!email||!password)
    {
        return new NextResponse(400,{error:"Missing name, email or password"});
    }
    const exist = await prisma.user.findUnique({
        where:{
            email: email
        }
    });
    if(exist){
        return new NextResponse("User already exist", {status: 400});
    }
    const hashedPassword = await bcrypt.hash(password,10);
    const user = await prisma.user.create({
        data:{
            name,
            email,
            hashedPassword
        }
    })
    return NextResponse.json(user)
}