import { db } from "app/lib/db";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import Link from "next/link"
import getCurrentUserId from "app/lib/auth";
import getDisplayMessage from "app/lib/message";
import { scryptSync } from "crypto";




export default async function SignUp ({
    searchParams,
  }:{
    searchParams?: Promise<{message?: string}>
  }) {

    const helperCookie = await getCurrentUserId()

    if(helperCookie)
        redirect("/")

    async function checkUser(formData: FormData){
        "use server"

    const phoneNum = formData.get("phone")
    const phoneString = String(phoneNum)

    const userPass = formData.get("password")
    const stringPass = String(userPass)

        const userCheck = await db.user.findUnique({
            where:{
                phone: phoneString
            }
        })

        if(!userCheck)
            redirect('/signin?message=user-not-found')

        const [salt , storedHash] = userCheck.password.split(":");

        if(!salt || !storedHash)
            redirect('/signin?message=wrong-password');

        const hashedInputPassword = scryptSync(stringPass, salt , 64).toString("hex");

        if(hashedInputPassword !== storedHash)
            redirect('/signin?message=wrong-password')


        const actionCookieStore = await cookies()
        actionCookieStore.set("userId", String(userCheck.id),{
            httpOnly: true,
            path: "/",
        });
        redirect('/')
    }

    
    const displayMessage = await getDisplayMessage({searchParams})
    const isSuccessMessage = displayMessage?.toLocaleLowerCase()  === "success";
    
    return(
        <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center  px-4 py-8">
            <div className="mx-auto w-full max-w-md rounded-xl border border-slate-800 bg-slate-900 p-6">
            
                <div>
                 <h2 className="text-2xl font-semibold">Sign In</h2>
                 <p className="text-slate-400 text-sm">Welcome back. Enter your details.</p>
               </div>

                 {displayMessage &&  (
                    <p 
                    className={`mb-4 rounded-lg border px-3 py-2 text-sm fond-medium 
                        ${isSuccessMessage
                       ?"border-emerald-700 bg-emerald-950 text-emerald-300"
                       :"border-rose-700 bg-rose-950 text-rose-300"
                        }`}
                    >
                   {displayMessage}
                    </p>
                 )}

              <form className="w-full  mt-4 flex flex-col gap-4"
               action={checkUser}>
                <input 
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2.5 text-white placeholder:text-slate-400 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                type="number" name="phone" placeholder="Phone Number"></input>
                <input 
                className=" w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2.5 text-white placeholder:text-slate-400 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                type="password" name="password" placeholder="Password..."></input>
                <button className="w-full bg-blue-700 hover:bg-blue-600 active:scale-[0.98] transition text-white font-semibold py-2.5 rounded-lg"
                 type="submit">SignIn</button>
             </form>

             <p className="text-sm text-slate-400 text-center">Don’t have an account? 
                <Link className="text-blue-400 hover:underline"
                href={"/signup"}>Sign up</Link></p>
            
            </div>           
        </div>
    )
}
