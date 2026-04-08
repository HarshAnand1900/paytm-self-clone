import { cookies } from "next/headers";

export default async function getCurrentUserId(){

    const cookiesStore = await cookies();
    const userCookies = cookiesStore.get('userId')

    if(!userCookies){
        return null;
    }

    const userId = Number(userCookies.value)

    if(Number.isNaN(userId)){
        return null;
    }

    return userId;
}