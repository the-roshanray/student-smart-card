import connectDB from "@/Database/connectDB";
import Library from "@/models/Library";
import { NextResponse } from "next/server";

export async function POST(req) {
  await connectDB();

  try {
    const { rollNumber, bookId, fineAmount } = await req.json();

    const bookRecord = await Library.findOne({ rollNumber });
    if (!bookRecord) {
      return NextResponse.json(
        { success: false, message: "Student record not found" },
        { status: 404 }
      );
    }

    if (!Array.isArray(bookRecord.issueBooks)) {
      return NextResponse.json(
        { success: false, message: "Issued books not found" },
        { status: 404 }
      );
    }

    const issuedBookIndex = bookRecord.issueBooks.findIndex(
      (book) => book.bookId === bookId
    );

    if (issuedBookIndex === -1) {
      return NextResponse.json(
        { success: false, message: "Issued book not found" },
        { status: 404 }
      );
    }

    const [returnedBook] = bookRecord.issueBooks.splice(issuedBookIndex, 1);
    returnedBook.returnDate = new Date();
    returnedBook.fineAmount = fineAmount || 0;

    if (!Array.isArray(bookRecord.returnBooks)) {
      bookRecord.returnBooks = [];
    }
    bookRecord.returnBooks.push(returnedBook);
    bookRecord.returnedBooksCount = (bookRecord.returnedBooksCount || 0) + 1;
    bookRecord.outstandingFine = (bookRecord.outstandingFine || 0) + fineAmount || 0;

    await bookRecord.save();

    return NextResponse.json(
      { success: true, message: "Book returned successfully", bookRecord },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error returning book:", error);
    return NextResponse.json(
      { success: false, message: "Failed to return book", error: error.message },
      { status: 500 }
    );
  }
}
