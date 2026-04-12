import { buttonClassName,itemCardClassName } from "./style";
type HistoryItem ={
    id: number;
    fromUserId: number;
    toUserId: number;
    amount: number;
    timeStamp: Date;
}

type HistorySectionProps = {
    filterTrx: (formData: FormData) => Promise<void>;
    currentUserId: number;
    filteredHistoryBalance: HistoryItem[];
}

export default function HistorySection({filterTrx,currentUserId,filteredHistoryBalance}:HistorySectionProps){
return(
     <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
           <p className="text-lg font-semibold"> Transaction History</p>
           <form 
            action={filterTrx}
            className="flex flex-wrap gap-2">
              <div className="space-x-2">
                <button className={buttonClassName}
                 type="submit" name="filter" value={"all"}>All Trx</button>
                <button className={buttonClassName}
                type="submit" name="filter" value={"sent"}>Sent Trx</button>
                <button className={buttonClassName}
                type="submit" name="filter" value={"received"}>Received Trx</button>
              </div>
           </form>
           <div className="rounded-xl border border-slate-800 bg-slate-900 p-5 space-y-4">
               {filteredHistoryBalance.length === 0 ? (
                <div className="rounded-xl border border-slate-800 bg-slate-800 p-4 text-slate-400">
                No transactions found for this filter            
                </div>
               ):(
               filteredHistoryBalance.map((transfer: HistoryItem) =>(
               <div 
                key = {transfer.id}> 
               {transfer.fromUserId === currentUserId ? (
                <div className={itemCardClassName}>
                 <div>Sent</div>
                 <div> {`Amount: ${transfer.amount}`}</div>  
                 <div>{`To User: ${transfer.toUserId}`}</div>
                 <div>{` Time: ${transfer.timeStamp.toString()}`}</div>
               </div>
                ) : (
              <div className={itemCardClassName}>
                  <div> Received  </div> 
                  <div> {`Amount: ${transfer.amount}`}</div> 
                  <div> {`from User: ${transfer.fromUserId}`} </div>
                  <div>{`Time: ${transfer.timeStamp.toString()}`} </div>
              </div>
               )}                
              </div>
              ))
            )}
             </div> 
         </div>
)
}