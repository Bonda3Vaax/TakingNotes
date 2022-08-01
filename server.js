const PORT = process.env.PORT || 3001;
import { writeFileSync } from 'fs';
import { join } from 'path';

import express, { urlencoded, json, static } from 'express';
const app = express();

import allNotes, { slice } from './db/db.json';

app.use(urlencoded({ extended: true }));
app.use(json());
app.use(static('public'));

app.get('/api/notes', (_req, res) => {
    res.json(slice(1));
});

app.get('/', (_req, res) => {
    res.sendFile(join(__dirname, './public/index.html'));
});

app.get('/notes', (_req, res) => {
    res.sendFile(join(__dirname, './public/notes.html'));
});

app.get('*', (_req, res) => {
    res.sendFile(join(__dirname, './public/index.html'));
});

function createNewNote(body, notesArray) {
    const newNote = body;
    if (!Array.isArray(notesArray))
        notesArray = [];
    
    if (notesArray.length === 0)
        notesArray.push(0);

    body.id = notesArray[0];
    notesArray[0]++;

    notesArray.push(newNote);
    writeFileSync(
        join(__dirname, './db/db.json'),
        JSON.stringify(notesArray, null, 2)
    );
    return newNote;
}

app.post('/api/notes', (req, res) => {
    const newNote = createNewNote(req.body, allNotes);
    res.json(newNote);
});

function deleteNote(id, notesArray) {
    for (let i = 0; i < notesArray.length; i++) {
        let note = notesArray[i];

        if (note.id == id) {
            notesArray.splice(i, 1);
            writeFileSync(
                join(__dirname, './db/db.json'),
                JSON.stringify(notesArray, null, 2)
            );

            break;
        }
    }
}

app.delete('/api/notes/:id', (req, res) => {
    deleteNote(req.params.id, allNotes);
    res.json(true);
});

app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});
