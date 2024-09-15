const { Book } = require('../models');
const { Op } = require('sequelize');
module.exports = {
    // Menampilkan semua buku yang tersedia (stock > 0)
    index: async (req, res, next) => {
        try {
            const books = await Book.findAll({
                where: { stock: { [Op.gt]: 0 }} // Hanya menampilkan buku yang tersedia
            });

            return res.status(200).json({
                status: true,
                message: 'List of available books',
                data: books
            });
        } catch (error) {
            next(error);
        }
    },
    
    // Menampilkan detail buku berdasarkan kode buku
    show: async (req, res, next) => {
        try {
            const { code } = req.params;

            const book = await Book.findOne({
                where: { code }
            });

            if (!book) {
                return res.status(404).json({
                    status: false,
                    message: `Book with code ${code} not found!`,
                    data: null
                });
            }

            return res.status(200).json({
                status: true,
                message: 'Book details',
                data: book
            });
        } catch (error) {
            next(error);
        }
    }
};
