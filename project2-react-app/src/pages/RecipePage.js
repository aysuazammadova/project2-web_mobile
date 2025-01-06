import React, { useState, useEffect } from "react";
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

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    try {
      const response = await fetch("http://localhost:3000/recipes");
      const data = await response.json();
      setRecipes(data);
    } catch (error) {
      console.error("Error fetching recipes:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedRecipe = {
      ...form,
      ingredients: form.ingredients.split(",").map((item) => item.trim()),
      steps: form.steps.split(".").map((item) => item.trim()),
      tags: form.tags.split(",").map((item) => item.trim()),
      lastUpdated: new Date().toISOString(),
    };

    try {
      if (isEditing) {
        await fetch(`http://localhost:3000/recipes/${editId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedRecipe),
        });
        setIsEditing(false);
        setEditId(null);
      } else {
        await fetch("http://localhost:3000/recipes", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedRecipe),
        });
      }
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
      console.error("Error saving recipe:", error);
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
    try {
      await fetch(`http://localhost:3000/recipes/${id}`, {
        method: "DELETE",
      });
      fetchRecipes();
    } catch (error) {
      console.error("Error deleting recipe:", error);
    }
  };

  return (
    <div className="recipe-page">
      <h1>Recipe Manager</h1>
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
        {recipes.map((recipe) => (
          <div className="recipe-card" key={recipe.id}>
            <h3>{recipe.title}</h3>
            <p>{recipe.description}</p>
            <p><strong>Ingredients:</strong> {recipe.ingredients.join(", ")}</p>
            <p><strong>Steps:</strong> {recipe.steps.join(". ")}</p>
            <p><strong>Tags:</strong> {recipe.tags.join(", ")}</p>
            <p><strong>Difficulty:</strong> {recipe.difficulty}</p>
            <p><strong>Last Updated:</strong> {new Date(recipe.lastUpdated).toLocaleString()}</p>
            <button onClick={() => handleEdit(recipe)}>Edit</button>
            <button onClick={() => handleDelete(recipe.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RecipePage;
