import { buttonClassName,inputClassName } from "./style";
type BalanceSectionProps = {
    currentUserId: number;
    amount?: number;
    selfTopup: (formData:FormData) => Promise<void>
}

export default function BalanceSection({currentUserId,amount,selfTopup}:BalanceSectionProps){
 return(
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-5 mt-3 space-y-3">
            <h3 className="text-lg font-semibold">Balance & Top-Up</h3>
            <p>User Balance of User {currentUserId}: {amount}</p>
            <form 
            className="mt-3 flex flex-col gap-3 sm:flex-row"
            action={selfTopup}>
            <input className={`${inputClassName} w-full sm:w-auto`}
            type="number" name="amount" placeholder="Enter Amount"></input>
            <button className= {`${buttonClassName} w-full sm:w-auto`}
            type="submit">Top-Up</button>
            </form>
           </div>
 )
}