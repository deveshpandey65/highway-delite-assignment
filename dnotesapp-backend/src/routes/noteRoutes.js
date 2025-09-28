
const express = require('express');
const { createNote, getNotes, deleteNote } = require('../controllers/notesController');
const { verifyToken } = require('../middlewares/authMiddlewares');

const router = express.Router();
router.use(verifyToken)
router.get('/', getNotes);
router.post('/', createNote);
router.delete('/:id', deleteNote);

module.exports = router;
