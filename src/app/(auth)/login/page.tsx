"use client"
import LoginupFormDemo from '@/components/login-form'
import React from 'react'

interface Props {}

function Page(props: Props) {
    const {} = props

    return (
        <div
            className='flex flex-col items-center justify-center h-screen'>
            <LoginupFormDemo/>
        </div>
    )
}

export default Page
