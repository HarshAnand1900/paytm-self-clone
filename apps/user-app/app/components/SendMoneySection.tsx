type OtherUser = {
    id: number;
    name: string;
    phone: string;
}

type SendMoneyProps = {
  sendMoney: (formData: FormData) => Promise<void>
  otherUsers: OtherUser[]
}

export default function SendMoneySection({sendMoney,otherUsers}:SendMoneyProps){
    return(
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
    )
}