type BalanceSectionProps = {
    currentUserId: number | null;
    amount?: number;
    selfTopup: (formData:FormData) => Promise<void>
}

export default function BalanceSection({currentUserId,amount,selfTopup}:BalanceSectionProps){
 return(
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-5 mt-3 space-y-3">
            <h3 className="text-lg font-semibold">Balance & Top-Up</h3>
            <p>User Balance of User {currentUserId}: {amount}</p>
            <form 
            className="mt-3 flex gap-3"
            action={selfTopup}>
            <input className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-white placeholder:text-slate-400 outline-none focus:border-blue-500"
            type="number" name="amount" placeholder="Enter Amount"></input>
            <button className="bg-blue-700 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded"
            type="submit">Top-Up</button>
            </form>
           </div>
 )
}