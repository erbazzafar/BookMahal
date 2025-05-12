"use client"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import Image from "next/image"

export default function DialogDemo() {

  const {data: session} = useSession()
  const router = useRouter()
  const [userBooks, setUserBooks] = useState([])
  console.log("session:", session);

  const userId = session?.user?._id
  

  useEffect(()=>{
    if (!session){
      console.log("No session Found !!!");
      router.push("/login")
    }
  }, [session, router])

  const [book, setBook] = useState({
    title: "",
    author: "",
    image: "",
    genre: "",
    link: "",
    userId: userId
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBook(prevBook => ({
      ...prevBook,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault()
    const {image, title, genre, author, link} = book
    
    try {
        if(!image || !title || !genre || !author || !link){
          alert("Please fill all the fields")
          toast.error("Please fill all the fields")
          return
        }
        const response = await fetch("/api/book", {
          method: "POST",
          headers: {
            "content-type": "application/json"
          },
          body: JSON.stringify({
            book_Title: title,
            book_Author: author,
            book_Genre: genre,
            book_Image: image,
            book_Link: link,
            userId: userId})
        })
        console.log("Response while submitting the book: ",response);
        if (response.ok){
          toast.success("Book added successfully")
          setBook({
            title: "",
            author: "",
            image: "",
            genre: "",
            link: "",
            userId: userId,
          })
        }
        else{
          toast.error("Unable to add the Book right now")
        }

    } catch (error) {
       console.log("Error in adding book: ",error);
    }
}

useEffect( () => {
 const fetUserBooks = async () => {
  try {
    if (!userId) {
      console.log("User ID is not available");
      return
    }
    const response = await fetch (`/api/book?id=${userId}`, {
      method: "GET"
    })

    if (!response.ok) {
      toast.error("Unable to fetch user books")
      return
    }

    console.log("Response in fetching user books: ", response)
    setUserBooks(await response.json())
    
  } catch (error) {
    console.log("Error in fetching user books: ", error);
    toast.error("Error in fetching user books")
    return
  }
 }
 fetUserBooks()
}, [userId])


  return session ? (
    <>
     <div className="mt-30 max-w-7xl mx-auto flex items-center justify-between bg-gray-100 py-4 px-6 shadow-md rounded-md">
        <div>
          <h1 className="text-2xl font-bold">{session.user?.firstname}</h1>
          <p className="text-gray-600">{session.user?.email}</p>
        </div>
    <Dialog>
      <DialogTrigger asChild>
        <button className="bg-gray-700 text-white px-4 py-2 rounded-md m-15 cursor-pointer ">Add Book</button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-black">
        <DialogHeader>
          <DialogTitle className="text-white">Add Book</DialogTitle>
          <DialogDescription>
            Add a book to our <span className="font-bold">BOOK MAHAL</span> where other users can get benefits from your suggested book.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3 w-full">
          {["title", "author", "genre", "image", "link"].map((field, index) => (
            <div key={index} className="w-full">
              <Label htmlFor={field} className="text-gray-200 block mb-1 font-medium">
                {`Book ${field.charAt(0).toUpperCase() + field.slice(1)}`}
              </Label>
              <Input
                id={field}
                name={field}
                placeholder={`Enter book ${field}`}
                className="w-full max-w-full bg-gray-200 py-2 rounded"
                value={book[field as keyof typeof book]}
                onChange={handleChange}
              />
            </div>
          ))}
        </div>
        
        <DialogFooter>
          <button
            onClick={handleSubmit}
            type="submit"
            className="bg-gray-500 text-gray-200 rounded-lg text-md px-4 py-2 cursor-pointer border-white shadow-lg"
          >
            Add Book
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    </div>

    <div>
      <h1 className="text-2xl font-bold text-center mt-10">Your Books</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-5">
        {userBooks.map((book: any) => (
          <div key={book._id} className="bg-white shadow-md rounded-lg p-4">
            <Image 
              src={book.book_Image} 
              alt={book.book_Title}
              width={50}
              height={48}
              className="w-full h-48 object-cover rounded-md mb-4" />
            <h2 className="text-lg font-semibold">{book.book_Title}</h2>
            <p className="text-gray-600">{book.book_Author}</p>
            <p className="text-gray-600">{book.book_Genre}</p>
          </div>
        ))}
      </div>
    </div>
    </>
  ) : (
    <p className="text-center mt-20 text-xl text-red-600"> You must be logged in to add the Book </p>
  )
  
}


