import mongoose, { models, Schema } from "mongoose";

const bookSchema = new Schema ({
    book_Title: {type: String, required: true},
    book_Genre: { type: String, required: true},
    book_Author: { type: String, required: true},
    book_Image: { type:String, required: true},
    book_Link: {type: String, required: true}
},
    {timestamps: true}
)

const Book = models.Book || mongoose.model("Book", bookSchema);
export default Book;