"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";

export default function GradientCard() {

  const [books, setBooks] = useState([])
  
interface Book {
  _id: string;
  book_Title: string;
  book_Genre: string;
  book_Author: string;
  book_Image: string;
  book_Link: string;
}

useEffect ( () => {
  const fetchBooks = async () => {
    try {
      const response = await fetch ("/api/book")
      console.log("Response Status: ", response.status);
      console.log();
      
      if (!response.ok){
        console.log("RESPONSE in fetching the books is not OK !!");
      }
      const bookData = await response.json()
      setBooks(bookData)
      
      
    } catch (error) {
      console.log("Error in Fetching the Books => error: ", error);
    }
    
  }
  console.log("log before fetchBooks");
  
  fetchBooks()
}, [])
  return (
    <div className="bg-slate-950 min-h-screen px-8 py-12 gap-y-3">
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-5 gap-x-9 gap-y-2">
      {books.length === 0 ? (
        <p className="text-white text-center w-full">Loading books...</p>
      ) : (
        books.map((book: Book) => (
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
  );
}
