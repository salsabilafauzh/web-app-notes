import { nanoid } from 'nanoid';
import NotFoundError from '../../exceptions/NotFoundError.js';
import InvariantError from '../../exceptions/InvariantError.js';
class NotesService {
  constructor() {
    this._notes = [];
  }

  addNote({ title, body, tags }) {
    const id = nanoid(16);
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const newNote = {
      id,
      title,
      createdAt,
      updatedAt,
      tags,
      body,
    };

    this._notes.push(newNote);

    const isSuccess = this._notes.filter((note) => note.id == id).length > 0;

    if (!isSuccess) {
      throw new InvariantError('Catatan gagal ditambahkan');
    }

    return id;
  }

  getNotes() {
    return this._notes;
  }
  getNoteById(id) {
    const note = this._notes.filter((note) => note.id === id)[0];
    if (!note) {
      throw new NotFoundError('Catatan tidak ditemukan');
    }
    return note;
  }

  editNoteById(id, { title, body, tags }) {
    const index = this._notes.findIndex((note) => note.id === id);

    if (index === -1) {
      throw new NotFoundError('Gagal memperbarui catatan. Id tidak ditemukan');
    }

    const updatedAt = new Date().toISOString();

    this._notes[index] = {
      ...this._notes[index],
      title,
      tags,
      body,
      updatedAt,
    };
  }

  deleteNoteById(id) {
    const index = this._notes.findIndex((note) => note.id === id);
    if (index === -1) {
      throw new NotFoundError('Catatan tidak ditemukan');
    }

    this._notes.splice(index, 1);
  }
}

export default NotesService;
