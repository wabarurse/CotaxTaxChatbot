"use client"
import React from 'react'
import { useState } from 'react'

export default function fileUpload() {
    const [file, setFile] = useState<File | null>(null)

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        console.log(file)
    }

    return (
        <main>
            <form
                onSubmit={handleSubmit}
            >
                <input
                    type="file"
                    name="file"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                />
                <input type="submit" value="Upload" />

            </form>
        </main>
    )
}
