import React from 'react';
import { Mail, Phone, MapPin, Globe, ExternalLink } from 'lucide-react';
import { Linkedin, Github } from '../icons';

export default function BoldBannerTemplate({ resume, accentColor = '#be123c', font = 'jakarta', labels }) {
  const { personal, summary, experience, education, skills, projects, certifications, languages } = resume.data || {};

  return (
    <div className={`resume-page bold-banner-template font-${font}`} style={{ '--accent': accentColor }}>
      {/* Full-width Bold Top Banner */}
      <header className="bb-banner">
        <div className="bb-banner-inner">
          <div className="bb-header-profile">
            {personal?.photoUrl && (
              <img src={personal.photoUrl} alt={personal.fullName} className="bb-avatar" />
            )}
            <div className="bb-names">
              <h1 className="bb-name">{personal?.fullName || 'Your Name'}</h1>
              {personal?.jobTitle && <p className="bb-title">{personal.jobTitle}</p>}
            </div>
          </div>

          {/* Contact Bar */}
          <div className="bb-contacts">
            {personal?.email && (
              <span className="bb-contact-pill">
                <Mail size={11} />
                {personal.email}
              </span>
            )}
            {personal?.phone && (
              <span className="bb-contact-pill">
                <Phone size={11} />
                {personal.phone}
              </span>
            )}
            {personal?.location && (
              <span className="bb-contact-pill">
                <MapPin size={11} />
                {personal.location}
              </span>
            )}
            {personal?.website && (
              <span className="bb-contact-pill">
                <Globe size={11} />
                {personal.website.replace(/^https?:\/\//, '')}
              </span>
            )}
            {personal?.linkedin && (
              <span className="bb-contact-pill">
                <Linkedin size={11} />
                {personal.linkedin.replace(/^https?:\/\/(?:www\.)?linkedin\.com\/in\//, 'in/')}
              </span>
            )}
            {personal?.github && (
              <span className="bb-contact-pill">
                <Github size={11} />
                {personal.github.replace(/^https?:\/\/(?:www\.)?github\.com\//, 'gh/')}
              </span>
            )}
          </div>
        </div>
      </header>

      {/* Body Content */}
      <div className="bb-body">
        {/* Summary */}
        {summary && (
          <section className="bb-section">
            <h2 className="bb-sec-title">{labels.summary}</h2>
            <p className="bb-summary-text">{summary}</p>
          </section>
        )}

        {/* Experience */}
        {experience && experience.length > 0 && (
          <section className="bb-section">
            <h2 className="bb-sec-title">{labels.experience}</h2>
            <div className="bb-items-list">
              {experience.map(item => (
                <div key={item.id} className="bb-item">
                  <div className="bb-item-top">
                    <div>
                      <h3 className="bb-role">{item.role}</h3>
                      <span className="bb-company">{item.company}</span>
                      {item.location && <span className="bb-loc"> · {item.location}</span>}
                    </div>
                    <span className="bb-date">
                      {item.startDate} – {item.current ? labels.present : item.endDate}
                    </span>
                  </div>
                  {item.description && <p className="bb-item-desc">{item.description}</p>}
                  {item.bulletPoints && item.bulletPoints.length > 0 && (
                    <ul className="bb-bullets">
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
          <section className="bb-section">
            <h2 className="bb-sec-title">{labels.projects}</h2>
            <div className="bb-projects-grid">
              {projects.map(proj => (
                <div key={proj.id} className="bb-proj-card">
                  <div className="bb-item-top">
                    <span className="bb-role">{proj.name}</span>
                    {proj.url && (
                      <span className="bb-link">
                        <ExternalLink size={10} />
                        {proj.url.replace(/^https?:\/\//, '')}
                      </span>
                    )}
                  </div>
                  {proj.techStack && proj.techStack.length > 0 && (
                    <div className="bb-tech-chips">
                      {proj.techStack.map((tech, i) => (
                        <span key={i} className="bb-tech-chip">{tech}</span>
                      ))}
                    </div>
                  )}
                  {proj.description && <p className="bb-item-desc">{proj.description}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Dual Grid: Education & Skills */}
        <div className="bb-dual-grid">
          {education && education.length > 0 && (
            <section className="bb-section">
              <h2 className="bb-sec-title">{labels.education}</h2>
              <div className="bb-items-list">
                {education.map(edu => (
                  <div key={edu.id} className="bb-item bb-subitem">
                    <div className="bb-item-top">
                      <span className="bb-role">{edu.degree}</span>
                      <span className="bb-date">{edu.startDate && `${edu.startDate} – `}{edu.endDate}</span>
                    </div>
                    <div className="bb-company">{edu.institution}</div>
                    {edu.gpa && <div className="bb-loc">{edu.gpa}</div>}
                  </div>
                ))}
              </div>
            </section>
          )}

          {skills && skills.length > 0 && (
            <section className="bb-section">
              <h2 className="bb-sec-title">{labels.skills}</h2>
              <div className="bb-skills-wrap">
                {skills.map(sk => (
                  <span key={sk.id} className="bb-skill-pill">
                    {sk.name}
                  </span>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Additional: Certifications & Languages */}
        {((certifications && certifications.length > 0) || (languages && languages.length > 0)) && (
          <section className="bb-section">
            <h2 className="bb-sec-title">
              {certifications?.length > 0 && languages?.length > 0
                ? `${labels.certifications} & ${labels.languages}`
                : certifications?.length > 0
                  ? labels.certifications
                  : labels.languages}
            </h2>
            <div className="bb-dual-grid">
              {certifications && certifications.map(cert => (
                <div key={cert.id} className="bb-item bb-subitem">
                  <div className="bb-role">{cert.name}</div>
                  <div className="bb-company">{cert.issuer} {cert.date ? `(${cert.date})` : ''}</div>
                </div>
              ))}
              {languages && languages.map(l => (
                <div key={l.id} className="bb-item bb-subitem">
                  <span className="bb-role">{l.language}: </span>
                  <span className="bb-company">{l.proficiency}</span>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
