import React from 'react';
import { Mail, Phone, MapPin, Globe, Terminal, Code2, ExternalLink } from 'lucide-react';
import { Linkedin, Github } from '../icons';

export default function CompactTechTemplate({ resume, accentColor = '#0284c7', font = 'inter', labels }) {
  const { personal, summary, experience, education, skills, projects, certifications, languages } = resume.data || {};

  return (
    <div className={`resume-page compact-tech-template font-${font}`} style={{ '--accent': accentColor }}>
      {/* Header */}
      <header className="ct-header">
        <div className="ct-header-left">
          {personal?.photoUrl && (
            <img src={personal.photoUrl} alt={personal.fullName} className="ct-avatar" />
          )}
          <div>
            <div className="ct-name-row">
              <h1 className="ct-name">{personal?.fullName || 'Your Name'}</h1>
              <span className="ct-tech-badge">Dev // Stack</span>
            </div>
            {personal?.jobTitle && <div className="ct-title">{personal.jobTitle}</div>}
          </div>
        </div>

        {/* Contact info grid */}
        <div className="ct-contact-grid">
          {personal?.email && (
            <div className="ct-contact-item">
              <Mail size={11} className="ct-icon" />
              <span>{personal.email}</span>
            </div>
          )}
          {personal?.phone && (
            <div className="ct-contact-item">
              <Phone size={11} className="ct-icon" />
              <span>{personal.phone}</span>
            </div>
          )}
          {personal?.location && (
            <div className="ct-contact-item">
              <MapPin size={11} className="ct-icon" />
              <span>{personal.location}</span>
            </div>
          )}
          {personal?.github && (
            <div className="ct-contact-item">
              <Github size={11} className="ct-icon" />
              <span>{personal.github.replace(/^https?:\/\/(?:www\.)?github\.com\//, 'gh/')}</span>
            </div>
          )}
          {personal?.linkedin && (
            <div className="ct-contact-item">
              <Linkedin size={11} className="ct-icon" />
              <span>{personal.linkedin.replace(/^https?:\/\/(?:www\.)?linkedin\.com\/in\//, 'in/')}</span>
            </div>
          )}
          {personal?.website && (
            <div className="ct-contact-item">
              <Globe size={11} className="ct-icon" />
              <span>{personal.website.replace(/^https?:\/\//, '')}</span>
            </div>
          )}
        </div>
      </header>

      {/* Summary */}
      {summary && (
        <section className="ct-section ct-summary-box">
          <div className="ct-terminal-bar">
            <span className="ct-dot red" />
            <span className="ct-dot yellow" />
            <span className="ct-dot green" />
            <span className="ct-term-label">about.md</span>
          </div>
          <p className="ct-summary-text">{summary}</p>
        </section>
      )}

      {/* Technical Skills Header */}
      {skills && skills.length > 0 && (
        <section className="ct-section">
          <div className="ct-section-heading">
            <Code2 size={13} className="ct-sec-icon" />
            <span className="ct-sec-title">{labels.skills}</span>
            <div className="ct-sec-line" />
          </div>
          <div className="ct-skills-container">
            {skills.map(sk => (
              <span key={sk.id} className="ct-skill-tag">
                <span className="ct-skill-dot" />
                {sk.name}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Experience */}
      {experience && experience.length > 0 && (
        <section className="ct-section">
          <div className="ct-section-heading">
            <Terminal size={13} className="ct-sec-icon" />
            <span className="ct-sec-title">{labels.experience}</span>
            <div className="ct-sec-line" />
          </div>
          <div className="ct-items-list">
            {experience.map(item => (
              <div key={item.id} className="ct-item">
                <div className="ct-item-header">
                  <div className="ct-item-title-box">
                    <span className="ct-item-role">{item.role}</span>
                    <span className="ct-item-at">@</span>
                    <span className="ct-item-company">{item.company}</span>
                    {item.location && <span className="ct-item-loc">[{item.location}]</span>}
                  </div>
                  <span className="ct-item-date">
                    {item.startDate} → {item.current ? labels.present : item.endDate}
                  </span>
                </div>
                {item.description && <p className="ct-item-desc">{item.description}</p>}
                {item.bulletPoints && item.bulletPoints.length > 0 && (
                  <ul className="ct-bullets">
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

      {/* Projects */}
      {projects && projects.length > 0 && (
        <section className="ct-section">
          <div className="ct-section-heading">
            <span className="ct-sec-title">{labels.projects}</span>
            <div className="ct-sec-line" />
          </div>
          <div className="ct-projects-grid">
            {projects.map(proj => (
              <div key={proj.id} className="ct-proj-card">
                <div className="ct-proj-header">
                  <span className="ct-proj-name">{proj.name}</span>
                  {proj.url && (
                    <span className="ct-proj-link">
                      <ExternalLink size={10} />
                      {proj.url.replace(/^https?:\/\//, '')}
                    </span>
                  )}
                </div>
                {proj.techStack && proj.techStack.length > 0 && (
                  <div className="ct-proj-chips">
                    {proj.techStack.map((tech, i) => (
                      <span key={i} className="ct-proj-chip">{tech}</span>
                    ))}
                  </div>
                )}
                {proj.description && <p className="ct-proj-desc">{proj.description}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education & Additional Row */}
      <div className="ct-dual-grid">
        {/* Education */}
        {education && education.length > 0 && (
          <section className="ct-section">
            <div className="ct-section-heading">
              <span className="ct-sec-title">{labels.education}</span>
              <div className="ct-sec-line" />
            </div>
            <div className="ct-subitems">
              {education.map(edu => (
                <div key={edu.id} className="ct-subitem">
                  <div className="ct-subitem-top">
                    <span className="ct-subitem-title">{edu.degree}</span>
                    <span className="ct-subitem-date">{edu.startDate && `${edu.startDate} – `}{edu.endDate}</span>
                  </div>
                  <div className="ct-subitem-inst">{edu.institution}</div>
                  {edu.gpa && <div className="ct-subitem-meta">{edu.gpa}</div>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Certifications & Languages */}
        {((certifications && certifications.length > 0) || (languages && languages.length > 0)) && (
          <section className="ct-section">
            <div className="ct-section-heading">
              <span className="ct-sec-title">
                {certifications?.length > 0 && languages?.length > 0
                  ? `${labels.certifications} & ${labels.languages}`
                  : certifications?.length > 0
                    ? labels.certifications
                    : labels.languages}
              </span>
              <div className="ct-sec-line" />
            </div>
            <div className="ct-subitems">
              {certifications && certifications.map(cert => (
                <div key={cert.id} className="ct-subitem">
                  <div className="ct-subitem-top">
                    <span className="ct-subitem-title">{cert.name}</span>
                    {cert.date && <span className="ct-subitem-date">{cert.date}</span>}
                  </div>
                  <div className="ct-subitem-inst">{cert.issuer}</div>
                </div>
              ))}
              {languages && languages.map(l => (
                <div key={l.id} className="ct-lang-line">
                  <span className="ct-subitem-title">{l.language}:</span>
                  <span className="ct-subitem-inst"> {l.proficiency}</span>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
