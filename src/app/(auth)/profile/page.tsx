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
import { useState } from "react"

export default function DialogDemo() {

  const [book, setBook] = useState({
    title: "",
    author: "",
    image: "",
    genre: "",
    link: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBook(prevBook => ({
      ...prevBook,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    const {image, title, genre, author, link} = book
    
    try {
        if(!image || !title || !genre || !author || !link){
          alert("Please fill in all the fields")
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
            book_Link: link})
        })
        console.log("Response while submitting the book: ",response);
        if (response.ok){
          alert("Book added Successfully")
          setBook({
            title: "",
            author: "",
            image: "",
            genre: "",
            link: ""
          })
        }
        else{
          alert("book not added")
        }

    } catch (error) {
       console.log("Error in adding book: ",error);
    }
}

  return (
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
  );
}
