import React, { useEffect, useState } from "react";

const Home = () => {
    const [featuredRecipe, setFeaturedRecipe] = useState(null);

    useEffect(() => {
        fetch('http://localhost:3000/#/recipes')
            .then((response) => response.json())
            .then((data) => {
                if (data.length > 0) {
                    const mostRecentRecipe = data.sort((a,b) => new Date(b.lastUpdated) - new Date(a.lastUpdated))[0];
                    setFeaturedRecipe(mostRecentRecipe);
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
                        padding: '20px',
                        maxWidth: '600px',
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                        marginBottom: '30px'
                    }}>
                        <h3 style={{ fontSize: '24px', marginBottom: '10px '}}>{featuredRecipe.title}</h3>
                        <p style={{ fontStyle: 'italic', color: '#555' }}>{featuredRecipe.description}</p>
                        <p><strong>Difficulty:</strong>{featuredRecipe.difficulty}</p>
                        <p><strong>Last Updated:</strong> {new Date(featuredRecipe.lastUpdated).toLocaleDateString()}</p>
                    </div>
                ) : (
                    <p>Loading featured recipe...</p>
                )}
            </section>
        </div>
    );
        
};

export default Home;