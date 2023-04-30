import { Document, Schema, model } from 'mongoose';

interface ChallengeDocumentInterface extends Document {
  id: number;
  name: string;
  ruteChallenge: number[];
  typeActivitie: "bicicleta" | "correr";
  kmTotal: number;
  idUsersCahllenge: number[];

}

const ChallengeSchema = new Schema<ChallengeDocumentInterface>({

  id: {
    type: Number,
    unique: true,
    required: true
  },
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  ruteChallenge: {
    type: [Number],
    required: true
  },
  typeActivitie: {
    type: String, 
    default: "bicicleta",
    enum: ["bicicleta", "correr"] 
  },
  kmTotal: {
    type: Number,
    required: true
  },
  idUsersCahllenge: {
    type: [Number],
    required: true
  }
});

export const Challenges = model<ChallengeDocumentInterface>('Challenge', ChallengeSchema);