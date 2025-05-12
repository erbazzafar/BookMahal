import dbConnect from "@/lib/dbConnect";
import Book from "@/models/book.model";
import { NextResponse, NextRequest } from "next/server";

//POST API
export async function POST(req: Request) {
    try {
        await dbConnect()
        const {book_Title, book_Author,book_Genre, book_Image, book_Link, userId} = await req.json()

        //create new book
        const newBook = new Book({
            book_Title,
            book_Author,
            book_Genre,
            book_Image,
            book_Link,
            userId
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
export async function GET(req: NextRequest) {
  try {
    await dbConnect()
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (id) {
      const book = await Book.findById(id)
      if (!book) {
        return NextResponse.json({ error: 'Book not found' }, { status: 404 })
      }
      return NextResponse.json(book, { status: 200 })
    } else {
      const books = await Book.find({})
      return NextResponse.json(books, { status: 200 })
    }
  } catch (error) {
    console.error('Error fetching books:', error)
    return NextResponse.json({ error: 'Book(s) not fetched' }, { status: 500 })
  }
}