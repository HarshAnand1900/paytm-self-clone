import { redirect } from "next/navigation"
import { db } from "app/lib/db";
import { cookies } from "next/headers";
import Link from "next/link"
import getCurrentUserId from "app/lib/auth";
import getDisplayMessage from "app/lib/message";
import { randomBytes, scryptSync} from "crypto";




export default async function Signup({
    searchParams,
  }:{
    searchParams?: Promise<{message?: string}>
  }){

    const displayMessage = await getDisplayMessage({searchParams})

    const helperCookie = await getCurrentUserId()

    if(helperCookie)
        redirect("/")

    async function createUser(formData: FormData){
        "use server"
  
     const username = formData.get("name")
     const phone = formData.get("phone")
     const password = formData.get("password")

      if(!username || !phone || !password){
        redirect('/signup?message=missing-info')
      }

     const stringUsername = String(username)
     const stringPhone = String(phone)
     const stringPassword = String(password)

     const salt = randomBytes(16).toString("hex");
     const hashedPasword = scryptSync(stringPassword,salt,64).toString("hex");
     const storedPaswword = `${salt}:${hashedPasword}`

     const findUser = await db.user.findUnique({
        where:{
            phone: stringPhone,
        }
     })

      if(findUser)
        redirect('/signup?message=user-already-exists')

      const createUser = await db.user.create({
        data:{
            name: stringUsername,
            phone: stringPhone,
            password: storedPaswword
        }
      })

      

       await db.balance.create({
        data:{
            userId : createUser.id,
            amount : 0
        }
      })

      const cookiesStore = await cookies();
      cookiesStore.set("userId", String(createUser.id),{
            httpOnly: true,
            path: "/",
        });
      redirect('/')
    }

    return(
        <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-4">
            <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-8 space-y-6 shadow-lg">

              <div>
                 <h2 className="text-2xl font-semibold">Sign Up</h2>
                 <p className="text-slate-400 text-sm">Welcome . Enter your details.</p>
               </div>

            {displayMessage &&  <p>{displayMessage}</p>}
            
            <form className="w-full  mt-4 flex flex-col gap-4"
            action={createUser}>
            <input  className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2.5 text-white placeholder:text-slate-400 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
            placeholder="Enter Your Name..." name={"name"}></input>
            <input className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2.5 text-white placeholder:text-slate-400 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
             type="text" placeholder="Phone Number...." name={"phone"}></input>
            <input className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2.5 text-white placeholder:text-slate-400 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
            type="password" placeholder="Password" name={"password"}></input>
            <button className="w-full bg-blue-700 hover:bg-blue-600 active:scale-[0.98] transition text-white font-semibold py-2.5 rounded-lg"
             type="submit">SignUp</button>
            </form>
           <p className="text-sm text-slate-400 text-center"
           >Already a User? 
           <Link className="text-blue-400 hover:underline"
            href={"/signin"}>Sign in</Link></p>
         </div>
        </div>
    )
}
