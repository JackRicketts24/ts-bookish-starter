Book(id, title, authors, ISBN)
Loan(id, book_id, user_id, due)
User(id, name, password)

```sql
CREATE TABLE Person (
    id INTEGER IDENTITY(1,1) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE Book (
    isbn VARCHAR(13) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    authors VARCHAR(255) NOT NULL
);

CREATE TABLE Copy (
    id INTEGER IDENTITY(1,1) PRIMARY KEY,
    book_isbn VARCHAR(13) NOT NULL,
    FOREIGN KEY (book_isbn) REFERENCES Book(isbn)
);

CREATE TABLE Loan (
    id INTEGER IDENTITY(1,1) PRIMARY KEY,
    copy_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    due DATE NOT NULL,
    FOREIGN KEY (copy_id) REFERENCES Copy(id),
    FOREIGN KEY (user_id) REFERENCES Person(id)
);
```