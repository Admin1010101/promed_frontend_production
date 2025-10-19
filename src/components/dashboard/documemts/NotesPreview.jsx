import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import authRequest from '../../../utils/axios';

const NotesPreview = ({ patientId, onViewAll, refreshTrigger }) => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    if (!patientId) return;

    const fetchRecentNotes = async () => {
      try {
        setLoading(true);
        const axiosInstance = authRequest();
        const response = await axiosInstance.get(`/notes/?patient=${patientId}`);
        // Sort by most recent first
        const sortedNotes = response.data.sort((a, b) => b.id - a.id);
        setNotes(sortedNotes);
      } catch (error) {
        console.error('Error fetching notes:', error);
        setNotes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentNotes();
  }, [patientId, refreshTrigger]);

  // Extract plain text from stored format (handle both plain text and JSON)
  const extractText = (bodyData) => {
    if (!bodyData) return '';
    
    // If it's already plain text, return it
    if (typeof bodyData === 'string' && !bodyData.startsWith('[') && !bodyData.startsWith('{')) {
      return bodyData;
    }
    
    // Try to parse as JSON (for backwards compatibility)
    try {
      const parsed = JSON.parse(bodyData);
      if (Array.isArray(parsed)) {
        return parsed
          .map((node) => node.children?.map((child) => child.text).join('') || '')
          .join(' ');
      }
      return bodyData;
    } catch {
      // If parsing fails, return as-is
      return bodyData;
    }
  };

  // Truncate text
  const truncate = (text, maxLength = 100) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  if (loading) {
    return (
      <div className="text-xs text-gray-500 dark:text-gray-400 text-center py-2">
        Loading notes...
      </div>
    );
  }

  const displayedNotes = showAll ? notes : notes.slice(0, 5);
  const hasMoreNotes = notes.length > 5;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">
          Patient Notes ({notes.length})
        </p>
        <motion.button
          onClick={onViewAll}
          className="text-[10px] px-3 py-1 rounded-full bg-teal-500 text-white
            hover:bg-teal-600 font-semibold transition"
          whileTap={{ scale: 0.95 }}
        >
          + Add Note
        </motion.button>
      </div>

      {notes.length === 0 ? (
        <p className="text-xs text-gray-500 dark:text-gray-400 text-center py-2">
          No notes yet. Click "+ Add Note" to create one.
        </p>
      ) : (
        <>
          <div className="space-y-2">
            <AnimatePresence>
              {displayedNotes.map((note) => (
                <motion.div
                  key={note.id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-2 rounded border border-gray-200 dark:border-gray-700
                    bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-750
                    transition cursor-pointer"
                  onClick={onViewAll}
                >
                  <p className="text-xs font-semibold text-gray-900 dark:text-gray-100 mb-1">
                    {note.title}
                  </p>
                  <p className="text-[11px] text-gray-600 dark:text-gray-400">
                    {truncate(extractText(note.body), 80)}
                  </p>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {hasMoreNotes && !showAll && (
            <motion.button
              onClick={() => setShowAll(true)}
              className="w-full text-[10px] py-1 rounded border border-gray-300 dark:border-gray-600
                text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700
                font-semibold transition"
              whileTap={{ scale: 0.98 }}
            >
              Show {notes.length - 5} More Note{notes.length - 5 > 1 ? 's' : ''}
            </motion.button>
          )}

          {showAll && hasMoreNotes && (
            <motion.button
              onClick={() => setShowAll(false)}
              className="w-full text-[10px] py-1 rounded border border-gray-300 dark:border-gray-600
                text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700
                font-semibold transition"
              whileTap={{ scale: 0.98 }}
            >
              Show Less
            </motion.button>
          )}
        </>
      )}
    </div>
  );
};

export default NotesPreview;