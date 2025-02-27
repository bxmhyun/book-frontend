import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const [books, setBooks] = useState([]);
  const [newBook, setNewBook] = useState({ title: '', author: '', image_url: '' });
  const [editBook, setEditBook] = useState(null);
  const [error, setError] = useState('');
  const uri = 'https://laughing-space-capybara-jj7g774vpg7w3v5-5001.app.github.dev/';

  const username = 'Username';
  const password = 'password';
  const encodedCredentials = btoa(`${username}:${password}`);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await axios.get(`${uri}/books`, {
        headers: {
          'Authorization': `Basic ${encodedCredentials}`
        }
      });
      setBooks(response.data.books);
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (editBook) {
      setEditBook({ ...editBook, [name]: value });
    } else {
      setNewBook({ ...newBook, [name]: value });
    }
  };

  const validateForm = (book) => {
    if (!book.title.trim() || !book.author.trim() || !book.image_url.trim()) {
      setError('กรุณากรอกข้อมูลให้ครบทุกช่อง');
      return false;
    }
    setError('');
    return true;
  };

  const handleCreateBook = async () => {
    if (!validateForm(newBook)) return;

    try {
      const response = await axios.post(`${uri}/books`, newBook, {
        headers: {
          'Authorization': `Basic ${encodedCredentials}`
        }
      });
      setBooks([...books, response.data]);
      setNewBook({ title: '', author: '', image_url: '' });
    } catch (error) {
      console.error('Error creating book:', error);
    }
  };

  const handleUpdateBook = async () => {
    if (!validateForm(editBook)) return;

    try {
      const response = await axios.put(`${uri}/books/${editBook.title}`, editBook, {
        headers: {
          'Authorization': `Basic ${encodedCredentials}`
        }
      });
      const updatedBooks = books.map((book) =>
        book.title === editBook.title ? response.data : book
      );
      setBooks(updatedBooks);
      setEditBook(null);
    } catch (error) {
      console.error('Error updating book:', error);
    }
  };

  const handleDeleteBook = async (bookTitle) => {
    if (!bookTitle) {
      console.error('Book title is undefined');
      return;
    }
    try {
      await axios.delete(`${uri}/books/${bookTitle}`, {
        headers: {
          'Authorization': `Basic ${encodedCredentials}`
        }
      });
      setBooks(books.filter((book) => book.title !== bookTitle));
    } catch (error) {
      console.error('Error deleting book:', error);
    }
  };

  return (
    <div>
      <h1>Book List</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Image</th>
            <th>Title</th>
            <th>Author</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {books.map((book) => (
            <tr key={book.title}>
              <td>{book.title}</td>
              <td>
                {editBook && editBook.title === book.title ? (
                  <input
                    type="text"
                    name="image_url"
                    value={editBook.image_url}
                    onChange={handleInputChange}
                  />
                ) : (
                  <img src={book.image_url} alt={book.title} width="50" />
                )}
              </td>
              <td>
                {editBook && editBook.title === book.title ? (
                  <input
                    type="text"
                    name="title"
                    value={editBook.title}
                    onChange={handleInputChange}
                  />
                ) : (
                  book.title
                )}
              </td>
              <td>
                {editBook && editBook.title === book.title ? (
                  <input
                    type="text"
                    name="author"
                    value={editBook.author}
                    onChange={handleInputChange}
                  />
                ) : (
                  book.author
                )}
              </td>
              <td>
                {editBook && editBook.title === book.title ? (
                  <button onClick={handleUpdateBook}>Update</button>
                ) : (
                  <button onClick={() => setEditBook(book)}>Edit</button>
                )}
                <button onClick={() => handleDeleteBook(book.title)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Add New Book</h2>
      <input
        type="text"
        name="title"
        placeholder="Title"
        value={newBook.title}
        onChange={handleInputChange}
      />
      <input
        type="text"
        name="author"
        placeholder="Author"
        value={newBook.author}
        onChange={handleInputChange}
      />
      <input
        type="text"
        name="image_url"
        placeholder="Image URL"
        value={newBook.image_url}
        onChange={handleInputChange}
      />
      <button onClick={handleCreateBook}>Create</button>
    </div>
  );
};

export default App;
