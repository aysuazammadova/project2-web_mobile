import React, { useEffect, useState } from "react";

const Home = () => {
    const [featuredRecipe, setFeaturedRecipe] = useState(null);

    useEffect(() => {
        fetch('http://localhost:3000/recipes')
            .then((response) => response.json())
            .then((data) => {
                if (data.length > 0) {
                    const randomIndex = Math.floor(Math.random() * data.length);
                    setFeaturedRecipe(data[randomIndex]);
                }
            })
            .catch((error) => console.error('Error fetching recipes:', error));
    }, []);


    return(
        <div style={{padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <section style={{ marginBottom: '40px '}}>
                <h1>Welcome to the Recipe Manager App!</h1>
                <p>
                    This app helps you manage, organize, and share your favorite recipes easily.
                    Explore recipes, add your own, and enjoy a seamless experience!
                </p>
            </section>

            <section style={{marginBottom: '40px' }}>
                <h2>Featured Recipe</h2>
                {featuredRecipe ? (
                    <div style={{
                        border: '1px solid #ddd', 
                        borderRadius: '8px',
                        padding: '15px',
                        maxWidth: '400px'
                    }}>
                        <h3>{featuredRecipe.title}</h3>
                        <p>{featuredRecipe.description}</p>
                        <p><strong>Difficulty:</strong>{featuredRecipe.difficulty}</p>
                    </div>
                ) : (
                    <p>Loading featured recipe...</p>
                )}
            </section>
        </div>
    );
        
};

export default Home;