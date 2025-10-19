import React, { useState, useEffect, useCallback } from 'react';
import { createEditor, Editor, Transforms, Text } from "slate";
import { Slate, Editable, withReact, useSlate } from "slate-react";
import authRequest from "../../../utils/axios";
import { API_BASE_URL } from '../../../utils/constants';
import { set } from 'date-fns';
import { FaEye, FaEdit, FaTrashAlt } from "react-icons/fa";

const ini = [
    {
        type: "paragraph",
        children: [{ text: "" }]
    },
];

// Convert Slate value to HTML
const serialize = (value) => {
    return JSON.stringify(value);
}

//Convert HTML to Slate value
const deserialize = (html) => {
    try {
        if (!html) return ini; // Add this check
        const parse = JSON.parse(html);
        if (Array.isArray(parse) && parse.length > 0) return parse;
        return ini;
    } catch {
        return ini;
    }
}

// Editor ToolBar active check
const isActive = (editor, format) => {
    const marks = Editor.marks(editor);
    return marks ? marks[format] === true : false;
};

// Toggle Toolbar
const toggle = (editor, format) => {
    const active = isActive(editor, format);
    if (active) {
        Editor.removeMark(editor, format);
    } else {
        Editor.addMark(editor, format, true);
    }
}

// Toolbar Components
const ToolbarButton = ({ format, icon, ...props}) => {
    const editor = useSlate();
    return (
        <button
        type="button"
        className={`mr-2 px-2 py-1 rounded ${isActive(editor, format) ? "bg-teal-200" : "bg-gray-200"}`}
        onMouseDown={event => {
            event.preventDefault();
            toggle(editor, format);
        }}
        {...props}
    >
      {icon}
    </button>
  );
};

// Rendering notes on front end
function renderNode(node, key = 0) {
    if (!node) return null;
    if (node.text !== undefined) {
        let text = node.text;
        if (node.bold) text = <strong key={key}>{text}</strong>;
        if (node.italic) text = <em key={key}>{text}</em>;
        if (node.underline) text = <u key={key}>{text}</u>;
        return text;
    }

    if (node.children) {
        return (<p key={key}>{node.children.map((child, idx) => renderNode(child, idx))}</p>);
    }
    return null;
}

const Notes = ({ patientId }) => {
    
    const [notes, setNotes] = useState([]);
    const [editingNote, setEditingNote] = useState(null);
    const [showEditor, setShowEditor] = useState(false);
    const [editorTitle, setEditorTitle] = useState("");
    const [editorValue, setEditorValue] = useState(ini);
    const [file, setFile] = useState(null);
    // Create a new editor instance when showEditor changes
    const [editor] = useState(() => withReact(createEditor()));
    
    //Fetch notes for patient 
    useEffect(() => {
        if (!patientId) return;
        const fetchNotes = async () => {
            try { 
                const axioInstance = authRequest();
                
                axioInstance.get(`${API_BASE_URL}/notes/?patient=${patientId}`)
                .then((res) => { console.log(res.data); setNotes(res.data)})
                .catch(() => setNotes([]));
            } catch (error) {
                console.error("Error fetching notes:", error);
            }
        };
        fetchNotes();
    }, [patientId]);

    // Adding a note through editing
    const start = (note = null) => {
        const newValue = note && note.body ? deserialize(note.body) : ini;
        setEditingNote(note);
        setEditorTitle(note ? note.title : "");
        setEditorValue(newValue);
        setFile(null);
        // Reset editor selection to avoid stale state
        Transforms.select(editor, { path: [0, 0], offset: 0 });
        setShowEditor(true);
    };


    //Add or update note
    const handleSave = async () => {
        const text = serialize(editorValue);
        const formData = new FormData();
        formData.append('patient', patientId);
        formData.append('title', editorTitle || "Note");
        formData.append('body', text);
        if (file) formData.append('document', file);
        if (editingNote) {
            // Update 
            try {
                const axiosInstance = authRequest();
                await axiosInstance.put(`${API_BASE_URL}/notes/${editingNote.id}/`, formData, {
                    headers: {"Content-Type": "multipart/form-data"}
                });
            } catch (error) {
                console.error("Error updating note:", error);
            }
        } else {
            // Create
            try {
                const axiosInstance = authRequest();
                await axiosInstance.post(`${API_BASE_URL}/notes/`, formData, {
                    headers: {"Content-Type": "multipart/form-data"}
                });
            } catch (error) {
                console.error("Error creating note:", error);
            }
        }
        setShowEditor(false);
        setEditingNote(null);
        setEditorTitle("");
        setEditorValue(ini);
        
        // Refresh Note
        try {
            const axiosInstance = authRequest();
            const res = await axiosInstance.get(`${API_BASE_URL}/notes/?patient=${patientId}`);
            setNotes(res.data);
        } catch (error) {
            console.error("Error fetching notes:", error);
        }
    };


    //Delete note
    const handleDelete = async (id) => {
        try {
            const axiosInstance = authRequest();
            await axiosInstance.delete(`${API_BASE_URL}/notes/${id}/`);
            setNotes(notes.filter((n) => n.id !== id));
        } catch (error) {
            console.error("Error deleting note:", error);
        }
    };

    // Rendering Marks in Editable
    const renderLeaf = useCallback(props => {
        let { children } = props;
        if (props.leaf.bold) children = <strong>{children}</strong>;
        if (props.leaf.italic) children = <em>{children}</em>;
        if (props.leaf.underline) children = <u>{children}</u>;
        return <span {...props.attributes}>{children}</span>;
    }, []);

    return (
    <div>
        <p className="text-sm font-semibold text-center">Patient Documentation</p>
        <div className="text-sm text-gray-700 space-y-1" style={{ marginTop: 5 }}>
        <div className="flex items-center justify-between mb-2">
            <p className="text-xs flex">
            <strong>Notes</strong>
            </p>
            <button
            className="text-[10px] px-2 py-1 rounded-full flex items-center gap-1 transition-all border border-teal-500 text-teal-500 font-bold"
            onClick={() => start(null)}
            >
            + Add Note
            </button>
        </div>
        {notes.map((note) => (
            <div key={note.id} className="flex flex-col border rounded p-2 mb-2 bg-gray-50">
            <div className="flex justify-between items-center mb-1">
                <div>
                <strong>{note.title}</strong>
                </div>
                <div className="flex space-x-2">
                <FaEdit
                    className="text-gray-500 hover:text-teal-500 cursor-pointer"
                    onClick={() => start(note)}
                />
                <FaTrashAlt
                    className="text-gray-500 hover:text-red-500 cursor-pointer"
                    onClick={() => handleDelete(note.id)}
                />
                </div>
            </div>
            {Array.isArray(deserialize(note.body))
            ? deserialize(note.body).map((node, idx) => renderNode(node, idx))
            : note.body}

            {note.document && (
                <a href={note.document} target='_blank' rel="noopener noreferrer" className='text-teal-600 underline text-xs mt-1'>
                   {note.document.split('/').pop()}
                </a>
            )}
            </div>
        ))}
        {showEditor && (
            <div className="border rounded p-2 mt-2 bg-gray-100">
            <input
                className="border p-1 w-full mb-2"
                placeholder="Title"
                value={editorTitle}
                onChange={(e) => setEditorTitle(e.target.value)}
            />
            <Slate
                key={editingNote ? `edit-${editingNote.id}` : `new-${Date.now()}`}
                editor={editor}
                initialValue={editorValue}
                onChange={val => {
                    // Ensure val is always an array
                    if (Array.isArray(val) && val.length > 0) {
                        setEditorValue(val);
                    }
                }}
            >
                <div className='flex items-center mb-2'>
                    <ToolbarButton format="bold" icon={<b>B</b>} />
                    <ToolbarButton format="italic" icon={<i>I</i>} />
                    <ToolbarButton format="underline" icon={<u>U</u>} />
                    <input type="file" className="ml-4" onChange={(e) => setFile(e.target.files[0])} />
                </div>
                <Editable
                renderLeaf={renderLeaf}
                style={{ minHeight: '100px', border: '1px solid #ccc', padding: '10px' }}
                />
            </Slate>
            <div className="flex gap-2 mt-2">
                <button
                className="bg-teal-500 text-white px-3 py-1 rounded"
                onClick={handleSave}
                >
                Save
                </button>
                <button
                className="bg-gray-300 px-3 py-1 rounded"
                onClick={() => setShowEditor(false)}
                >
                Cancel
                </button>
            </div>
            </div>
        )}
        </div>
    </div>
    );
};
export default Notes;