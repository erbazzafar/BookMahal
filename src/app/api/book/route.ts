import dbConnect from "@/lib/dbConnect";
import Book from "@/models/book.model";
import { NextResponse } from "next/server";

//POST API
export async function POST(req: Request) {
    try {
        await dbConnect()
        const {book_Title, book_Author,book_Genre, book_Image, book_Link} = await req.json()

        //create new book
        const newBook = new Book({
            book_Title,
            book_Author,
            book_Genre,
            book_Image,
            book_Link
        });

        await newBook.save()
        console.log("new book saved in db with title: ", book_Title);
        return NextResponse.json({
            message: "Book saved Succesfully"},
            {status: 200}
        )

    } catch (error) {
        console.log("Error in book POST: ", error);        
        return NextResponse.json(
            { error: "Something went wrong. Please try again." },
            { status: 500 }
          );
    }
}

//GET API
export async function GET(){
   try {
    await dbConnect()
    const books =await Book.find({})
    return NextResponse.json(books, {status: 200})
   } catch (error) {
    console.log("error fetching the books: ", error);
    return NextResponse.json({error: "Book not Fetched"}, {status: 500})
   }
}