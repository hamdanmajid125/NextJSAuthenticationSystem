import { getServerSession } from "next-auth"
import { authOptions } from "./api/auth/[...nextauth]/route";
import User from "./user";
 
export default async function Home() {
  const session = await getServerSession(authOptions);
  return (
   <main>
    <div>Server Sesion</div>
    <pre>{JSON.stringify(session)}</pre>
    <div>Client Sesion</div>
    <User/>
   </main>
  )
}
