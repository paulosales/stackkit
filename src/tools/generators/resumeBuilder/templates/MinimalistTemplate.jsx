import React from 'react';
import { Mail, Phone, MapPin, Globe, ExternalLink } from 'lucide-react';
import { Linkedin, Github } from '../icons';

export default function MinimalistTemplate({ resume, accentColor = '#0f172a', font = 'inter', labels }) {
  const { personal, summary, experience, education, skills, projects, certifications, languages } = resume.data || {};

  return (
    <div className={`resume-page minimalist-template font-${font}`} style={{ '--accent': accentColor }}>
      {/* Header */}
      <header className="minimalist-header">
        <div className="minimalist-header-main">
          {personal?.photoUrl && (
            <img src={personal.photoUrl} alt={personal.fullName} className="minimalist-avatar" />
          )}
          <div>
            <h1 className="minimalist-name">{personal?.fullName || 'Your Name'}</h1>
            {personal?.jobTitle && <p className="minimalist-title">{personal.jobTitle}</p>}
          </div>
        </div>

        {/* Contact info */}
        <div className="minimalist-contacts">
          {personal?.email && (
            <span className="minimalist-contact-item">
              <Mail size={11} className="min-icon" />
              {personal.email}
            </span>
          )}
          {personal?.phone && (
            <span className="minimalist-contact-item">
              <Phone size={11} className="min-icon" />
              {personal.phone}
            </span>
          )}
          {personal?.location && (
            <span className="minimalist-contact-item">
              <MapPin size={11} className="min-icon" />
              {personal.location}
            </span>
          )}
          {personal?.website && (
            <span className="minimalist-contact-item">
              <Globe size={11} className="min-icon" />
              {personal.website.replace(/^https?:\/\//, '')}
            </span>
          )}
          {personal?.linkedin && (
            <span className="minimalist-contact-item">
              <Linkedin size={11} className="min-icon" />
              {personal.linkedin.replace(/^https?:\/\/(?:www\.)?linkedin\.com\/in\//, 'in/')}
            </span>
          )}
          {personal?.github && (
            <span className="minimalist-contact-item">
              <Github size={11} className="min-icon" />
              {personal.github.replace(/^https?:\/\/(?:www\.)?github\.com\//, 'gh/')}
            </span>
          )}
        </div>
      </header>

      <div className="minimalist-divider" />

      {/* Summary */}
      {summary && (
        <div className="minimalist-row">
          <div className="minimalist-col-side">
            <span className="minimalist-section-tag">{labels.summary}</span>
          </div>
          <div className="minimalist-col-main">
            <p className="minimalist-summary-text">{summary}</p>
          </div>
        </div>
      )}

      {/* Experience */}
      {experience && experience.length > 0 && (
        <div className="minimalist-row">
          <div className="minimalist-col-side">
            <span className="minimalist-section-tag">{labels.experience}</span>
          </div>
          <div className="minimalist-col-main">
            <div className="minimalist-items-list">
              {experience.map(item => (
                <div key={item.id} className="minimalist-item">
                  <div className="minimalist-item-top">
                    <div className="minimalist-role-company">
                      <span className="minimalist-role">{item.role}</span>
                      <span className="minimalist-company"> @ {item.company}</span>
                      {item.location && <span className="minimalist-meta-loc"> · {item.location}</span>}
                    </div>
                    <span className="minimalist-date">
                      {item.startDate} — {item.current ? labels.present : item.endDate}
                    </span>
                  </div>
                  {item.description && <p className="minimalist-item-desc">{item.description}</p>}
                  {item.bulletPoints && item.bulletPoints.length > 0 && (
                    <ul className="minimalist-bullets">
                      {item.bulletPoints.map((bp, i) => (
                        <li key={i}>{bp}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Projects */}
      {projects && projects.length > 0 && (
        <div className="minimalist-row">
          <div className="minimalist-col-side">
            <span className="minimalist-section-tag">{labels.projects}</span>
          </div>
          <div className="minimalist-col-main">
            <div className="minimalist-items-list">
              {projects.map(proj => (
                <div key={proj.id} className="minimalist-item">
                  <div className="minimalist-item-top">
                    <span className="minimalist-role">{proj.name}</span>
                    {proj.url && (
                      <span className="minimalist-link">
                        <ExternalLink size={10} />
                        {proj.url.replace(/^https?:\/\//, '')}
                      </span>
                    )}
                  </div>
                  {proj.techStack && proj.techStack.length > 0 && (
                    <div className="minimalist-tech-chips">
                      {proj.techStack.map((tech, i) => (
                        <span key={i} className="minimalist-tech-chip">{tech}</span>
                      ))}
                    </div>
                  )}
                  {proj.description && <p className="minimalist-item-desc">{proj.description}</p>}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Education */}
      {education && education.length > 0 && (
        <div className="minimalist-row">
          <div className="minimalist-col-side">
            <span className="minimalist-section-tag">{labels.education}</span>
          </div>
          <div className="minimalist-col-main">
            <div className="minimalist-items-list">
              {education.map(edu => (
                <div key={edu.id} className="minimalist-item">
                  <div className="minimalist-item-top">
                    <div>
                      <span className="minimalist-role">{edu.degree}</span>
                      <span className="minimalist-company"> · {edu.institution}</span>
                    </div>
                    <span className="minimalist-date">
                      {edu.startDate && `${edu.startDate} — `}{edu.endDate}
                    </span>
                  </div>
                  {edu.gpa && <p className="minimalist-item-desc">{edu.gpa}</p>}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Skills */}
      {skills && skills.length > 0 && (
        <div className="minimalist-row">
          <div className="minimalist-col-side">
            <span className="minimalist-section-tag">{labels.skills}</span>
          </div>
          <div className="minimalist-col-main">
            <div className="minimalist-skills-grid">
              {skills.map(sk => (
                <span key={sk.id} className="minimalist-skill-pill">
                  {sk.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Additional (Certifications & Languages) */}
      {((certifications && certifications.length > 0) || (languages && languages.length > 0)) && (
        <div className="minimalist-row">
          <div className="minimalist-col-side">
            <span className="minimalist-section-tag">
              {certifications?.length > 0 && languages?.length > 0
                ? `${labels.certifications} & ${labels.languages}`
                : certifications?.length > 0
                  ? labels.certifications
                  : labels.languages}
            </span>
          </div>
          <div className="minimalist-col-main">
            <div className="minimalist-dual-col">
              {certifications && certifications.length > 0 && (
                <div>
                  <h4 className="minimalist-subtag">{labels.certifications}</h4>
                  {certifications.map(cert => (
                    <div key={cert.id} className="minimalist-subitem">
                      <span className="min-subname">{cert.name}</span>
                      <span className="min-submeta">{cert.issuer} {cert.date ? `(${cert.date})` : ''}</span>
                    </div>
                  ))}
                </div>
              )}
              {languages && languages.length > 0 && (
                <div>
                  <h4 className="minimalist-subtag">{labels.languages}</h4>
                  {languages.map(l => (
                    <div key={l.id} className="minimalist-subitem">
                      <span className="min-subname">{l.language}</span>
                      <span className="min-submeta">{l.proficiency}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
