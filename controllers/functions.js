import pg from "pg";
const db = new pg.Client({
    user:"postgres",
    host:"localhost",
    database:"books",
    password:"Postgres#2023",
    port:5432,
});
db.connect();


export async function getBoookInfo(bookIsbn) {
    try {
        const result = await db.query("SELECT * FROM book WHERE isbn=$1;",[bookIsbn]);
        const bookInfo=result.rows;
        return bookInfo;
    } catch (error) {
        console.error(`error getting book info of isbn:${bookIsbn}`,error);
    }
}

export async function getAllBooks(wayToSort='id') {
    try {
        let bookInfo;
        if(wayToSort=='rating' || wayToSort=='date_modified') {
            const result = await db.query(`SELECT book.id, book.isbn, book.title, book.author, book.year, book.pages, book.coverid, review.rating, review.date_modified FROM book JOIN review ON book.isbn=review.isbn ORDER BY ${wayToSort} desc;`);
            bookInfo=result.rows;
        }else {
            const result = await db.query(`SELECT book.id, book.isbn, book.title, book.author, book.year, book.pages, book.coverid, review.rating, review.date_modified FROM book JOIN review ON book.isbn=review.isbn ORDER BY ${wayToSort};`);
            bookInfo=result.rows;
        }
        return bookInfo;
    } catch (error) {
        console.error(`error fetching books : `,error);
    }
}

export async function getBookReview(bookIsbn) {
    try {
        const result = await db.query("SELECT * FROM review WHERE isbn=$1",[bookIsbn]);
        const summaryObject=result.rows;
        return summaryObject;
    } catch (error) {
        console.error(`error fetching summary of book isbn : ${bookIsbn} `,error);
    }
}

export async function updateBookReview(bookIsbn,updatedReview,rating) {
    try {
        const today = new Date();
        const formattedDate = today.toISOString().split('T')[0];
        const result = await db.query("UPDATE review SET summary=$1, rating=$2, date_modified=$3 WHERE isbn=$4",[updatedReview,rating,formattedDate,bookIsbn]);
        return result.rowCount;
    } catch (error) {
        console.error(`error updating summary of book isbn : ${bookIsbn} `,error);
        return 0;        
    }
}

export async function addNewBook(bookInfo) {
    try {
        const today = new Date();
        const formattedDate = today.toISOString().split('T')[0];
        const result1 = await db.query("INSERT INTO book(isbn, title, author, year, pages, coverid) VALUES($1,$2,$3,$4,$5,$6);",
        [bookInfo.isbn, bookInfo.title, bookInfo.author, bookInfo.year, bookInfo.pages, bookInfo.coverid]);
        const result2 = await db.query("INSERT INTO review(isbn, date_modified, summary, rating) VALUES($1,$2,$3,$4);",
        [bookInfo.isbn, formattedDate, bookInfo.summary, bookInfo.rating]);
        if(result1.rowCount>0 && result2.rowCount>0) {
            return true;
        }
    } catch (error) {
        console.error(`error adding book title : ${bookInfo.title} `,error);
        return 0;
    }
}

export async function deleteBook(bookInfo) {
    try {
        const result2 = await db.query("DELETE FROM review WHERE isbn=$1;",[bookInfo]);
        const result1 = await db.query("DELETE FROM book WHERE isbn=$1;",[bookInfo]);
        if(result1.rowCount>0 && result2.rowCount>0) {
            return true;
        }
    } catch (error) {
        console.error(`error deleting book title : ${bookInfo.title} `,error);
        return 0;
    }
}