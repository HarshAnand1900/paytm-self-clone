import {Prisma} from "@prisma/client"
import { db } from "app/lib/db";




  export default async function transferMoney(fromUserId: number,toUserId: number,amount: number){
    const senderBalance =  await db.balance.findUnique({
        where:{
            userId:fromUserId
        }
    })
    
    const receiverBalance = await db.balance.findUnique({
        where:{
            userId:toUserId
        }
    })

    if(!receiverBalance){
        return("receiver-not-found")
    }

    if(!senderBalance ){
        return("balance-not-found")
    }

    if(senderBalance.amount < amount){
        return("insufficient-balance")
    }

    if(senderBalance.userId === receiverBalance.userId){
        return(("self-transfer-not-allowed"))
    }


  try{
    await db.$transaction(async(trx: Prisma.TransactionClient) => {

          await trx.balance.update({
            where:{userId: fromUserId},
            data:{amount: {decrement:amount}}
        })

        await trx.balance.update({
            where:{userId: toUserId},
            data:{amount: {increment:amount}}
        })

        await trx.p2PTransfer.create({
            data:{
                fromUserId:fromUserId,
                toUserId:toUserId,
                amount:amount
            }
        })
    })

     return "success";
  }catch(e){
    return "transfer-failed"
  }

    
  }