// src/components/TaskPreview.js
import React, { useState } from "react";

const TaskPreview = ({ task, onSave, onDelete, categories }) => {
  const [updatedTask, setUpdatedTask] = useState({ ...task });
  const [newSubtask, setNewSubtask] = useState("");
  const [editingSubtaskIndex, setEditingSubtaskIndex] = useState(null);
  const [editedSubtask, setEditedSubtask] = useState("");

  // Handle task field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedTask((prevTask) => ({
      ...prevTask,
      [name]: value,
    }));
  };

  // Handle adding a new subtask
  const handleAddSubtask = () => {
    if (newSubtask) {
      setUpdatedTask((prevTask) => ({
        ...prevTask,
        subtasks: [...prevTask.subtasks, newSubtask],
      }));
      setNewSubtask("");
    }
  };

  // Handle editing an existing subtask
  const handleEditSubtask = (index) => {
    setEditingSubtaskIndex(index);
    setEditedSubtask(updatedTask.subtasks[index]);
  };

  const handleSaveSubtask = (index) => {
    const updatedSubtasks = updatedTask.subtasks.map((subtask, i) =>
      i === index ? editedSubtask : subtask
    );
    setUpdatedTask((prevTask) => ({
      ...prevTask,
      subtasks: updatedSubtasks,
    }));
    setEditingSubtaskIndex(null);
    setEditedSubtask("");
  };

  const handleDeleteSubtask = (index) => {
    const updatedSubtasks = updatedTask.subtasks.filter((_, i) => i !== index);
    setUpdatedTask((prevTask) => ({
      ...prevTask,
      subtasks: updatedSubtasks,
    }));
  };

  const handleSave = () => {
    onSave(updatedTask);
  };

  const handleDelete = () => {
    onDelete(updatedTask);
  };

  return (
    <div className="p-4 border bg-gray-100">
      <h2 className="text-xl font-bold">Task Preview</h2>
      <input
        type="text"
        name="title"
        value={updatedTask.title}
        onChange={handleChange}
        className="border p-2 w-full mt-2 bg-gray-100 outline-none h-7"
        placeholder="Task Title"
      />
      <input
        type="text"
        name="description"
        value={updatedTask.description}
        onChange={handleChange}
        className="border p-2 w-full mt-2 bg-gray-100 outline-none h-7"
        placeholder="Task Description"
      />
      <input
        type="date"
        name="date"
        value={updatedTask.date}
        onChange={handleChange}
        className="border p-2 w-full mt-2 bg-gray-100 outline-none h-7"
      />
      <select
        name="category"
        value={updatedTask.originalCategory}
        onChange={(e) => {
          setUpdatedTask((prevTask) => ({
            ...prevTask,
            originalCategory: e.target.value,
          }));
        }}
        className="border p-2 w-full mt-2 bg-gray-100 outline-none"
      >
        {categories.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>
      <div className="mt-4">
        <input
          type="text"
          value={newSubtask}
          onChange={(e) => setNewSubtask(e.target.value)}
          className="border p-2 rounded-sm outline-none h-7 bg-gray-100"
          placeholder="New Subtask"
        />
        {/* onClick={handleAddSubtask} */}
        <button
          onClick={handleAddSubtask}
          className="bg-gray-600 hover:bg-gray-700 text-gray-200 p-2 mt-2 flex items-center h-fit"
        >
          {" "}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={24}
            height={24}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="icon icon-tabler icons-tabler-outline icon-tabler-plus"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M12 5l0 14" />
            <path d="M5 12l14 0" />
          </svg>{" "}
          Add Subtask
        </button>
      </div>
      <ul className="mt-4">
        {updatedTask.subtasks.map((subtask, index) => (
          <li key={index} className="border p-2 mt-2">
            {editingSubtaskIndex === index ? (
              <div>
                <input
                  type="text"
                  value={editedSubtask}
                  onChange={(e) => setEditedSubtask(e.target.value)}
                  className="border p-2 w-full "
                />
                <button
                  onClick={() => handleSaveSubtask(index)}
                  className="bg-green-500 hover:bg-green-600 text-white p-2 mt-2 rounded-sm"
                >
                  Save Changes
                </button>
              </div>
            ) : (
              <div>
                {subtask}
                <button
                  onClick={() => handleEditSubtask(index)}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white p-2 ml-2 rounded-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteSubtask(index)}
                  className="bg-red-500 hover:bg-red-600 text-white p-2 ml-2 rounded-sm"
                >
                  Delete
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
      <button
        onClick={handleSave}
        className="bg-green-500 hover:bg-green-600 text-white p-2 mt-2 rounded-md"
      >
        Save Changes
      </button>
      <button
        onClick={handleDelete}
        className="bg-transparent text-red-500 outline-2 hover:bg-red-500 hover:text-white transition-all p-2 ml-2 mt-2 rounded-md"
      >
        Delete
      </button>
    </div>
  );
};

export default TaskPreview;
