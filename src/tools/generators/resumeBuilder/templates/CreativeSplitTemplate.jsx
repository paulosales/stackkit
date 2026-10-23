import { Mail, Phone, MapPin, Globe, Award, Languages as LangIcon } from 'lucide-react';
import { Linkedin, Github } from '../icons';

export default function CreativeSplitTemplate({ resume, accentColor = '#4f46e5', font = 'jakarta', labels }) {
  const { personal, summary, experience, education, skills, projects, certifications, languages } = resume.data || {};

  return (
    <div className={`resume-page creative-split-template font-${font}`} style={{ '--accent': accentColor }}>
      {/* Sidebar Column */}
      <aside className="creative-sidebar">
        {personal?.photoUrl && (
          <div className="sidebar-avatar-wrap">
            <img src={personal.photoUrl} alt={personal.fullName} className="sidebar-avatar" />
          </div>
        )}

        {/* Contact Info */}
        <div className="sidebar-section">
          <h3 className="sidebar-heading">{labels.contact}</h3>
          <div className="sidebar-contact-list">
            {personal?.email && (
              <div className="sidebar-contact-item">
                <Mail size={12} className="side-icon" />
                <span>{personal.email}</span>
              </div>
            )}
            {personal?.phone && (
              <div className="sidebar-contact-item">
                <Phone size={12} className="side-icon" />
                <span>{personal.phone}</span>
              </div>
            )}
            {personal?.location && (
              <div className="sidebar-contact-item">
                <MapPin size={12} className="side-icon" />
                <span>{personal.location}</span>
              </div>
            )}
            {personal?.website && (
              <div className="sidebar-contact-item">
                <Globe size={12} className="side-icon" />
                <span>{personal.website.replace(/^https?:\/\//, '')}</span>
              </div>
            )}
            {personal?.linkedin && (
              <div className="sidebar-contact-item">
                <Linkedin size={12} className="side-icon" />
                <span>{personal.linkedin.replace(/^https?:\/\/(?:www\.)?linkedin\.com\/in\//, 'in/')}</span>
              </div>
            )}
            {personal?.github && (
              <div className="sidebar-contact-item">
                <Github size={12} className="side-icon" />
                <span>{personal.github.replace(/^https?:\/\/(?:www\.)?github\.com\//, 'gh/')}</span>
              </div>
            )}
          </div>
        </div>

        {/* Skills */}
        {skills && skills.length > 0 && (
          <div className="sidebar-section">
            <h3 className="sidebar-heading">{labels.skills}</h3>
            <div className="sidebar-skills-pills">
              {skills.map(skill => (
                <span key={skill.id} className="side-skill-chip">
                  {skill.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Education in Sidebar */}
        {education && education.length > 0 && (
          <div className="sidebar-section">
            <h3 className="sidebar-heading">{labels.education}</h3>
            <div className="sidebar-edu-list">
              {education.map(edu => (
                <div key={edu.id} className="sidebar-edu-item">
                  <div className="side-edu-degree">{edu.degree}</div>
                  <div className="side-edu-inst">{edu.institution}</div>
                  <div className="side-edu-dates">{edu.startDate} – {edu.endDate}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Languages in Sidebar */}
        {languages && languages.length > 0 && (
          <div className="sidebar-section">
            <h3 className="sidebar-heading">{labels.languages}</h3>
            <div className="sidebar-lang-list">
              {languages.map(l => (
                <div key={l.id} className="side-lang-row">
                  <span className="lang-name">{l.language}</span>
                  <span className="lang-level">{l.proficiency}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Certifications in Sidebar */}
        {certifications && certifications.length > 0 && (
          <div className="sidebar-section">
            <h3 className="sidebar-heading">{labels.certifications}</h3>
            <div className="sidebar-cert-list">
              {certifications.map(c => (
                <div key={c.id} className="side-cert-item">
                  <div className="cert-title">{c.name}</div>
                  <div className="cert-org">{c.issuer} {c.date ? `(${c.date})` : ''}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </aside>

      {/* Main Content Column */}
      <main className="creative-main">
        {/* Name Header */}
        <header className="creative-header">
          <h1 className="creative-name">{personal?.fullName || 'Your Name'}</h1>
          {personal?.jobTitle && <p className="creative-job-title">{personal.jobTitle}</p>}
        </header>

        {/* Summary */}
        {summary && (
          <section className="creative-section">
            <h2 className="creative-section-title">{labels.summary}</h2>
            <p className="creative-summary-text">{summary}</p>
          </section>
        )}

        {/* Experience Timeline */}
        {experience && experience.length > 0 && (
          <section className="creative-section">
            <h2 className="creative-section-title">{labels.experience}</h2>
            <div className="creative-timeline">
              {experience.map(exp => (
                <div key={exp.id} className="timeline-entry">
                  <div className="timeline-dot" />
                  <div className="timeline-content">
                    <div className="timeline-head">
                      <div>
                        <h3 className="timeline-role">{exp.role}</h3>
                        <span className="timeline-company">{exp.company}</span>
                        {exp.location && <span className="timeline-loc">· {exp.location}</span>}
                      </div>
                      <span className="timeline-dates">
                        {exp.startDate} – {exp.current ? labels.present : exp.endDate}
                      </span>
                    </div>
                    {exp.description && <p className="timeline-desc">{exp.description}</p>}
                    {exp.bulletPoints && exp.bulletPoints.length > 0 && (
                      <ul className="timeline-bullets">
                        {exp.bulletPoints.map((bp, idx) => (
                          <li key={idx}>{bp}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Featured Projects */}
        {projects && projects.length > 0 && (
          <section className="creative-section">
            <h2 className="creative-section-title">{labels.projects}</h2>
            <div className="creative-projects-grid">
              {projects.map(proj => (
                <div key={proj.id} className="creative-project-card">
                  <div className="proj-head">
                    <span className="proj-name">{proj.name}</span>
                    {proj.role && <span className="proj-role">· {proj.role}</span>}
                  </div>
                  {proj.description && <p className="proj-desc">{proj.description}</p>}
                  {proj.techStack && proj.techStack.length > 0 && (
                    <div className="proj-techs">
                      {proj.techStack.map((t, i) => (
                        <span key={i} className="proj-tech-tag">{t}</span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
