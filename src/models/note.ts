import { Document, Schema, model } from 'mongoose';

interface NoteDocumentInterface extends Document {
  title: string,
  body: string,
  color?: 'blue' | 'green' | 'red' | 'yellow' | 'magenta'
}

const NoteSchema = new Schema<NoteDocumentInterface>({
  title: {
    type: String,
    unique: true,
    required: true,
    trim: true,
    validate: (value: string) => {
      if (!value.match(/^[A-Z]/)) {
        throw new Error('Note title must start with a capital letter');
      }
    },
  },
  body: {
    type: String,
    required: true,
    trim: true,
  },
  color: {
    type: String,
    trim: true,
    default: 'yellow',
    enum: ['blue', 'green', 'red', 'yellow', 'magenta'],
  },
});

export const Note = model<NoteDocumentInterface>('Note', NoteSchema);