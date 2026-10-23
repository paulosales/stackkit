import React from 'react';
import { Mail, Phone, MapPin, Globe, Briefcase, GraduationCap, Wrench, FolderGit2, Award, Languages as LangIcon, ExternalLink } from 'lucide-react';
import { Linkedin, Github } from '../icons';

export default function InfographicTemplate({ resume, accentColor = '#8b5cf6', font = 'jakarta', labels }) {
  const { personal, summary, experience, education, skills, projects, certifications, languages } = resume.data || {};

  return (
    <div className={`resume-page infographic-template font-${font}`} style={{ '--accent': accentColor }}>
      {/* Visual Header Card */}
      <header className="info-header-card">
        <div className="info-header-top">
          {personal?.photoUrl && (
            <img src={personal.photoUrl} alt={personal.fullName} className="info-avatar" />
          )}
          <div className="info-header-titles">
            <h1 className="info-name">{personal?.fullName || 'Your Name'}</h1>
            {personal?.jobTitle && <div className="info-badge-role">{personal.jobTitle}</div>}
          </div>
        </div>

        {/* Contact Pills */}
        <div className="info-contacts-wrap">
          {personal?.email && (
            <span className="info-contact-pill">
              <Mail size={11} className="info-pill-icon" />
              {personal.email}
            </span>
          )}
          {personal?.phone && (
            <span className="info-contact-pill">
              <Phone size={11} className="info-pill-icon" />
              {personal.phone}
            </span>
          )}
          {personal?.location && (
            <span className="info-contact-pill">
              <MapPin size={11} className="info-pill-icon" />
              {personal.location}
            </span>
          )}
          {personal?.website && (
            <span className="info-contact-pill">
              <Globe size={11} className="info-pill-icon" />
              {personal.website.replace(/^https?:\/\//, '')}
            </span>
          )}
          {personal?.linkedin && (
            <span className="info-contact-pill">
              <Linkedin size={11} className="info-pill-icon" />
              {personal.linkedin.replace(/^https?:\/\/(?:www\.)?linkedin\.com\/in\//, 'in/')}
            </span>
          )}
          {personal?.github && (
            <span className="info-contact-pill">
              <Github size={11} className="info-pill-icon" />
              {personal.github.replace(/^https?:\/\/(?:www\.)?github\.com\//, 'gh/')}
            </span>
          )}
        </div>
      </header>

      {/* Summary Card */}
      {summary && (
        <section className="info-section info-card-bg">
          <p className="info-summary-p">{summary}</p>
        </section>
      )}

      {/* Experience */}
      {experience && experience.length > 0 && (
        <section className="info-section">
          <div className="info-sec-header">
            <div className="info-sec-icon-wrap">
              <Briefcase size={14} />
            </div>
            <h2 className="info-sec-title">{labels.experience}</h2>
          </div>
          <div className="info-cards-list">
            {experience.map(item => (
              <div key={item.id} className="info-item-card">
                <div className="info-item-header">
                  <div>
                    <h3 className="info-role">{item.role}</h3>
                    <div className="info-company">
                      {item.company}
                      {item.location && <span className="info-loc"> · {item.location}</span>}
                    </div>
                  </div>
                  <span className="info-date-badge">
                    {item.startDate} — {item.current ? labels.present : item.endDate}
                  </span>
                </div>
                {item.description && <p className="info-item-desc">{item.description}</p>}
                {item.bulletPoints && item.bulletPoints.length > 0 && (
                  <ul className="info-bullets">
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
        <section className="info-section">
          <div className="info-sec-header">
            <div className="info-sec-icon-wrap">
              <FolderGit2 size={14} />
            </div>
            <h2 className="info-sec-title">{labels.projects}</h2>
          </div>
          <div className="info-projects-grid">
            {projects.map(proj => (
              <div key={proj.id} className="info-proj-card">
                <div className="info-proj-top">
                  <span className="info-proj-name">{proj.name}</span>
                  {proj.url && (
                    <span className="info-proj-link">
                      <ExternalLink size={11} />
                      {proj.url.replace(/^https?:\/\//, '')}
                    </span>
                  )}
                </div>
                {proj.techStack && proj.techStack.length > 0 && (
                  <div className="info-tech-chips">
                    {proj.techStack.map((tech, i) => (
                      <span key={i} className="info-tech-chip">{tech}</span>
                    ))}
                  </div>
                )}
                {proj.description && <p className="info-proj-desc">{proj.description}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills Grid */}
      {skills && skills.length > 0 && (
        <section className="info-section">
          <div className="info-sec-header">
            <div className="info-sec-icon-wrap">
              <Wrench size={14} />
            </div>
            <h2 className="info-sec-title">{labels.skills}</h2>
          </div>
          <div className="info-skills-wrap">
            {skills.map(sk => (
              <div key={sk.id} className="info-skill-card">
                <span className="info-sk-name">{sk.name}</span>
                <span className="info-sk-dot" />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education & Additional Grid */}
      <div className="info-dual-grid">
        {education && education.length > 0 && (
          <section className="info-section">
            <div className="info-sec-header">
              <div className="info-sec-icon-wrap">
                <GraduationCap size={14} />
              </div>
              <h2 className="info-sec-title">{labels.education}</h2>
            </div>
            <div className="info-subitems">
              {education.map(edu => (
                <div key={edu.id} className="info-subitem-card">
                  <div className="info-sub-top">
                    <span className="info-sub-title">{edu.degree}</span>
                    <span className="info-sub-date">{edu.startDate && `${edu.startDate} – `}{edu.endDate}</span>
                  </div>
                  <div className="info-sub-inst">{edu.institution}</div>
                  {edu.gpa && <div className="info-sub-meta">{edu.gpa}</div>}
                </div>
              ))}
            </div>
          </section>
        )}

        {((certifications && certifications.length > 0) || (languages && languages.length > 0)) && (
          <section className="info-section">
            <div className="info-sec-header">
              <div className="info-sec-icon-wrap">
                <Award size={14} />
              </div>
              <h2 className="info-sec-title">
                {certifications?.length > 0 && languages?.length > 0
                  ? `${labels.certifications} & ${labels.languages}`
                  : certifications?.length > 0
                    ? labels.certifications
                    : labels.languages}
              </h2>
            </div>
            <div className="info-subitems">
              {certifications && certifications.map(cert => (
                <div key={cert.id} className="info-subitem-card">
                  <div className="info-sub-top">
                    <span className="info-sub-title">{cert.name}</span>
                    {cert.date && <span className="info-sub-date">{cert.date}</span>}
                  </div>
                  <div className="info-sub-inst">{cert.issuer}</div>
                </div>
              ))}
              {languages && languages.map(l => (
                <div key={l.id} className="info-subitem-card">
                  <div className="info-sub-top">
                    <span className="info-sub-title">{l.language}</span>
                    <span className="info-sub-date">{l.proficiency}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
