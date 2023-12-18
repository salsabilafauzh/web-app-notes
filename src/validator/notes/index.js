import InvariantError from '../../exceptions/InvariantError.js';
import { NotePayloadsSchema } from './schema.js';

const NoteValidator = {
  validateNotePayload: (payload) => {
    const validationResult = NotePayloadsSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

export default NoteValidator;
