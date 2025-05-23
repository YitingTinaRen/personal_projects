import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import About from './pages/About';
import Contact from './pages/Contact';
import './App.css';
import { useState } from 'react';

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
  if (!project) return null; // 如果沒有專案資料，不顯示視窗

  return (
    <div className="modal-overlay" onClick={onClose}> {/* 點擊背景關閉視窗 */}
      <div className="modal-content" onClick={e => e.stopPropagation()}> {/* 阻止點擊視窗內容時關閉視窗 */}
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
        <button className="modal-close-button" onClick={onClose}>X</button>
      </div>
    </div>
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
  { id: 1, title: '進行中專案 A', image: '/project-a-bg.jpg', description: '這是進行中專案 A 的詳細描述。', githubUrl: '#', projectUrl: '#' },
];

const historicalProjects = [
  { id: 3, title: '歷史專案 C', image: '/project-c-bg.jpg', description: '這是歷史專案 C 的詳細描述。', githubUrl: '#', projectUrl: '#' },
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
      </Routes>
    </Router>
  );
}

export default App;
