const Note = require('../../src/models/Note');

exports.getNotes = async (req, res) => {
    try {
        console.log(req.user)
        const notes = await Note.find({ user: req.user.userId }); 
        res.json(notes);
    } catch (err) {
        console.error('Error fetching notes:', err);
        res.status(500).json({ message: 'Server error while fetching notes' });
    }
};

exports.createNote = async (req, res) => {
    try {
        const body = JSON.parse(req.body || "{}");
        const { content } = body;

        if (!content || !req.user) {
            return res.status(400).json({ message: 'Note content and valid user are required' });
        }
        console.log( req.user );
        const note = await Note.create({
            user: req.user.userId,
            content
        });

        res.status(201).json(note);
    } catch (err) {
        console.error('Error creating note:', err);
        res.status(500).json({ message: 'Server error while creating note' });
    }
};

exports.deleteNote = async (req, res) => {
    try {
        const userId = req.user.userId
        const note = await Note.findOneAndDelete({ _id: req.params.id, user: userId });

        if (!note) {
            return res.status(404).json({ message: 'Note not found or not authorized to delete' });
        }

        res.json({ message: 'Note deleted successfully' });
    } catch (err) {
        console.error('Error deleting note:', err);
        res.status(500).json({ message: 'Server error while deleting note' });
    }
};
