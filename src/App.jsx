// src/App.js
import React, { useState, useEffect, useRef } from "react";
import Menu from "./components/Menu";
import TaskList from "./components/TaskList";
import TaskPreview from "./components/TaskPreview";
import "./App.css"; // Ensure this file imports Tailwind styles
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

function App() {
  const [selectedCategory, setSelectedCategory] = useState("Upcoming");
  const [selectedTask, setSelectedTask] = useState(null);
  const [categories, setCategories] = useState(["Upcoming", "All"]);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetchTasks(selectedCategory);
  }, [selectedCategory]);

  useEffect(() => {
    const savedCategories =
      JSON.parse(localStorage.getItem("categories")) || [];
    setCategories((prevCategories) =>
      [...new Set([...prevCategories, ...savedCategories])].filter(
        (category) => category !== "Expired"
      )
    ); // Remove "Expired" category
  }, []);

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

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setSelectedTask(null); // Reset selected task when category changes
  };

  const handleTaskSelect = (task) => {
    setSelectedTask(task);
  };

  const handleSaveTask = (updatedTask) => {
    const allTasks = JSON.parse(localStorage.getItem("All")) || [];
    const upcomingTasks = JSON.parse(localStorage.getItem("Upcoming")) || [];
    const oldCategoryTasks =
      JSON.parse(localStorage.getItem(selectedCategory)) || [];
    const newCategoryTasks =
      JSON.parse(localStorage.getItem(updatedTask.originalCategory)) || [];

    // Remove task from the old category if necessary
    const updatedOldCategoryTasks = oldCategoryTasks.filter(
      (task) => task.title !== updatedTask.title
    );
    localStorage.setItem(
      selectedCategory,
      JSON.stringify(updatedOldCategoryTasks)
    );

    // Update task in All
    const updatedAllTasks = allTasks.filter(
      (task) => task.title !== updatedTask.title
    );
    localStorage.setItem(
      "All",
      JSON.stringify([...updatedAllTasks, updatedTask])
    );

    // Update task in Upcoming
    const taskDate = new Date(updatedTask.date);
    if (taskDate > new Date()) {
      const updatedUpcomingTasks = upcomingTasks.filter(
        (task) => task.title !== updatedTask.title
      );
      localStorage.setItem(
        "Upcoming",
        JSON.stringify([...updatedUpcomingTasks, updatedTask])
      );
    }

    // Add task to the new category
    const updatedNewCategoryTasks = [
      ...newCategoryTasks.filter((task) => task.title !== updatedTask.title),
      updatedTask,
    ];
    localStorage.setItem(
      updatedTask.originalCategory,
      JSON.stringify(updatedNewCategoryTasks)
    );

    // Check and update the categories
    updateCategories();

    fetchTasks(selectedCategory); // Refresh task list
    setSelectedTask(null);
  };

  const updateCategories = () => {
    let updatedCategories = ["Upcoming", "All"];
    const categoryKeys = Object.keys(localStorage).filter(
      (key) => !["All", "Upcoming", "categories"].includes(key)
    );
    categoryKeys.forEach((key) => {
      const tasks = JSON.parse(localStorage.getItem(key)) || [];
      if (tasks.length > 0) {
        updatedCategories.push(key);
      } else {
        localStorage.removeItem(key); // Remove empty category
      }
    });

    localStorage.setItem("categories", JSON.stringify(updatedCategories));
    setCategories(updatedCategories);
  };

  // const handleDeleteTask = (taskToDelete) => {
  //   const allTasks = JSON.parse(localStorage.getItem("All")) || [];
  //   const upcomingTasks = JSON.parse(localStorage.getItem("Upcoming")) || [];
  //   const categoryTasks =
  //     JSON.parse(localStorage.getItem(taskToDelete.originalCategory)) || [];

  //   // Remove task from All
  //   const updatedAllTasks = allTasks.filter(
  //     (task) => task.title !== taskToDelete.title
  //   );
  //   localStorage.setItem("All", JSON.stringify(updatedAllTasks));

  //   // Remove task from Upcoming
  //   const updatedUpcomingTasks = upcomingTasks.filter(
  //     (task) => task.title !== taskToDelete.title
  //   );
  //   localStorage.setItem("Upcoming", JSON.stringify(updatedUpcomingTasks));

  //   // Remove task from specific category
  //   const updatedCategoryTasks = categoryTasks.filter(
  //     (task) => task.title !== taskToDelete.title
  //   );
  //   localStorage.setItem(
  //     taskToDelete.originalCategory,
  //     JSON.stringify(updatedCategoryTasks)
  //   );

  //   // Check and update the categories
  //   updateCategories();

  //   fetchTasks(selectedCategory); // Refresh task list
  //   setSelectedTask(null);
  // };

  const handleDeleteTask = (taskToDelete) => {
    const allTasks = JSON.parse(localStorage.getItem("All")) || [];
    const upcomingTasks = JSON.parse(localStorage.getItem("Upcoming")) || [];
    const categoryTasks =
      JSON.parse(localStorage.getItem(taskToDelete.originalCategory)) || [];

    // Remove task from All
    const updatedAllTasks = allTasks.filter(
      (task) => task.title !== taskToDelete.title
    );
    localStorage.setItem("All", JSON.stringify(updatedAllTasks));

    // Remove task from Upcoming
    const updatedUpcomingTasks = upcomingTasks.filter(
      (task) => task.title !== taskToDelete.title
    );
    localStorage.setItem("Upcoming", JSON.stringify(updatedUpcomingTasks));

    // Remove task from specific category
    const updatedCategoryTasks = categoryTasks.filter(
      (task) => task.title !== taskToDelete.title
    );
    localStorage.setItem(
      taskToDelete.originalCategory,
      JSON.stringify(updatedCategoryTasks)
    );

    // Check and update the categories
    updateCategories();

    fetchTasks(selectedCategory); // Refresh task list
    setSelectedTask(null);
  };

  const dotRef = useRef();

  useGSAP(() => {
    gsap.to(dotRef.current, {
      repeat: -1,
      duration: 1.6,
      ease: "none",
      opacity: 0,
    });
  });
  return (
    <>
      <div className=" hidden md:flex shadow-lg bg-white p-1 m-4 rounded-xl w-full overflow-hidden min-h-screen h-fit">
        <Menu
          onCategoryChange={handleCategoryChange}
          categories={categories}
          setCategories={setCategories} // Pass setCategories to Menu
          selectedCategory={selectedCategory}
        />
        <div className="w-2/3 p-4">
          <TaskList
            category={selectedCategory}
            onSelectTask={handleTaskSelect}
          />
        </div>
        <div className="w-1/3 p-4 border-l">
          {selectedTask && (
            <TaskPreview
              task={selectedTask}
              onSave={handleSaveTask}
              onDelete={handleDeleteTask}
              categories={categories}
            />
          )}
        </div>
      </div>
      <div className="flex md:hidden justify-center items-center h-screen">
        work in progress switch to desktop mode
        <span className="inline-block" ref={dotRef}>
          .
        </span>
      </div>
    </>
  );
}

export default App;

// className = "text-[#000] border-[1px] bg-red-300 rounded-md ml-2 p-1 text-xs";
