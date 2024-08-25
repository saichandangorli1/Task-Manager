// src/components/TaskList.js
import React, { useState, useEffect } from "react";

const TaskList = ({ category, onSelectTask }) => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    date: "",
    subtasks: [],
  });
  const [newSubtask, setNewSubtask] = useState("");

  useEffect(() => {
    fetchTasks(category);
  }, [category]);

  const fetchTasks = (category) => {
    let tasksToShow = [];
    if (category === "All") {
      tasksToShow = JSON.parse(localStorage.getItem("All")) || [];
    } else if (category === "Upcoming") {
      tasksToShow = JSON.parse(localStorage.getItem("Upcoming")) || [];
    } else {
      tasksToShow = JSON.parse(localStorage.getItem(category)) || [];
    }
    setTasks(tasksToShow);
  };

  const handleAddTask = () => {
    if (!newTask.title || !newTask.date) return;

    const taskWithCategory = { ...newTask, originalCategory: category };
    const taskDate = new Date(newTask.date);

    // Add task to "All"
    const allTasks = JSON.parse(localStorage.getItem("All")) || [];
    const updatedAllTasks = [
      ...allTasks.filter((task) => task.title !== newTask.title),
      taskWithCategory,
    ];
    localStorage.setItem("All", JSON.stringify(updatedAllTasks));

    // Add task to "Upcoming"
    if (taskDate >= new Date()) {
      const upcomingTasks = JSON.parse(localStorage.getItem("Upcoming")) || [];
      const updatedUpcomingTasks = [
        ...upcomingTasks.filter((task) => task.title !== newTask.title),
        taskWithCategory,
      ];
      localStorage.setItem("Upcoming", JSON.stringify(updatedUpcomingTasks));
    }

    // Add task to specific category
    const categoryTasks = JSON.parse(localStorage.getItem(category)) || [];
    const updatedCategoryTasks = [
      ...categoryTasks.filter((task) => task.title !== newTask.title),
      taskWithCategory,
    ];
    localStorage.setItem(category, JSON.stringify(updatedCategoryTasks));

    setNewTask({ title: "", description: "", date: "", subtasks: [] });
    setNewSubtask("");
    fetchTasks(category); // Refresh task list
  };

  const handleAddSubtask = () => {
    if (newSubtask) {
      setNewTask((prevTask) => ({
        ...prevTask,
        subtasks: [...prevTask.subtasks, newSubtask],
      }));
      setNewSubtask("");
    }
  };

  return (
    <div className="p-4 h-fit relative">
      <h2 className="text-3xl font-bold">{category} Tasks</h2>
      <div className="mt-4 grid grid-cols-2 gap-2 w-full">
        <input
          type="text"
          value={newTask.title}
          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
          className="border p-2 rounded-sm outline-none h-7"
          placeholder="Task Title"
        />
        <input
          type="text"
          value={newTask.description}
          onChange={(e) =>
            setNewTask({ ...newTask, description: e.target.value })
          }
          className="border p-2 outline-none rounded-sm h-7"
          placeholder="Task Description"
        />
        <input
          type="date"
          value={newTask.date}
          onChange={(e) => setNewTask({ ...newTask, date: e.target.value })}
          className="border p-2 outline-none rounded-sm h-7"
        />
        <input
          type="text"
          value={newSubtask}
          onChange={(e) => setNewSubtask(e.target.value)}
          className="border p-2 outline-none rounded-sm h-7"
          placeholder="New Subtask"
        />
        <button
          onClick={handleAddTask}
          className="bg-gray-600 hover:bg-gray-700 text-gray-200 p-2 flex items-center h-fit"
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
          Add Task
        </button>
        <button
          onClick={handleAddSubtask}
          className="bg-gray-600 hover:bg-gray-700 text-gray-200 p-2 flex items-center h-fit"
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
      <ul className="mt-4 w-full relative">
        {tasks.map((task, index) => (
          <li
            key={index}
            className="border p-2 mt-2 bg-[#F3F4F6] shadow-lg text-[#626d74] w-full flex flex-col"
            onClick={() => onSelectTask(task)}
          >
            <h3 className="font-bold">Title : {task.title}</h3>
            <p>Description : {task.description}</p>
            <p className="flex justify-start gap-2 items-center">
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
                className="icon icon-tabler icons-tabler-outline icon-tabler-calendar-month"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M4 7a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-12z" />
                <path d="M16 3v4" />
                <path d="M8 3v4" />
                <path d="M4 11h16" />
                <path d="M7 14h.013" />
                <path d="M10.01 14h.005" />
                <path d="M13.01 14h.005" />
                <path d="M16.015 14h.005" />
                <path d="M13.015 17h.005" />
                <path d="M7.01 17h.005" />
                <path d="M10.01 17h.005" />
              </svg>
              {task.date}
            </p>
            <ul>
              {task.subtasks.map((subtask, idx) => (
                <li key={idx} className="ml-4">
                  {subtask}
                </li>
              ))}
            </ul>
            <p className="mt-2 text-sm text-gray-600">
              Original Category: {task.originalCategory}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskList;
