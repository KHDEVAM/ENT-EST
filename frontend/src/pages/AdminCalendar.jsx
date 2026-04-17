import React, { useState } from "react";
import { createSchedule } from "../services/api";

export default function AdminSchedule() {
  const [form, setForm] = useState({
    day: "Lundi",
    time: "08:30 - 12:30",
    title: "",
    teacher: "",
    group: "A",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await createSchedule(form);
      setMessage("✅ Event added successfully!");

      setForm({
        day: "Lundi",
        time: "08:30 - 12:30",
        title: "",
        teacher: "",
        group: "A",
      });
    } catch (err) {
      setMessage("❌ Error adding event");
    }
  };
  

  return (
    <div style={styles.container}>
        
      <h1>🛠 Admin - Add Schedule</h1>

      <form onSubmit={handleSubmit} style={styles.form}>
        
        {/* DAY */}
        <label>Day</label>
        <select name="day" value={form.day} onChange={handleChange}>
          <option>Lundi</option>
          <option>Mardi</option>
          <option>Mercredi</option>
          <option>Jeudi</option>
          <option>Vendredi</option>
          <option>Samedi</option>
          <option>Dimanche</option>
        </select>

        {/* TIME */}
        <label>Time</label>
        <select name="time" value={form.time} onChange={handleChange}>
          <option>08:30 - 12:30</option>
          <option>13:30 - 17:30</option>
          <option>17:30 - 21:30</option>
        </select>

        {/* TITLE */}
        <label>Title</label>
        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Course name"
          required
        />

        {/* TEACHER */}
        <label>Teacher</label>
        <input
          type="text"
          name="teacher"
          value={form.teacher}
          onChange={handleChange}
          placeholder="Teacher name"
          required
        />

        <button type="submit" style={styles.button}>
          ➕ Add Event
        </button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
}

const styles = {
  container: {
    padding: "20px",
    maxWidth: "500px",
    margin: "auto",
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },

  button: {
    marginTop: "10px",
    padding: "10px",
    backgroundColor: "#2ecc71",
    color: "white",
    border: "none",
    cursor: "pointer"
  },
};