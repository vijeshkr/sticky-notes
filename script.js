'use strict';

// Get references to the DOM elements
const e_notesContainer = document.getElementById('notesContainer');
const e_addNote = document.getElementById('addNote');

// Initilize app data structure
var appData = {
    'identifier': 0,
    'notes': []
};

// Function to generate a unique ID for each note
function uniqueID() {
    appData.identifier += 1;
    return 'n' + appData.identifier;
}

// Function to generate a random pastel color
function randomPastelColor () {
    var _hue = Math.floor(Math.random() * 360);
    let _pastel = `hsl(${_hue}, 100%, 80%)`;
    return _pastel;
}

// Load notes data from local storage
function loadData() {
    let _data = localStorage.getItem("sticky-note");
    if (_data) {
        appData = JSON.parse(_data);
    }
}

// Save notes data to local storage
function saveData() {
    localStorage.setItem("sticky-note", JSON.stringify(appData));
}

// Function to create a new note
function createNote(id, content, toDatabase = true) {
    // Create note container (textarea)
    const _noteElement = document.createElement("div"); // Changed from textarea to div to accommodate a delete button
    _noteElement.classList.add("note");

    const _textArea = document.createElement("textarea");
    _textArea.value = content;
    _textArea.placeholder = "Take a note...";
    _textArea.maxLength = 192;
    _textArea.style.backgroundColor = randomPastelColor();
    _textArea.classList.add("note-content"); // New class for textarea
    _textArea.id = id;

    // Event listener to update the note content
    _textArea.addEventListener("change", () => {
        updateNote(id, _textArea.value);
    });

    // Create delete button
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "🗑️"; // Trash can icon for the delete button
    deleteButton.classList.add("delete-note"); // Class for styling
    deleteButton.addEventListener("click", () => {
        const _confirmation = confirm("Are you sure you wish to delete this note?");
        if (_confirmation) {
            deleteNoteByElement(_noteElement);
        }
    });

    // Append textarea and delete button to the note element
    _noteElement.appendChild(_textArea);
    _noteElement.appendChild(deleteButton);

    // Insert note element into the notes container before the add note button
    e_notesContainer.insertBefore(_noteElement, e_addNote);

    // If saving to database, push the note object
    if (toDatabase) {
        const _noteObject = {
            'id': id,
            'content': content
        };
        appData.notes.push(_noteObject);
    }

    // Save to local storage
    saveData();
}


// Function to delete a note by its corresponding DOM element
function deleteNoteByElement(element) {
    appData.notes.splice(appData.notes.findIndex(e => e.id === element.id), 1);
    e_notesContainer.removeChild(element);

    saveData();
}

// Function to update the content of a note
function updateNote(id, content) {
    let _target = appData.notes.find(_note => _note.id === id);
    _target.content = content;

    saveData();
}

// Load existing notes from local storage when the application starts
loadData();
appData.notes.forEach((_note) => {
    createNote(_note.id, _note.content, false);
});

// Event listener to create a new note when the add button is clicked
e_addNote.addEventListener('click', () => createNote(uniqueID(),''));