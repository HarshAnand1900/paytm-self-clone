
export default async function getDisplayMessage({
    searchParams,
  }:{
    searchParams?: Promise<{message?: string}>
  }){

    const resolvedSearchParams = await searchParams
  const message = resolvedSearchParams?.message


  if(message === "invalid-user"){
   return  "Invalid USER!!!"
  }

  if(message === "invalid-amount"){
   return "Not A Valid Amount!!!"
  }

  if(message === "balance-not-found"){
  return   "BALANCE NOT FOUND!!!"
  }

  if(message === "insufficient-balance"){
  return   "Insufficient Balance!!!"
  }

  if(message === "success"){
  return   "SUCCESS"
  }
  
  if(message === "missing-info"){
   return  "Missing INFO!!!"
  }

  if(message === "user-already-exists"){
  return   "USER ALREADY EXISTS!!!"
  }

   if(message === "user-not-found"){
   return  "User Not Found!!!"
  }

  if(message === "wrong-password"){
  return  "Wrong PASSWORD!!!"
  }

  if(message === "reciever-not-found"){
  return  "RECIEVER NOT FOUND!!!"
  }
  
  if(message === "self-transfer-not-allowed"){
  return  "SELF-TRANSFER NOT ALLOWED"
  }

  if(message === "transfer-failed"){
  return  "TRANSFER FAILED!!!"
  }

  if(message === "topup-success"){
    return "TOPUP BALANCE ADDED"
  }

  if(message ==="topup-failed")
    return "TOPUP FAILED"
}