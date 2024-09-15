const { Member, Book, Borrowing, sequelize } = require("../models");

module.exports = {
    Index: async () => {
        await Member.destroy({truncate: true, restartIdentity: true});
        await Book.destroy({truncate: true, restartIdentity: true});
        await Borrowing.destroy({truncate: true, restartIdentity: true});
    }
};