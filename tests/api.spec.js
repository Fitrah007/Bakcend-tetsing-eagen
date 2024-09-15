const request = require("supertest");
const app = require("../app.js");
const {Member, Book, Borrowing} = require("../models")
const truncate = require('../utils/truncate');

beforeAll(async () => {
    await truncate.Index()
});
describe("/books GET", () => {
    test("success", async () => {
        try {
            const books = await Book.bulkCreate([
                {
                    code: 'JK-45',
                    title: 'Sample Book',
                    author: 'Sample Author',
                    stock: 1,
                    available: true,
                    createdAt: new Date(),
                    updatedAt: new Date()
                },
                {
                    code: "SHR-1",
                    title: "A Study in Scarlet",
                    author: "Arthur Conan Doyle",
                    stock: 1,
                    createdAt: new Date(),
                    updatedAt: new Date()
                },
                {
                    code: "TW-11",
                    title: "Twilight",
                    author: "Stephenie Meyer",
                    stock: 1,
                    createdAt: new Date(),
                    updatedAt: new Date()
                },
                {
                    code: "HOB-83",
                    title: "The Hobbit, or There and Back Again",
                    author: "J.R.R. Tolkien",
                    stock: 1,
                    createdAt: new Date(),
                    updatedAt: new Date()
                },
                {
                    code: "NRN-7",
                    title: "The Lion, the Witch and the Wardrobe",
                    author: "C.S. Lewis",
                    stock: 1,
                    createdAt: new Date(),
                    updatedAt: new Date()
                }
            ]);
        
            const res = await request(app).get("/api/books");        
            expect(res.statusCode).toBe(200); 
            expect(res.body).toHaveProperty("status");
            expect(res.body).toHaveProperty("message");
            expect(res.body).toHaveProperty("data");
            expect(Array.isArray(res.body.data)).toBe(true);
            expect(res.body.data.length).toBeGreaterThan(0);
            res.body.data.forEach(book => {
            expect(book).toHaveProperty("id");
            expect(book).toHaveProperty("code");
            expect(book).toHaveProperty("title");
            expect(book).toHaveProperty("author");
            expect(book).toHaveProperty("stock");
            }); 
            expect(res.body.status).toBe(true);
            expect(res.body.message).toBe("List of available books");
        } catch (err) {
            expect(err).toBe("error");
        }
    });
});

describe("/books/:code GET", () => {
    test("success", async () => {
        try {
            const code = 'JK-45';
            const res = await request(app).get(`/api/books/${code}`);    
            expect(res.statusCode).toBe(200); 
            expect(res.body).toHaveProperty("status");
            expect(res.body).toHaveProperty("message");
            expect(res.body).toHaveProperty("data");
            expect(res.body.data).toHaveProperty("id");
            expect(res.body.data).toHaveProperty("code");
            expect(res.body.data).toHaveProperty("title");
            expect(res.body.data).toHaveProperty("author");
            expect(res.body.data).toHaveProperty("stock");
            expect(res.body.data).toHaveProperty("createdAt");
            expect(res.body.data).toHaveProperty("updatedAt");
            expect(res.body.status).toBe(true);
            expect(res.body.message).toBe("Book details");
        } catch (err) {
            expect(err).toBe("error");
        }
    });
    test("Not Found", async () => {
        try {
            const code = 1234;
            const res = await request(app).get(`/api/books/${code}`);    
            expect(res.statusCode).toBe(404); 
            expect(res.body).toHaveProperty("status");
            expect(res.body).toHaveProperty("message");
            expect(res.body).toHaveProperty("data");
            expect(res.body.status).toBe(false);
            expect(res.body.message).toBe(`Book with code ${code} not found!`);
            expect(res.body.data).toBe(null);
        } catch (err) {
            expect(err).toBe("error");
        }
    });
});
  
describe("/members GET", () => {
    test("success", async () => {
        try {
            const member = await Member.create({
                code: "M001",
                name: "Angga",
                createdAt: new Date(),
                updatedAt: new Date()
              });
            const res = await request(app).get("/api/members");        
            expect(res.statusCode).toBe(200); 
            expect(res.body).toHaveProperty("status");
            expect(res.body).toHaveProperty("message");
            expect(res.body).toHaveProperty("data");
            expect(Array.isArray(res.body.data)).toBe(true);
            expect(res.body.data.length).toBeGreaterThan(0);
            res.body.data.forEach(member => {
            expect(member).toHaveProperty("code");
            expect(member).toHaveProperty("name");
            expect(member).toHaveProperty("booksBorrowed");
            });
            expect(res.body.status).toBe(true);
            expect(res.body.message).toBe("List of members and their borrowed books");
        } catch (err) {
            expect(err).toBe("error");
        }
    });
});

describe("/members/borrow POST", () => {
    test("success", async () => {
        try {
            const res = await request(app).post("/api/members/borrow")
            .send({member_code:"M001",book_code:"JK-45"});        
            expect(res.statusCode).toBe(201); 
            expect(res.body).toHaveProperty("status");
            expect(res.body).toHaveProperty("message");
            expect(res.body).toHaveProperty("data");
            expect(res.body.data).toHaveProperty("borrowedAt");  
            expect(res.body.data).toHaveProperty("id");  
            expect(res.body.data).toHaveProperty("memberId");  
            expect(res.body.data).toHaveProperty("bookId");  
            expect(res.body.data).toHaveProperty("dueDate");  
            expect(res.body.data).toHaveProperty("updatedAt");  
            expect(res.body.data).toHaveProperty("createdAt");  
            expect(res.body.data).toHaveProperty("returnedAt");  
            expect(res.body.status).toBe(true);
            expect(res.body.message).toBe("Book borrowed successfully!");
        } catch (err) {
            expect(err).toBe("error");
        }
    });
    test("Member Not Found", async () => {
        const code = '1234';
        const bookCode = 'JK-45'; 
        
        try {
            const res = await request(app).post('/api/members/borrow')
            .send({ member_code: code, book_code: bookCode });
            expect(res.statusCode).toBe(404);
            expect(res.body).toHaveProperty('status');
            expect(res.body).toHaveProperty('message');
            expect(res.body).toHaveProperty('data');
            expect(res.body.status).toBe(false);
            expect(res.body.message).toBe(`Member with code ${code} not found!`);
            expect(res.body.data).toBe(null);
        } catch (err) {
            console.error("Test failed due to an unexpected error:", err);
            throw err;
        }
    });
    test("Member Penalized - Cannot Borrow Book", async () => {
        const bookCode = 'JK-45'; 
        const Members = await Member.create({
            code: "M003",
            name: "Putri",
            penalized: true,
            penalty_end_date: new Date('2024-12-31'),
            createdAt: new Date(),
            updatedAt: new Date()
        })
        try {
            const res = await request(app).post('/api/members/borrow')
                .send({ member_code: Members.code, book_code: bookCode });
            expect(res.statusCode).toBe(400);
            expect(res.body).toHaveProperty('status');
            expect(res.body).toHaveProperty('message');
            expect(res.body).toHaveProperty('data');
            expect(res.body.status).toBe(false);
            expect(res.body.message).toBe(`Member is currently penalized and cannot borrow books!`);
            expect(res.body.data).toBe(null);
        } catch (err) {
            console.error("Test failed due to an unexpected error:", err);
            throw err;
        }
    });
    test("Member cannot borrow more tha two books", async () => {
        const bookCode = "TW-11"; 
        const member = await Member.findOne({
            where: { code: "M001" }
        });
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + 7);
        await Borrowing.create({
            memberId: member.id,
            bookId: 1,
            borrowDate: new Date(),
            dueDate: dueDate
            })
        try {
            const res = await request(app).post('/api/members/borrow')
                .send({ member_code: "M001", book_code: bookCode });
            expect(res.statusCode).toBe(403); 
            expect(res.body).toHaveProperty('status');
            expect(res.body).toHaveProperty('message');
            expect(res.body).toHaveProperty('data');
            expect(res.body.status).toBe(false);
            expect(res.body.message).toBe(`Member cannot borrow more than 2 books.`);
            expect(res.body.data).toBe(null);
        } catch (err) {    
            console.error("Test failed due to an unexpected error:", err);
            throw err;
        }
    });
    test('Book not available for borrowing!', async () => {
        const member = await Member.create(
          {
            code: "M002",
            name: "Ferry",
            createdAt: new Date(),
            updatedAt: new Date()
          });
        try {
            const res = await request(app).post('/api/members/borrow')
                .send({ member_code: "M002", book_code: "JK-45" });
            expect(res.statusCode).toBe(400); 
            expect(res.body).toHaveProperty('status');
            expect(res.body).toHaveProperty('message');
            expect(res.body).toHaveProperty('data');
            expect(res.body.status).toBe(false);
            expect(res.body.message).toBe('Book not available for borrowing!');
            expect(res.body.data).toBe(null);
        } catch (err) {
            console.error("Test failed due to an unexpected error:", err);
            throw err;
        }
    });
    
});
describe("/members/return POST", () => {
    test("success", async () => {
        try {
            const res = await request(app).post("/api/members/return")
            .send({member_code:"M001",book_code:"JK-45"});        
            expect(res.statusCode).toBe(200); 
            expect(res.body).toHaveProperty("status");
            expect(res.body).toHaveProperty("message");
            expect(res.body).toHaveProperty("data");
            expect(res.body.status).toBe(true);
            expect(res.body.message).toBe("Book returned successfully!");
        } catch (err) {
            expect(err).toBe("error");
        }
    });
    test("Member Not Found", async () => {
        const code = '1234';
        const bookCode = 'JK-45'; 
        
        try {
            const res = await request(app).post('/api/members/return')
            .send({ member_code: code, book_code: bookCode });
            expect(res.statusCode).toBe(404);
            expect(res.body).toHaveProperty('status');
            expect(res.body).toHaveProperty('message');
            expect(res.body).toHaveProperty('data');
            expect(res.body.status).toBe(false);
            expect(res.body.message).toBe(`Member with code ${code} not found!`);
            expect(res.body.data).toBe(null);
        } catch (err) {
            console.error("Test failed due to an unexpected error:", err);
            throw err;
        }
    });
    test("Book not borrowed by the member", async () => {
        const code = 'M001';
        const bookCode = 'NRN-7'; 
        
        try {
            const res = await request(app).post('/api/members/return')
            .send({ member_code: code, book_code: bookCode });
            expect(res.statusCode).toBe(400);
            expect(res.body).toHaveProperty('status');
            expect(res.body).toHaveProperty('message');
            expect(res.body).toHaveProperty('data');
            expect(res.body.status).toBe(false);
            expect(res.body.message).toBe('This book was not borrowed by the member!');
            expect(res.body.data).toBe(null);
        } catch (err) {
            console.error("Test failed due to an unexpected error:", err);
            throw err;
        }
    });
    
});
truncate.Index();