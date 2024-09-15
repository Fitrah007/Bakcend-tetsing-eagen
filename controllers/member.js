const { Member, Borrowing, Book } = require('../models');
module.exports = {
    // Menampilkan semua member beserta jumlah buku yang sedang dipinjam
    index: async (req, res, next) => {
        try {
            // Fetch all members and their borrowed books
            const members = await Member.findAll({
                include: [
                {
                    model: Borrowing,
                    as: 'borrowings',
                    include: [
                    {
                        model: Book,
                        as: 'book' // Menggunakan alias sesuai dengan asosiasi
                    }
                    ]
                }
                ]
            });
        
            // Format the response
            const memberData = members.map(member => ({
                code: member.code,
                name: member.name,
                booksBorrowed: member.borrowings.map(borrowing => ({
                title: borrowing.book.title,
                author: borrowing.book.author,
                borrowDate: borrowing.borrowDate,
                returnDate: borrowing.returnDate
                }))
            }));
        
            return res.status(200).json({
                status: true,
                message: 'List of members and their borrowed books',
                data: memberData
            });
        } catch (error) {
         next(error);
        }
    },
    
    // Member meminjam buku dengan syarat-syarat yang telah ditentukan
    borrowBook: async (req, res, next) => {
        try {
            const { member_code, book_code } = req.body;
        
            const member = await Member.findOne({
                where: { code: member_code }
            });
        
            if (!member) {
                return res.status(404).json({
                status: false,
                message: `Member with code ${member_code} not found!`,
                data: null
                });
            }
        
            // Periksa apakah member dalam periode penalti
            if (member.penalty_end_date && new Date() < new Date(member.penalty_end_date)) {
                return res.status(400).json({
                status: false,
                message: 'Member is currently penalized and cannot borrow books!',
                data: null
                });
            }
        
            const borrowedBooksCount = await Borrowing.count({
                where: { memberId: member.id, returnedAt: null }
              });
              if (borrowedBooksCount >= 2) {
                return res.status(403).json({
                  status: false,
                  message: 'Member cannot borrow more than 2 books.',
                  data: null
                });
              }
        
            const book = await Book.findOne({
                where: { code: book_code }
            });
        
            if (!book || book.stock < 1) {
                return res.status(400).json({
                status: false,
                message: 'Book not available for borrowing!',
                data: null
                });
            }
        
            const dueDate = new Date();
            dueDate.setDate(dueDate.getDate() + 7);

            // Create borrowing record
            const borrowing = await Borrowing.create({
            memberId: member.id,
            bookId: book.id,
            borrowDate: new Date(),
            dueDate: dueDate
            });
        
            await book.update({ stock: 0 });
        
            return res.status(201).json({
                status: true,
                message: 'Book borrowed successfully!',
                data: borrowing
            });
        } catch (err) {
            console.error(err);
            return res.status(500).json({
                status: false,
                message: 'An unexpected error occurred',
                data: null
            });
        }
    },

    // Member mengembalikan buku dengan memeriksa penalti
    returnBook: async (req, res, next) => {
        try {
            const { member_code, book_code } = req.body;
        
            const member = await Member.findOne({
                where: { code: member_code }
            });
            const book = await Book.findOne({
                where: { code: book_code }
            });
        
            if (!member) {
                return res.status(404).json({
                status: false,
                message: `Member with code ${member_code} not found!`,
                data: null
                });
            }
        
            const borrow = await Borrowing.findOne({
                where: { memberId: member.id, bookId: book.id, returnedAt: null },
                include: [
                    {
                        model: Book,
                        as: 'book' // Menggunakan alias sesuai dengan asosiasi
                    }
                    ]
            });
        
            if (!borrow) {
                return res.status(400).json({
                status: false,
                message: 'This book was not borrowed by the member!',
                data: null
                });
            }
        
            const returnDate = new Date();
            await borrow.update({ returnDate });
        
            const borrowDate = new Date(borrow.borrowDate);
            const daysBorrowed = Math.floor((returnDate - borrowDate) / (1000 * 60 * 60 * 24));
        
            if (daysBorrowed > 7) {
                // Member terkena penalti
                await member.update({
                penalized: true,
                penalty_end_date: new Date(new Date().getTime() + (3 * 24 * 60 * 60 * 1000)) // Penalti 3 hari
                });
            }
        
            await Book.update({ stock: 1 },{where:{id:borrow.bookId}});
            
            await borrow.destroy({where:{id:borrow.id}});

            return res.status(200).json({
                status: true,
                message: 'Book returned successfully!',
                data: null
            });
        } catch (error) {
          next(error);
        }
    }
};
