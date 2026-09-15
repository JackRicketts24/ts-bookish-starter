import { Router, Request, Response } from 'express';
import {
    getAllBooks,
    addBook,
    DuplicateIsbnError,
    addCopy,
    findBook
} from '../repositories/bookRepository';

class BookController {
    router: Router;

    constructor() {
        this.router = Router();

        this.router.get('/all', this.allBooks.bind(this));
        this.router.get('/search', this.findBook.bind(this));
        this.router.get('/:id', this.getBook.bind(this));
        this.router.post('/', this.createBook.bind(this));
    }

    getBook(req: Request, res: Response) {
        // TODO: implement functionality
        return res.status(500).json({
            error: 'server_error',
            error_description: 'Endpoint not implemented yet.',
        });
    }

    async createBook(req: Request, res: Response) {
        const title = req.body.title;
        const authors = req.body.authors;
        const isbn = req.body.isbn;
        const copyCount = req.body.copies;

        try {
            await addBook(title, authors, isbn);
            for (let i = 0; i < copyCount; i++)
                await addCopy(isbn);
            return res.status(200).send();
        } catch (error) {
            if (error instanceof DuplicateIsbnError) {
                console.error(`Failed to add book: duplicate ISBN ${isbn}`);
                return res.status(409).json({
                    error: 'A book with this ISBN already exists.',
                });
            }

            console.error(error);
            return res.status(500).json({
                error: "Unable to create new book."
            })
        }
    }

    async allBooks(req: Request, res: Response) {
        try {
            return res.status(200).json({
                books: await getAllBooks()
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                error: "Unable to connect to database"
            })
        }
    }

    async findBook(req: Request, res: Response) {
        const title = req.query.title as string;
        try {
            return res.status(200).json({
                books: await findBook(title)
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                error: "Unable to connect to database"
            });
        }
    }
}

export default new BookController().router;
