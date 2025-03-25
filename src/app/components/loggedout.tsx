import { signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import React from 'react'

function Loggedout() {
    const router = useRouter()
    
    const handleLogOut = async () => {
        await signOut({
            redirect: false,
        })
        router.replace("/login")
    }

    return (
        <>
            <button
                onClick={handleLogOut}>
                    Logout
            </button>            
        </>
    )
}

export default Loggedout