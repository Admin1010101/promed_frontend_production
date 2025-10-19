import React, { useState, useEffect } from 'react';
import { Modal, Box, TextField, Button, IconButton } from '@mui/material';
import { FaEdit, FaTrashAlt, FaTimes } from 'react-icons/fa';
import authRequest from '../../../utils/axios';
import toast from 'react-hot-toast';

const NotesModal = ({ open, onClose, patientId, patientName, onNotesUpdate }) => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  // Fetch notes when modal opens
  useEffect(() => {
    if (open && patientId) {
      fetchNotes();
    }
  }, [open, patientId]);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const axiosInstance = authRequest();
      const response = await axiosInstance.get(`/notes/?patient=${patientId}`);
      // Sort by most recent first
      const sortedNotes = response.data.sort((a, b) => b.id - a.id);
      setNotes(sortedNotes);
    } catch (error) {
      console.error('Error fetching notes:', error);
      toast.error('Failed to load notes');
    } finally {
      setLoading(false);
    }
  };

  const handleStartEdit = (note = null) => {
    setEditingNote(note);
    setTitle(note ? note.title : '');
    setBody(note ? extractText(note.body) : '');
    setShowEditor(true);
  };

  const handleCancelEdit = () => {
    setShowEditor(false);
    setEditingNote(null);
    setTitle('');
    setBody('');
  };

  // Extract plain text from stored JSON format
  const extractText = (bodyData) => {
    try {
      const parsed = JSON.parse(bodyData);
      if (Array.isArray(parsed)) {
        return parsed
          .map((node) => node.children?.map((child) => child.text).join('') || '')
          .join('\n');
      }
      return bodyData;
    } catch {
      return bodyData || '';
    }
  };

  const handleSave = async () => {
    if (!title.trim()) {
      toast.error('Please enter a title');
      return;
    }

    if (!body.trim()) {
      toast.error('Please enter note content');
      return;
    }

    const payload = {
      patient: patientId,
      title: title.trim(),
      body: body.trim(), // Send plain text directly
    };

    try {
      setLoading(true);
      const axiosInstance = authRequest();

      if (editingNote) {
        await axiosInstance.put(`/notes/${editingNote.id}/`, payload);
        toast.success('Note updated successfully');
      } else {
        await axiosInstance.post(`/notes/`, payload);
        toast.success('Note created successfully');
      }

      handleCancelEdit();
      await fetchNotes();
      // Trigger refresh in parent component (PatientCard)
      if (onNotesUpdate) {
        onNotesUpdate();
      }
    } catch (error) {
      console.error('Error saving note:', error);
      const errorMsg = error.response?.data?.detail || 'Failed to save note';
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (noteId) => {
    if (!window.confirm('Are you sure you want to delete this note?')) return;

    try {
      setLoading(true);
      const axiosInstance = authRequest();
      await axiosInstance.delete(`/notes/${noteId}/`);
      toast.success('Note deleted successfully');
      await fetchNotes();
      // Trigger refresh in parent component (PatientCard)
      if (onNotesUpdate) {
        onNotesUpdate();
      }
    } catch (error) {
      console.error('Error deleting note:', error);
      toast.error('Failed to delete note');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '90%',
          maxWidth: 700,
          maxHeight: '90vh',
          bgcolor: 'background.paper',
          borderRadius: 2,
          boxShadow: 24,
          overflow: 'hidden',
        }}
        className="bg-white dark:bg-gray-900"
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Notes - {patientName}
          </h2>
          <IconButton onClick={onClose} size="small">
            <FaTimes className="text-gray-500 dark:text-gray-400" />
          </IconButton>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 120px)' }}>
          {/* Add Note Button */}
          {!showEditor && (
            <button
              onClick={() => handleStartEdit()}
              className="w-full mb-4 py-2 px-4 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition font-medium"
              disabled={loading}
            >
              + Add New Note
            </button>
          )}

          {/* Editor */}
          {showEditor && (
            <div className="mb-4 p-4 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800">
              <TextField
                fullWidth
                label="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                margin="normal"
                variant="outlined"
                size="small"
                className="mb-3"
              />

              <textarea
                className="w-full min-h-[120px] p-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                  bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-sm
                  focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
                placeholder="Enter note content..."
                value={body}
                onChange={(e) => setBody(e.target.value)}
              />

              <div className="flex gap-2 mt-4">
                <Button
                  variant="contained"
                  onClick={handleSave}
                  disabled={loading}
                  sx={{
                    bgcolor: '#008080',
                    '&:hover': { bgcolor: '#66CDAA' },
                  }}
                >
                  {loading ? 'Saving...' : 'Save Note'}
                </Button>
                <Button
                  variant="outlined"
                  onClick={handleCancelEdit}
                  disabled={loading}
                  sx={{
                    color: 'gray',
                    borderColor: 'gray',
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {/* Notes List */}
          {loading && notes.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              Loading notes...
            </div>
          ) : notes.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              No notes yet. Click "Add New Note" to create one.
            </div>
          ) : (
            <div className="space-y-3">
              {notes.map((note) => (
                <div
                  key={note.id}
                  className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg 
                    bg-white dark:bg-gray-800 hover:shadow-md transition"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                      {note.title}
                    </h3>
                    <div className="flex gap-2">
                      <IconButton
                        size="small"
                        onClick={() => handleStartEdit(note)}
                        disabled={loading}
                      >
                        <FaEdit className="text-gray-500 dark:text-gray-400 hover:text-teal-500" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(note.id)}
                        disabled={loading}
                      >
                        <FaTrashAlt className="text-gray-500 dark:text-gray-400 hover:text-red-500" />
                      </IconButton>
                    </div>
                  </div>

                  <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                    {extractText(note.body)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </Box>
    </Modal>
  );
};

export default NotesModal;