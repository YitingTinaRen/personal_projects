import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../App.css';

function TimelineSection() {
    return (
        <section className="timeline-section">
            <h2 className="section-title">經歷</h2>
            <div className="timeline">
                <div className="timeline-item">
                    <div className="timeline-content">
                        <div className="timeline-logo">
                            <img src="/about_me/farreaching.png" alt="farreaching" />
                        </div>
                        <div className="timeline-info">
                            <h3>2023-2025</h3>
                            <h4>杏遠科技有限公司&nbsp;&nbsp;&nbsp;&nbsp;Python Developer</h4>
                            <ul>
                                <li>工作亮點描述 1</li>
                                <li>工作亮點描述 2</li>
                                <li>工作亮點描述 3</li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="timeline-item">
                    <div className="timeline-content">
                        <div className="timeline-logo">
                            <img src="/about_me/gap_year.jpeg" alt="gap_year" />
                        </div>
                        <div className="timeline-info">
                            <h3>2022-2023</h3>
                            <h4>Gap year</h4>
                            <ul>
                                <li>工作亮點描述 1</li>
                                <li>工作亮點描述 2</li>
                                <li>工作亮點描述 3</li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="timeline-item">
                    <div className="timeline-content">
                        <div className="timeline-logo">
                            <img src="/about_me/asml.jpeg" alt="asml" />
                        </div>
                        <div className="timeline-info">
                            <h3>2018-2022</h3>
                            <h4>ASML&nbsp;&nbsp;&nbsp;&nbsp;Design Engineer</h4>
                            <ul>
                                <li>工作亮點描述 1</li>
                                <li>工作亮點描述 2</li>
                                <li>工作亮點描述 3</li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="timeline-item">
                    <div className="timeline-content">
                        <div className="timeline-logo">
                            <img src="/about_me/garmin_logo.webp" alt="garmin" />
                        </div>
                        <div className="timeline-info">
                            <h3>2016-2018</h3>
                            <h4>Garmin&nbsp;&nbsp;&nbsp;&nbsp;Optical Engineer</h4>
                            <ul>
                                <li>工作亮點描述 1</li>
                                <li>工作亮點描述 2</li>
                                <li>工作亮點描述 3</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

function SkillsSection() {
    return (
        <section className="skills-section">
            <h2 className="section-title">專業技能</h2>
            <div className="skills-container">
                <div className="skill-category">
                    <h3>前端開發 <span className="skill-tag">Frontend</span></h3>
                    <div className="skill-tags">
                        <span>React</span>
                        <span>JavaScript</span>
                        <span>HTML5</span>
                        <span>CSS3</span>
                    </div>
                </div>
                <div className="skill-category">
                    <h3>後端開發 <span className="skill-tag">Backend</span></h3>
                    <div className="skill-tags">
                        <span>Python</span>
                        <span>Django</span>
                        <span>REST API</span>
                        <span>SQL</span>
                    </div>
                </div>
                <div className="skill-category">
                    <h3>其他技能 <span className="skill-tag">Others</span></h3>
                    <div className="skill-tags">
                        <span>Git</span>
                        <span>Docker</span>
                        <span>Agile</span>
                        <span>UI/UX</span>
                    </div>
                </div>
            </div>
        </section>
    );
}

function EducationSection() {
    return (
        <section className="education-section">
            <h2 className="section-title">學歷背景</h2>
            <div className="education-container">
                <div className="education-item">
                    <div className="education-image">
                        <img src="/about_me/university.jpeg" alt="學校1" />
                    </div>
                    <div className="education-info">
                        <h3>國立清華大學</h3>
                        <p className="degree">Master of Physics</p>
                        <p className="year">2014 - 2016</p>
                        <p className="description">學校描述</p>
                        <p className="degree">Bachelor of Physics</p>
                        <p className="year">2010 - 2014</p>
                        <p className="description">學校描述</p>
                    </div>
                </div>
            </div>
        </section>
    );
}

function About() {
    return (
        <div className="app">
            <Header title="關於我" />
            <main className="main-content about-content">
                <TimelineSection />
                <SkillsSection />
                <EducationSection />
            </main>
            <Footer />
        </div>
    );
}

export default About; 