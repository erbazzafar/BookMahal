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


interface Book {
  _id: string;
  book_Title: string;
  book_Genre: string;
  book_Author: string;
  book_Image: string;
  book_Link: string;
}

export default function DialogDemo() {

  const { data: session } = useSession()
  const router = useRouter()
  const [userBooks, setUserBooks] = useState([])
  console.log("session:", session);

  const userId = session?.user?._id


  useEffect(() => {
    if (!session) {
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
    const { image, title, genre, author, link } = book

    try {
      if (!image || !title || !genre || !author || !link) {
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
          userId: userId
        })
      })
      console.log("Response while submitting the book: ", response);
      if (response.ok) {
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
      else {
        toast.error("Unable to add the Book right now")
      }

    } catch (error) {
      console.log("Error in adding book: ", error);
    }
  }

  useEffect(() => {
    const fetUserBooks = async () => {
      try {
        if (!userId) {
          console.log("User ID is not available");
          return
        }
        const response = await fetch(`/api/book?id=${userId}`, {
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
    <div className="bg-slate-950 min-h-screen">
      <div className="mt-30 max-w-7xl mx-auto flex items-center justify-between bg-slate-900 py-4 px-6 shadow-md rounded-md">
        <div>
          <h1 className="text-2xl text-white font-bold">{session.user?.firstname}</h1>
          <p className="text-gray-400">{session.user?.email}</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <button className="bg-gray-700 text-white px-4 py-2 rounded-md m-15 cursor-pointer">Add Book</button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-[425px] bg-black">
            <form onSubmit={handleSubmit}>
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
                  type="submit"
                  className="bg-gray-500 text-gray-200 rounded-lg text-md px-4 py-2 cursor-pointer border-white shadow-lg"
                >
                  Add Book
                </button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="mt-15 bg-slate-950 min-h-screen px-8 py-12 gap-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-5 gap-x-9 gap-y-2">
            <h1 className="text-3xl font-bold text-white text-center mb-4 col-span-full">
              Your Books
            </h1>
            {userBooks.length === 0 ? (
              <p className="text-white text-center w-full">Loading books...</p>
            ) : (
              userBooks.map((book: Book) => (
                <div key={book._id} className="flex justify-center">
                  <div className="relative rounded-[22px] p-[2px] bg-gradient-to-r from-purple-500 via-blue-500 to-green-500">
                    {/* Card Content */}
                    <div className="rounded-[20px] bg-black p-6 text-white max-w-[320px] sm:max-w-[380px]">
                      {/* Product Image */}
                      <div className="flex justify-center">
                        <Image
                          src={book.book_Image}
                          alt={book.book_Title}
                          height={250}
                          width={250}
                          className="w-[250px] h-[250px] object-cover rounded-lg"
                        />
                      </div>
      
                      {/* Title */}
                      <p className="text-xl font-bold mt-4 ">
                        {book.book_Title}
                      </p>
      
                      {/* Author */}
                      <p className="text-md font-semibold text-gray-200 mt-2 ">
                        Author: <span className="text-gray-500 ">{book.book_Author}</span>
                      </p>
      
                      
                      {/* Genre */}
                      <p className="text-md font-semibold text-gray-200 mt-2 ">
                         Genre: <span className="text-gray-500">{book.book_Genre}</span>
                      </p>
      
                      {/* Buy Now Button */}
                      <div className="flex justify-center mt-4">
                        <a
                          href={book.book_Link}
                          target="_blank"
                          className="bg-gray-600 px-6 py-2 rounded-full text-white font-semibold inline-block"
                        >
                          Read More
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
    </div>
  ) : (
    <p className="text-center mt-20 text-xl text-red-600"> You must be logged in to add the Book </p>
  )

}


