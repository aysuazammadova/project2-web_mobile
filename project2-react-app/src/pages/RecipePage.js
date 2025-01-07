import React, { useState, useEffect, use } from "react";
import "./RecipePage.css";

function RecipePage() {
  const [recipes, setRecipes] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    ingredients: "",
    steps: "",
    tags: "",
    difficulty: "Easy",
    lastUpdated: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("");
  const [sortOption, setSortOption] = useState("lastUpdated");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [uniqueTags, setUniqueTags] = useState([]);
  const [tag, setTag] = useState("");
  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    setLoading(true);
    try {
      const savedRecipes = localStorage.getItem("recipes");
      let data = savedRecipes ? JSON.parse(savedRecipes) : [];

      const extractedTags = new Set();
      data.forEach((recipe) => {
        if (recipe.tags && Array.isArray(recipe.tags)) {
          recipe.tags.forEach((tag) => extractedTags.add(tag.toLowerCase()));
        }
      });

      setUniqueTags([...extractedTags]);
      setRecipes(data);
      setError(null);
      
    } catch (error) {
      console.error("Error fetching recipes:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newTags = (form.tags || "").split(",").map(tag => tag.trim().toLowerCase());

    const updatedRecipe = {
      ...form,
      ingredients: form.ingredients.split(",").map((item) => item.trim()),
      steps: form.steps.split(".").map((item) => item.trim()),
      tags: newTags,
      lastUpdated: new Date().toISOString(),
    };

    setLoading(true);
    try {
      if (isEditing) {
        await fetch(`http://localhost:3000/#/recipes/${editId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedRecipe),
        });
        setIsEditing(false);
        setEditId(null);
      } else {
        await fetch("http://localhost:3000/#/recipes", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedRecipe),
        });
      }

      let updatedRecipes;
      if (isEditing) {
        updatedRecipes = recipes.map((recipe) =>
          recipe.id === editId ? updatedRecipe : recipe
        );
      } else {
        updatedRecipes = [...recipes, { ...updatedRecipe, id: Date.now() }];
      }

      localStorage.setItem("recipes", JSON.stringify(updatedRecipes));
      setRecipes(updatedRecipes);

      const updatedTagsSet = new Set([...uniqueTags, ...newTags]);
      setUniqueTags([...updatedTagsSet]);

      setForm({
        title: "",
        description: "",
        ingredients: "",
        steps: "",
        tags: "",
        difficulty: "Easy",
        lastUpdated: "",
      });
      fetchRecipes();
    } catch (error) {
      setError("Error saving recipe. Please try again.");
      console.error("Error saving recipe:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (recipe) => {
    setForm({
      title: recipe.title,
      description: recipe.description,
      ingredients: recipe.ingredients.join(", "),
      steps: recipe.steps.join(". "),
      tags: recipe.tags.join(", "),
      difficulty: recipe.difficulty,
      lastUpdated: recipe.lastUpdated,
    });
    setIsEditing(true);
    setEditId(recipe.id);
  };

  const handleDelete = async (id) => {
    setLoading(true);
    try {
      await fetch(`http://localhost:3000/#/recipes/${id}`, {
        method: "DELETE",
      });

      const updatedRecipes = recipes.filter((recipe) => recipe.id !== id);
      localStorage.setItem("recipes", JSON.stringify(updatedRecipes));


      fetchRecipes();
    } catch (error) {
      setError("Error deleting recipe. Please try again.");
      console.error("Error deleting recipe:", error);
    }finally {
      setLoading(false);
    }
  };

  const filteredRecipes = recipes.filter((recipe) => 
    (searchQuery === "" || 
      recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recipe.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recipe.ingredients.join(", ").toLowerCase().includes(searchQuery.toLowerCase())) && 
    (selectedTag === "" || recipe.tags.includes(selectedTag)) && 
    (selectedDifficulty === "" || recipe.difficulty === selectedDifficulty)
  );

  const difficultyOrder = {
    Easy: 1,
    Medium: 2,
    Hard: 3,
  }

  const sortedRecipes = [...filteredRecipes].sort((a, b) => {
    if (sortOption === "title") return a.title.localeCompare(b.title);
    if (sortOption === "difficulty") {
      return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
    }
    return new Date(b.lastUpdated) - new Date(a.lastUpdated);
  });

  return (
    <div className="recipe-page">
      <h1>Recipe Manager</h1>

      {error && <p className="error">{error}</p>}


      <input 
        type="text"
        placeholder="Search recipes..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      <select onChange={(e) => setSelectedTag(e.target.value)}>
        <option value="">All Tags</option>
        {uniqueTags && uniqueTags.map((tag, index) => (
          <option key={index} value={tag}>
            {tag.charAt(0).toUpperCase() + tag.slice(1)}
          </option>
        ))}
      </select>

      <select onChange={(e) => setSelectedDifficulty(e.target.value)}>
        <option value="">All Difficulties</option>
        <option value="Easy">Easy</option>
        <option value="Medium">Medium</option>
        <option value="Hard">Hard</option>
      </select>

      <select onChange={(e) => setSortOption(e.target.value)}>
        <option value="lastUpdated">Sort by Last Updated</option>
        <option value="title">Sort by Title</option>
        <option value="difficulty">Sort by Difficulty</option>
      </select>

      <form className="recipe-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />
        <textarea
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          required
        ></textarea>
        <textarea
          placeholder="Ingredients (comma-separated)"
          value={form.ingredients}
          onChange={(e) => setForm({ ...form, ingredients: e.target.value })}
          required
        ></textarea>
        <textarea
          placeholder="Steps (dot-separated)"
          value={form.steps}
          onChange={(e) => setForm({ ...form, steps: e.target.value })}
          required
        ></textarea>
        <input
          type="text"
          placeholder="Tags (comma-separated)"
          value={form.tags}
          onChange={(e) => setForm({ ...form, tags: e.target.value })}
          required
        />
        <select
          value={form.difficulty}
          onChange={(e) => setForm({ ...form, difficulty: e.target.value })}
          required
        >
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>
        <button type="submit">{isEditing ? "Update" : "Add"} Recipe</button>
      </form>

      <div className="recipe-list">
        {loading && <p>Loading...</p>}
        {sortedRecipes.map((recipe) => (
          <div
            className="recipe-card"
            key={recipe.id}
            onMouseEnter={() => console.log("Hovering over:", recipe.title)}
          >
            <h3>{recipe.title}</h3>
            <p>{recipe.description}</p>
            <p><strong>Ingredients:</strong> {recipe.ingredients.join(", ")}</p>
            <p><strong>Steps:</strong> {recipe.steps.join(". ")}</p>
            <p><strong>Tags:</strong> {recipe.tags.join(", ")}</p>
            <p><strong>Difficulty:</strong> {recipe.difficulty}</p>
            <p><strong>Last Updated:</strong> {new Date(recipe.lastUpdated).toLocaleString()}</p>
            <div className="card-buttons">
              <button onClick={() => handleEdit(recipe)}>Edit</button>
              <button onClick={() => handleDelete(recipe.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RecipePage;
