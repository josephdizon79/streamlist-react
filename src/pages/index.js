// Import React useState for state management
import { useState } from 'react';

// Import Material UI components for icons
import { IconButton } from '@mui/material';
import { Delete, Edit, CheckCircle } from '@mui/icons-material';

export default function Home() {
  // State for text input
  const [input, setInput] = useState('');
  // State for storing list items
  const [items, setItems] = useState([]);
  // State to track which item is being edited
  const [editingIndex, setEditingIndex] = useState(null);

  // Function to handle adding or updating an item
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return; // Prevent adding empty items

    if (editingIndex !== null) {
      // If editing, update the selected item
      const updatedItems = [...items];
      updatedItems[editingIndex].text = input;
      setItems(updatedItems);
      setEditingIndex(null); // Exit editing mode
    } else {
      // If adding new, push new item to the list
      setItems([...items, { text: input, completed: false }]);
    }

    setInput(''); // Clear input after submit
  };

  // Function to delete an item from the list
  const handleDelete = (index) => {
    const updatedItems = items.filter((_, i) => i !== index);
    setItems(updatedItems);
  };

  // Function to start editing an existing item
  const handleEdit = (index) => {
    setInput(items[index].text); // Fill input with current text
    setEditingIndex(index); // Set index for editing
  };

  // Function to toggle completed state of an item
  const handleComplete = (index) => {
    const updatedItems = [...items];
    updatedItems[index].completed = !updatedItems[index].completed;
    setItems(updatedItems);
  };

  return (
    <main style={{ padding: '20px', fontFamily: 'Arial, sans-serif', color: '#fff' }}>
      <h1>StreamList</h1>

      {/* INPUT FORM */}
      {/* Handles adding new or updating existing list items */}
      <form
        onSubmit={handleSubmit}
        style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}
      >
        {/* Search icon in front of input */}
        <span className="material-icons" style={{ fontSize: '28px', color: '#e50914' }}>
          search
        </span>

        {/* Input box for adding/editing items */}
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Add a movie or show..."
          style={{
            padding: '8px',
            flex: '1',
            backgroundColor: '#2b2b2b',
            border: 'none',
            color: '#fff',
            borderRadius: '4px',
          }}
        />

        {/* Button changes text depending on add or edit mode */}
        <button
          type="submit"
          style={{
            padding: '8px 16px',
            backgroundColor: '#e50914',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          {editingIndex !== null ? 'Update' : 'Add'}
        </button>
      </form>

      {/* LIST OF ITEMS */}
      {/* Displays all user-added items */}
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {items.map((item, index) => (
          <li
            key={index}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '8px',
              padding: '8px',
              borderRadius: '6px',
              backgroundColor: '#2b2b2b',
              color: '#fff',
              textDecoration: item.completed ? 'line-through' : 'none',
            }}
          >
            {/* Item text */}
            {item.text}

            {/* Complete Button - toggles limegreen if completed */}
            <IconButton onClick={() => handleComplete(index)}>
              <CheckCircle style={{ color: item.completed ? 'limegreen' : '#87cefa' }} />
            </IconButton>

            {/* Edit Button */}
            <IconButton onClick={() => handleEdit(index)}>
              <Edit style={{ color: '#87cefa' }} />
            </IconButton>

            {/* Delete Button */}
            <IconButton onClick={() => handleDelete(index)}>
              <Delete style={{ color: '#87cefa' }} />
            </IconButton>
          </li>
        ))}
      </ul>
    </main>
  );
}
