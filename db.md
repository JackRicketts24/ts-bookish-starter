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
    title VARCHAR(255) NOT NULL,
    authors VARCHAR(255) NOT NULL,
    ISBN VARCHAR(13) PRIMARY KEY
);

CREATE TABLE Copy (
    id INTEGER PRIMARY KEY,
    book_id INTEGER NOT NULL,
    FOREIGN KEY (book_id) REFERENCES Book(id)
);

CREATE TABLE Loan (
    id IDENTITY(1,1) INTEGER PRIMARY KEY,
    copy_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    due DATE NOT NULL,
    FOREIGN KEY (book_id) REFERENCES Copy(id),
    FOREIGN KEY (user_id) REFERENCES Person(id)
);
```