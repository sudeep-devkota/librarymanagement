const Book = require("../models/book"); 
const Borrow = require("../models/book"); // Make sure this model is correct

exports.borrowBook = async (req, res) => {
    try {
        const { books } = req.body; // Array of book IDs

        // Ensure user is authenticated
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: "Unauthorized. Please log in." });
        }
        const userId = req.user.id;

        // Validate request
        if (!books || books.length === 0) {
            return res.status(400).json({ message: "Please select at least one book to borrow." });
        }

        const borrowedBooks = [];

        // Process each book
        for (const bookItem of books) {
            const foundBook = await Book.findById(bookItem.book_id);

            if (!foundBook) {
                return res.status(404).json({ message: `Book with ID ${bookItem.book_id} not found.` });
            }

            if (foundBook.copies_available === 0) {
                return res.status(400).json({ message: `Book "${foundBook.title}" is currently unavailable.` });
            }

            // Update book availability
            foundBook.copies_available--;
            foundBook.copies_issued++;
            await foundBook.save();

            borrowedBooks.push(foundBook);

            // Create borrow record
            const borrowDate = new Date();
            const returnDate = new Date();
            returnDate.setDate(borrowDate.getDate() + 7); // Set return date 7 days from now

            const newBorrow = new Borrow({
                user_id: userId,
                book_id: bookItem.book_id,
                borrow_date: borrowDate,
                return_date: returnDate,
                is_returned: false
            });

            await newBorrow.save();
        }

        res.status(200).json({
            message: "Books borrowed successfully!",
            books: borrowedBooks
        });

    } catch (error) {
        res.status(500).json({ message: "Server error: " + error.message });
    }
};