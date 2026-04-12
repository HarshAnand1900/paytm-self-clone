import { buttonClassName,inputClassName,itemCardClassName } from "./style";
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
          {otherUsers.length === 0 ? (
            <div className="rounded-xl border border-slate-800 bg-slate-800 p-4 text-slate-400"
            >No other users available right now.</div>
          ):(otherUsers.map((user: OtherUser) =>(
          <div 
          className={itemCardClassName}
          key = {user.id}>
            {user.id} | {user.name} | {user.phone} 
            <form 
            className="mt-3 flex gap-3"
            action={sendMoney}>
              <input type="hidden" name="toUserId" value={user.id}></input>
              <input 
              className={inputClassName}
              type="number" name="amount" min={"1"} placeholder="Enter Amount..." ></input>
              <button className={buttonClassName}>Send Money!</button>
            </form>
          </div>
         ))
          )}
         
         </div>   
        </div>
    )
}