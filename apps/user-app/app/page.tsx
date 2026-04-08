import { Prisma } from "@prisma/client";
import { db } from "./lib/db";
import transferMoney from "./lib/transfer";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import getCurrentUserId from "./lib/auth";
import getDisplayMessage from "./lib/message";


  

  export default async function Home({
    searchParams,
  }:{
    searchParams?: Promise<{message?: string ; filter?: string}>
  }) {

    
    const resolvedSearchParams = await searchParams
    const selectedFilter = resolvedSearchParams?.filter || "all";

    
    

    async function deleteCookie(){
      "use server"
     const deleteCookiesStore = await cookies();
     deleteCookiesStore.delete("userId")
     redirect('/signin')
    }

    const currentUserId = await getCurrentUserId()

    if(currentUserId === null){
     redirect("/signin")
    }

    const userId = currentUserId 


    async function sendMoney(formData: FormData){
      "use server"

       const balanceCheck = await db.balance.findUnique({
      where:{
        userId: userId
      }
    })
     
      const toUserId = formData.get("toUserId")
      if(!toUserId){
        redirect('/?message=invalid-user')
      }

      const numberedToUserId = Number(toUserId)
      
      const userAmount = formData.get("amount")
      if(!userAmount){
        redirect('/?message=invalid-amount');
      }
      if(!balanceCheck){
        redirect('/?message=balance-not-found');
      }
      const numberedUserAmount = Number(userAmount)


      if(Number.isNaN(numberedUserAmount))
       redirect('/?message=invalid-amount');

      if(numberedUserAmount <= 0 )
        redirect('/?message=invalid-amount');

      if(numberedUserAmount > balanceCheck.amount){
        redirect('/?message=insufficient-balance');
      }

      

       const transferedMoney = await transferMoney(userId,numberedToUserId,numberedUserAmount)
       if(transferedMoney !== "success"){
        redirect(`/?message=${transferedMoney}`)
       }
  
         revalidatePath("/")
         redirect('/?message=success')
       
      }

      async function selfTopup(formData: FormData){
        "use server"

        const amountToTopup = formData.get("amount");
        if(!amountToTopup){
          redirect('/?message=invalid-topup-amount')
        }

        const numberedTopup = Number(amountToTopup)

        if(Number.isNaN(numberedTopup)){
          redirect('/?message=invalid-amount')
        }

        if(numberedTopup <= 0){
          redirect('/?message=invalid-amount')
        }
        
        try{
          await db.$transaction(async(topup: Prisma.TransactionClient) => {

            await topup.balance.update({
              where:{userId: userId},
              data:{amount: {increment:numberedTopup}}
            })
          })
        }catch{
          redirect('/?message=topup-failed')
        }
        redirect('/?message=topup-success')
      }


    const userCount = await db.user.count();
    const userBalance = await db.balance.findUnique({
      where:{
        userId:currentUserId
      }
    })

    const historyBalance = await db.p2PTransfer.findMany({
      where:{
        OR:[
          {fromUserId:currentUserId},
          {toUserId:currentUserId}
        ]
      },
      orderBy:{
        timeStamp: "desc"
      }
    })

    type HistoryItem = (typeof historyBalance)[number];


    let filteredHistoryBalance = historyBalance

    if(selectedFilter === "sent"){
      filteredHistoryBalance = historyBalance.filter((transfer: HistoryItem) => {
        return transfer.fromUserId === currentUserId
      })
    }
     

    if(selectedFilter === "received"){
      filteredHistoryBalance = historyBalance.filter((transfer: HistoryItem) => {
        return transfer.toUserId === currentUserId
      })
    }

    async function filterTrx(formData:FormData){
      "use server"

      const alltrx = formData.get("filter")
      const stringalltrx = String(alltrx)

      
      if(stringalltrx === "all"){
        redirect('/?filter=all')
      }

      if(stringalltrx === "sent"){
        redirect('/?filter=sent')
      }
     
     if(stringalltrx === "received"){
      redirect('/?filter=received')
     }


    }


    const otherUsers = await db.user.findMany({
     where:{
      id:{
        not : currentUserId
      }
     },
     orderBy:{id : "asc"}
    })

    type OtherUser = (typeof otherUsers)[number];


    const userData = await db.user.findUnique({
      where:{
        id: userId
      }
    })


    const displayMessage = await getDisplayMessage({searchParams})
    

    return (
      <div className="min-h-screen bg-slate-950 text-white px-4 py-8 max-w-5xl mx-auto space-y-6">
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
          {displayMessage &&  <p>{displayMessage}</p>}
          <form 
          action={deleteCookie}> <button className="bg-blue-700 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded"
          type="submit">Logout</button></form>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
           <h1 className="text-3xl font-bold">Paytm</h1>
           <h3 className="text-slate-300">Total users: {userCount}</h3>
        </div>
        
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
          <h3 className="text-lg font-semibold">Profile</h3>
          <p> UserName: {userData?.name || "No name"}</p>
          <p>Phone Number: {userData?.phone}</p>
        </div>
        
           <div className="rounded-xl border border-slate-800 bg-slate-900 p-5 mt-3 space-y-3">
            <h3 className="text-lg font-semibold">Balance & Top-Up</h3>
            <p>User Balance of User {currentUserId}: {userBalance?.amount}</p>
            <form 
            className="mt-3 flex gap-3"
            action={selfTopup}>
            <input className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-white placeholder:text-slate-400 outline-none focus:border-blue-500"
            type="number" name="amount" placeholder="Enter Amount"></input>
            <button className="bg-blue-700 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded"
            type="submit">Top-Up</button>
            </form>
           </div>
        
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
           <p className="text-lg font-semibold"> Transaction History</p>
           <form 
            action={filterTrx}
            style={{display: "flex", gap: "10px"}}>
              <div className="space-x-2">
                <button className="bg-blue-700 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded"
                 type="submit" name="filter" value={"all"}>All Trx</button>
                <button className="bg-blue-700 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded"
                type="submit" name="filter" value={"sent"}>Sent Trx</button>
                <button className="bg-blue-700 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded"
                type="submit" name="filter" value={"received"}>Received Trx</button>
              </div>
           </form>
           <div className="rounded-xl border border-slate-800 bg-slate-900 p-5 space-y-4">
               {filteredHistoryBalance.map((transfer: HistoryItem) =>(
               <div 
                key = {transfer.id}> 
               {
                transfer.fromUserId === currentUserId
               ? <div className="rounded-xl border border-slate-800 bg-slate-700 p-5">
                 <div>Sent</div>
                 <div> {`Amount: ${transfer.amount}`}</div>  
                 <div>{`To User: ${transfer.toUserId}`}</div>
                 <div>{` Time: ${transfer.timeStamp.toString()}`}</div>
               </div>
              :  <div className="rounded-xl border border-slate-800 bg-slate-700 p-5">
                  <div> Received  </div> 
                  <div> {`Amount: ${transfer.amount}`}</div> 
                  <div> {`from User: ${transfer.fromUserId}`} </div>
                  <div>{`Time: ${transfer.timeStamp.toString()}`} </div>
              </div>
               }                
              </div>
              ))}
             </div> 
         </div>
        
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-5 space-y-2 mt-3 space-y-3">
          <p className="text-lg font-semibold">Send Money</p>
        <div>
         {otherUsers.map((user: OtherUser) =>(
          <div 
          className="rounded-xl border border-slate-800 bg-slate-700 p-5"
          key = {user.id}>
            {user.id} | {user.name} | {user.phone} 
            <form 
            className="mt-3 flex gap-3"
            action={sendMoney}>
              <input type="hidden" name="toUserId" value={user.id}></input>
              <input 
              className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-white placeholder:text-slate-400 outline-none focus:border-blue-500"
              type="number" name="amount" min={"1"} placeholder="Enter Amount..." ></input>
              <button className="bg-blue-700 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded" >Send Money!</button>
            </form>
          </div>
         ))}
       </div>   
        </div>
   
      </div>
    );
  }