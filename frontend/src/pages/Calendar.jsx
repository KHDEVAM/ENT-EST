import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser, logout, getSchedule } from '../services/api';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const timeSlots = [
  '08:30 - 12:30',
  '13:30 - 17:30',
  '17:30 - 21:30',
];

// 🧠 convert JS date → French day name
const getDayName = (date) => {
  return date.toLocaleDateString("fr-FR", { weekday: "long" })
    .replace(".", "")
    .replace(/^./, str => str.toUpperCase());
};

// 🧠 get Monday start of week
const getWeekDays = (selectedDate) => {
  const date = new Date(selectedDate);
  const day = date.getDay(); // 0=Sun ... 6=Sat

  const mondayOffset = day === 0 ? -6 : 1 - day;
  const monday = new Date(date);
  monday.setDate(date.getDate() + mondayOffset);

  const weekDays = [];

  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);

    weekDays.push({
      label: getDayName(d),
      date: d
    });
  }

  return weekDays;
};

const CalendarPage = () => {
  const [user, setUser] = useState(null);
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = getCurrentUser();

    if (!currentUser) {
      navigate('/login');
      return;
    }

    setUser(currentUser);
    loadSchedule();
  }, [navigate]);

  const loadSchedule = async () => {
    try {
      const data = await getSchedule();
      setEvents(data);
    } catch (error) {
      console.error("Error loading schedule:", error);
    }
  };

  const weekDays = getWeekDays(selectedDate);

  const getEvent = (day, time) => {
    return events.find(e => e.day === day && e.time === time);
  };

  return (
    <div style={styles.container}>
      
      {/* NAVBAR */}
      <nav style={styles.navbar}>
        <div style={styles.logo}>🎓 ENT EST Salé</div>

        <div style={styles.navLinks}>
          <button onClick={() => navigate('/dashboard')} style={styles.navButton}>
            Dashboard
          </button>
          <button onClick={() => navigate('/courses')} style={styles.navButton}>
            Mes cours
          </button>
          <button onClick={() => navigate('/calendar')} style={styles.navButton}>
            Emploi du temps
          </button>
        </div>

        <div>
          <span>👋 {user?.username}</span>
          <button onClick={logout} style={styles.logoutBtn}>
            Déconnexion
          </button>
        </div>
      </nav>

      {/* MAIN */}
      <main style={styles.main}>
        <h1>📅 Emploi du temps</h1>

        <div style={styles.table}>
          
          {/* HEADER */}
          <div style={styles.timeHeader}></div>

          {weekDays.map(day => (
            <div key={day.label} style={styles.dayHeader}>
              {day.label}
              <div style={{ fontSize: "10px", opacity: 0.7 }}>
                {day.date.getDate()}/{day.date.getMonth() + 1}
              </div>
            </div>
          ))}

          {/* ROWS */}
          {timeSlots.map(time => (
            <React.Fragment key={time}>
              <div style={styles.timeCell}>{time}</div>

              {weekDays.map(day => {
                const event = getEvent(day.label, time);

                return (
                  <div key={day.label + time} style={styles.cell}>
                    {event && (
                      <div style={styles.event}>
                        <strong>{event.title}</strong>
                        <p>{event.teacher}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </main>

      {/* REAL MONTH CALENDAR (LIKE YOUR IMAGE) */}
      <div style={styles.calendarBox}>
        <DatePicker
          selected={selectedDate}
          onChange={(date) => setSelectedDate(date)}
          inline
        />
      </div>

    </div>
  );
};

// =========================
// STYLES
// =========================
const styles = {
  container: { backgroundColor: '#f5f5f5', minHeight: '100vh' },

  navbar: {
    backgroundColor: '#2c3e50',
    color: 'white',
    padding: '15px 30px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },

  logo: { fontWeight: 'bold' },

  navLinks: { display: 'flex', gap: '15px' },

  navButton: {
    background: 'none',
    border: 'none',
    color: 'white',
    cursor: 'pointer'
  },

  logoutBtn: {
    backgroundColor: '#e74c3c',
    border: 'none',
    color: 'white',
    marginLeft: '10px',
    padding: '5px 10px',
    cursor: 'pointer'
  },

  main: { padding: '20px' },

  table: {
    display: 'grid',
    gridTemplateColumns: '150px repeat(7, 1fr)',
    marginTop: '20px',
    border: '1px solid #ddd'
  },

  dayHeader: {
    backgroundColor: '#3498db',
    color: 'white',
    padding: '10px',
    textAlign: 'center',
    fontWeight: 'bold'
  },

  timeHeader: { backgroundColor: '#eee' },

  timeCell: {
    padding: '10px',
    border: '1px solid #ddd',
    backgroundColor: '#fafafa',
    fontWeight: 'bold'
  },

  cell: {
    border: '1px solid #ddd',
    minHeight: '100px',
    padding: '5px'
  },

  event: {
    backgroundColor: '#2ecc71',
    color: 'white',
    padding: '10px',
    borderRadius: '8px',
    height: '80%'
  },

  // 📅 REAL CALENDAR POSITION (BOTTOM RIGHT)
  calendarBox: {
    position: "fixed",
    bottom: "20px",
    right: "20px",
    zIndex: 1000,
    backgroundColor: "white",
    padding: "10px",
    borderRadius: "10px",
    boxShadow: "0 0 10px rgba(0,0,0,0.2)"
  }
};

export default CalendarPage;