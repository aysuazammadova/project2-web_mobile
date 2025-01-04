import React, { useState } from "react";
import "./ContactMe.css";

function ContactMe() {
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [message, setMessage] = useState(""); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newMessage = { email, subject, content };
    
    try {
      const response = await fetch("http://localhost:3000/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newMessage),
      });

      if (response.ok) {
        setMessage("Message sent successfully!");
        setEmail("");
        setSubject("");
        setContent("");
      } else {
        setMessage("Failed to send message. Try again!");
      }
    } catch (error) {
      setMessage("Error: " + error.message);
    }
  };

  return (
    <div className="contact-container">
      <h2>Contact Me</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <label>Email:</label>
        <input 
          type="email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required 
        />
        
        <label>Subject:</label>
        <input 
          type="text" 
          value={subject} 
          onChange={(e) => setSubject(e.target.value)} 
          required 
        />
        
        <label>Message:</label>
        <textarea 
          value={content} 
          onChange={(e) => setContent(e.target.value)} 
          required 
        ></textarea>
        
        <button type="submit">Send Message</button>
      </form>
    </div>
  );
}

export default ContactMe;
