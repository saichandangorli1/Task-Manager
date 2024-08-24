import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import React, { useState, useEffect, useRef } from "react";

const Menu = ({
  onCategoryChange,
  categories,
  setCategories,
  selectedCategory,
}) => {
  const [newCategory, setNewCategory] = useState("");
  const [categoryColors, setCategoryColors] = useState({});
  const [fullWidth, setFullWidth] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    // Retrieve stored colors from localStorage when component mounts
    const storedColors =
      JSON.parse(localStorage.getItem("categoryColors")) || {};
    setCategoryColors(storedColors);
  }, []);

  useEffect(() => {
    // Save colors to localStorage whenever they change
    localStorage.setItem("categoryColors", JSON.stringify(categoryColors));
  }, [categoryColors]);

  const getRandomHexColor = () => {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    const toHex = (value) => value.toString(16).padStart(2, "0");
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  };

  const handleAddCategory = () => {
    if (newCategory && !categories.includes(newCategory)) {
      const updatedCategories = [...categories];
      const newCategoryColors = { ...categoryColors };

      // Generate a color only if it doesn't exist
      if (!newCategoryColors[newCategory]) {
        newCategoryColors[newCategory] = getRandomHexColor();
      }

      // Update localStorage with new category and colors
      updatedCategories.push(newCategory);
      localStorage.setItem("categories", JSON.stringify(updatedCategories));
      setCategories(updatedCategories); // Update categories in parent component

      setCategoryColors(newCategoryColors); // Update color state
      localStorage.setItem("categoryColors", JSON.stringify(newCategoryColors)); // Save to localStorage

      setNewCategory("");
    }
  };

  const handleDeleteCategory = (categoryToDelete) => {
    if (categoryToDelete === "Upcoming" || categoryToDelete === "All") return;

    // Remove tasks from All and Upcoming
    const allTasks = JSON.parse(localStorage.getItem("All")) || [];
    const upcomingTasks = JSON.parse(localStorage.getItem("Upcoming")) || [];
    const categoryTasks =
      JSON.parse(localStorage.getItem(categoryToDelete)) || [];

    const updatedAllTasks = allTasks.filter(
      (task) => task.originalCategory !== categoryToDelete
    );
    localStorage.setItem("All", JSON.stringify(updatedAllTasks));

    const updatedUpcomingTasks = upcomingTasks.filter(
      (task) => task.originalCategory !== categoryToDelete
    );
    localStorage.setItem("Upcoming", JSON.stringify(updatedUpcomingTasks));

    // Remove category from localStorage
    localStorage.removeItem(categoryToDelete);

    // Update categories list
    const updatedCategories = categories.filter(
      (category) => category !== categoryToDelete
    );
    localStorage.setItem("categories", JSON.stringify(updatedCategories));
    setCategories(updatedCategories); // Update categories in parent component

    // Remove color from state and localStorage
    const { [categoryToDelete]: _, ...remainingColors } = categoryColors;
    setCategoryColors(remainingColors);
    localStorage.setItem("categoryColors", JSON.stringify(remainingColors));

    // Reset selection if necessary
    if (categoryToDelete === selectedCategory) {
      onCategoryChange("Upcoming");
    }
  };

  // useGSAP(() => {
  //   gsap.to(menuRef.current, {
  //     transform: "translateX(-100%)",
  //     delay: 1,
  //     duration: 1,
  //   });
  // });
  return (
    <div
      ref={menuRef}
      className="w-1/4 relative text-[#545454] bg-gray-100 border-r m-1 rounded-l-lg p-4"
    >
      <div className="Menu mb-5 w-full h-fit flex items-center justify-between px-3">
        <h1 className="text-2xl font-bold">Menu</h1>
        <div
          className="w-8 overflow-hidden h-8"
          onClick={() => {
            setFullWidth((preFullWidth) => !preFullWidth);
            console.log(fullWidth);
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={32}
            height={32}
            viewBox="0 0 24 24"
            fill="none"
            stroke="#545454"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="icon icon-tabler icons-tabler-outline icon-tabler-menu-deep"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M4 6h16" />
            <path d="M7 12h13" />
            <path d="M10 18h10" />
          </svg>
        </div>
      </div>
      <h2 className="text-sm font-bold">Tasks</h2>
      <ul className="mt-4">
        {categories.map((category) => (
          <div key={category} className="flex justify-start items-center gap-2">
            {/* Applying stored background color or default color */}
            <div
              className="w-4 h-4 rounded-sm"
              style={{
                backgroundColor:
                  category === "Upcoming" || category === "All"
                    ? "#FE6D66" // Default color for specific categories
                    : categoryColors[category] || "#6BD8E7", // Stored or default color
              }}
            ></div>
            <li
              onClick={() => onCategoryChange(category)}
              className="cursor-pointer p-2 hover:bg-gray-200 flex justify-between w-full items-center"
            >
              {category}

              {category !== "Upcoming" && category !== "All" && (
                <button
                  onClick={() => handleDeleteCategory(category)}
                  className="text-[#000] border-[1px] bg-red-300 rounded-md ml-2 p-1 text-xs"
                >
                  Delete
                </button>
              )}
            </li>
          </div>
        ))}
      </ul>
      <div className="mt-4 flex h-fit flex-col">
        <input
          type="text"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          className="border p-2 bg-gray-200 text-gray-500 placeholder:text-gray-500 outline-none border-none "
          placeholder="New Category"
        />
        <button
          onClick={handleAddCategory}
          className="bg-gray-600 hover:bg-gray-700 text-gray-200 p-2 flex items-center"
        >
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
          Add Category
        </button>
      </div>
    </div>
  );
};

export default Menu;
