import React from 'react';
import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Modal from './components/modal';
import About from './pages/About';
import Contact from './pages/Contact';
import Appointment from './pages/Appointment/AppointmentIndex';
import Schedule from './pages/Appointment/Schedule';
import Booking from './pages/Appointment/Book';
import './App.css';

// 專案卡片元件草稿
function ProjectCard({ project, onCardClick }) {
  return (
    <div className="project-card" onClick={() => onCardClick(project)}>
      <div className="project-card-bg" style={{ backgroundImage: `url(${project.image})` }}></div>
      <div className="project-card-title">{project.title}</div>
    </div>
  );
}

// 專案彈出視窗元件草稿
function ProjectModal({ project, onClose }) {
  if (!project) return null;
  return (
    <Modal open={project} onClose={onClose}>
      <h3>{project.title}</h3>
      <p>{project.description}</p>
      <div className="modal-buttons">
        {project.githubUrl && (
          <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="modal-button github">GitHub</a>
        )}
        {project.projectUrl && (
          <a href={project.projectUrl} target="_blank" rel="noopener noreferrer" className="modal-button demo">專案連結</a>
        )}
      </div>

    </Modal>
  );
}

// 專案區塊元件草稿
function ProjectsSection({ title, projects, onCardClick }) {
  return (
    <section className="projects-section">
      <h2 className="section-title">{title}</h2>
      <div className="projects-grid">
        {projects.map(project => (
          <ProjectCard key={project.id} project={project} onCardClick={onCardClick} />
        ))}
      </div>
    </section>
  );
}

// Placeholder project data
const ongoingProjects = [
  { id: 1, title: '預約系統', image: '/appointment/apointment.jpg', description: '正在進行中', githubUrl: '#', projectUrl: '/appointment/' },
];

const historicalProjects = [
  { id: 2, title: '台北一日遊', image: '/TPE_day_trip/TPE-day-trip-project.jpeg', description: '這是我做的第一個網站。', githubUrl: '#', projectUrl: 'https://starfruit8106.synology.me:3001/' },
  { id: 4, title: '歷史專案 D', image: '/project-d-bg.jpg', description: '這是歷史專案 D 的詳細描述。', githubUrl: '#', projectUrl: '#' },
  { id: 5, title: '歷史專案 E', image: '/project-e-bg.jpg', description: '這是歷史專案 E 的詳細描述。', githubUrl: '#', projectUrl: '#' },
  { id: 6, title: '歷史專案 F', image: '/project-e-bg.jpg', description: '這是歷史專案 F 的詳細描述。', githubUrl: '#', projectUrl: '#' }
];

function Home() {
  const [selectedProject, setSelectedProject] = useState(null);

  const handleCardClick = (project) => {
    setSelectedProject(project);
  };

  const handleCloseModal = () => {
    setSelectedProject(null);
  };

  return (
    <div className="app">
      <Header title="無聊玩專案" />
      <main className="main-content">
        <ProjectsSection title="Ongoing" projects={ongoingProjects} onCardClick={handleCardClick} />
        <ProjectsSection title="History" projects={historicalProjects} onCardClick={handleCardClick} />
      </main>
      <Footer />
      <ProjectModal project={selectedProject} onClose={handleCloseModal} />
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/appointment" element={<Appointment />} />
        <Route path="/appointment/schedule" element={<Schedule />} />
        <Route path="/appointment/booking" element={<Booking />} />
      </Routes>
    </Router>
  );
}

export default App;
