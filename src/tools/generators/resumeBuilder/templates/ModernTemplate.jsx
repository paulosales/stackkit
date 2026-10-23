import { Mail, Phone, MapPin, Globe } from 'lucide-react';
import { Linkedin, Github } from '../icons';

export default function ModernTemplate({ resume, accentColor = '#0284c7', font = 'inter', labels }) {
  const { personal, summary, experience, education, skills, projects, certifications, languages } = resume.data || {};

  return (
    <div className={`resume-page modern-template font-${font}`} style={{ '--accent': accentColor }}>
      {/* Header */}
      <header className="resume-header">
        <div className="header-top">
          {personal?.photoUrl && (
            <img src={personal.photoUrl} alt={personal.fullName} className="resume-avatar" />
          )}
          <div className="header-titles">
            <h1 className="resume-name">{personal?.fullName || 'Your Name'}</h1>
            {personal?.jobTitle && <p className="resume-job-title">{personal.jobTitle}</p>}
          </div>
        </div>

        {/* Contact Strip */}
        <div className="resume-contact-bar">
          {personal?.email && (
            <div className="contact-item">
              <Mail size={12} className="contact-icon" />
              <span>{personal.email}</span>
            </div>
          )}
          {personal?.phone && (
            <div className="contact-item">
              <Phone size={12} className="contact-icon" />
              <span>{personal.phone}</span>
            </div>
          )}
          {personal?.location && (
            <div className="contact-item">
              <MapPin size={12} className="contact-icon" />
              <span>{personal.location}</span>
            </div>
          )}
          {personal?.website && (
            <div className="contact-item">
              <Globe size={12} className="contact-icon" />
              <span>{personal.website.replace(/^https?:\/\//, '')}</span>
            </div>
          )}
          {personal?.linkedin && (
            <div className="contact-item">
              <Linkedin size={12} className="contact-icon" />
              <span>{personal.linkedin.replace(/^https?:\/\/(?:www\.)?linkedin\.com\/in\//, 'in/')}</span>
            </div>
          )}
          {personal?.github && (
            <div className="contact-item">
              <Github size={12} className="contact-icon" />
              <span>{personal.github.replace(/^https?:\/\/(?:www\.)?github\.com\//, 'gh/')}</span>
            </div>
          )}
        </div>
      </header>

      {/* Summary */}
      {summary && (
        <section className="resume-section">
          <h2 className="section-title">{labels.summary}</h2>
          <p className="summary-text">{summary}</p>
        </section>
      )}

      {/* Experience */}
      {experience && experience.length > 0 && (
        <section className="resume-section">
          <h2 className="section-title">{labels.experience}</h2>
          <div className="items-list">
            {experience.map(item => (
              <div key={item.id} className="resume-item">
                <div className="item-header">
                  <div className="item-title-group">
                    <h3 className="item-role">{item.role}</h3>
                    <span className="item-company">{item.company}</span>
                    {item.location && <span className="item-location">· {item.location}</span>}
                  </div>
                  <span className="item-date">
                    {item.startDate} — {item.current ? labels.present : item.endDate}
                  </span>
                </div>
                {item.description && <p className="item-description">{item.description}</p>}
                {item.bulletPoints && item.bulletPoints.length > 0 && (
                  <ul className="item-bullets">
                    {item.bulletPoints.map((bp, i) => (
                      <li key={i}>{bp}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {education && education.length > 0 && (
        <section className="resume-section">
          <h2 className="section-title">{labels.education}</h2>
          <div className="items-list">
            {education.map(item => (
              <div key={item.id} className="resume-item">
                <div className="item-header">
                  <div className="item-title-group">
                    <h3 className="item-degree">{item.degree}</h3>
                    <span className="item-institution">{item.institution}</span>
                    {item.location && <span className="item-location">· {item.location}</span>}
                  </div>
                  <span className="item-date">{item.startDate} — {item.endDate}</span>
                </div>
                {item.gpa && <p className="item-gpa">{item.gpa}</p>}
                {item.details && <p className="item-details">{item.details}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {skills && skills.length > 0 && (
        <section className="resume-section">
          <h2 className="section-title">{labels.skills}</h2>
          <div className="skills-tags-wrap">
            {skills.map(skill => (
              <span key={skill.id} className="skill-pill">
                {skill.name}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {projects && projects.length > 0 && (
        <section className="resume-section">
          <h2 className="section-title">{labels.projects}</h2>
          <div className="items-list">
            {projects.map(proj => (
              <div key={proj.id} className="resume-item">
                <div className="item-header">
                  <div className="item-title-group">
                    <h3 className="item-project-name">{proj.name}</h3>
                    {proj.role && <span className="item-project-role">· {proj.role}</span>}
                  </div>
                  {proj.url && (
                    <span className="item-link">
                      {proj.url.replace(/^https?:\/\//, '')}
                    </span>
                  )}
                </div>
                {proj.description && <p className="item-description">{proj.description}</p>}
                {proj.techStack && proj.techStack.length > 0 && (
                  <div className="tech-stack-pills">
                    {proj.techStack.map((tech, idx) => (
                      <span key={idx} className="tech-mini-pill">{tech}</span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Certifications & Languages Dual Row */}
      <div className="resume-dual-grid">
        {certifications && certifications.length > 0 && (
          <section className="resume-section half-col">
            <h2 className="section-title">{labels.certifications}</h2>
            <div className="items-list compact">
              {certifications.map(cert => (
                <div key={cert.id} className="mini-item">
                  <span className="mini-item-name">{cert.name}</span>
                  <span className="mini-item-meta">{cert.issuer} {cert.date ? `(${cert.date})` : ''}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {languages && languages.length > 0 && (
          <section className="resume-section half-col">
            <h2 className="section-title">{labels.languages}</h2>
            <div className="items-list compact">
              {languages.map(lang => (
                <div key={lang.id} className="mini-item">
                  <span className="mini-item-name">{lang.language}</span>
                  <span className="mini-item-meta">{lang.proficiency}</span>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
