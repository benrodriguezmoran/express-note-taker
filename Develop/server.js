const PORT = process.env.PORT || 3001; // Define the port for the server, using 3001.
const path = require('path'); // Import the 'path' module to work with file paths.
const fs = require('fs'); // Import the 'fs' module for file system operations.
const express = require('express');
const app = express(); // Create an instance of the Express application.
const db = require('./public/db/db.json'); // Import notes data from 'db.json'.
const dbPath = './public/db/db.json';

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public')); 
// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html')); // HTML for root route
});
app.get('/api/notes', (req, res) => {
    res.sendFile(path.join(__dirname, dbPath)); // GET /api/notes
});
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html')); // HTML /notes route
});

// Create note
function createNewNote(body, notesArray) {
    const newNote = body;
    
    
    body.id = (Object.keys(notesArray).length>0 ? Object.keys(notesArray).length : 0);
    notesArray.push(newNote);
    fs.writeFileSync(
        path.join(__dirname, dbPath),
        JSON.stringify(notesArray, null, 2)
    );
    return newNote;
}
// POST Note
app.post('/api/notes', (req, res) => {
    const newNote = createNewNote(req.body, db);
    res.json(newNote); // Respond to POST /api/notes with new note as JSON
});
// Delete by ID
function deleteNote(id, notesArray) {
    for (let i = 0; i < notesArray.length; i++) {
        let note = notesArray[i];
        if (note.id == id) {
            notesArray.splice(i, 1);
            fs.writeFileSync(
                path.join(__dirname, dbPath),
                JSON.stringify(notesArray, null, 2)
            );
            break;
        }
    }
}
//DELETE /api/notes/:id
app.delete('/api/notes/:id', (req, res) => {
    deleteNote(req.params.id, db);
    res.json(true); 
});
app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`); 
});