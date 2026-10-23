import React from 'react';

export default function ElegantLuxeTemplate({ resume, accentColor = '#78350f', font = 'merriweather', labels }) {
  const { personal, summary, experience, education, skills, projects, certifications, languages } = resume.data || {};

  return (
    <div className={`resume-page elegant-luxe-template font-${font}`} style={{ '--accent': accentColor }}>
      {/* Ornate Frame Border */}
      <div className="luxe-border-frame">
        {/* Header */}
        <header className="luxe-header">
          {personal?.photoUrl && (
            <div className="luxe-avatar-wrap">
              <img src={personal.photoUrl} alt={personal.fullName} className="luxe-avatar" />
            </div>
          )}
          <h1 className="luxe-name">{personal?.fullName || 'Your Name'}</h1>
          {personal?.jobTitle && <p className="luxe-job-title">{personal.jobTitle}</p>}

          <div className="luxe-double-rule" />

          {/* Contact Bar */}
          <div className="luxe-contact-row">
            {[
              personal?.location,
              personal?.phone,
              personal?.email,
              personal?.linkedin && `linkedin.com/in/${personal.linkedin.replace(/^https?:\/\/(?:www\.)?linkedin\.com\/in\//, '')}`,
              personal?.website && personal.website.replace(/^https?:\/\//, ''),
              personal?.github && `github.com/${personal.github.replace(/^https?:\/\/(?:www\.)?github\.com\//, '')}`
            ].filter(Boolean).map((item, idx, arr) => (
              <React.Fragment key={idx}>
                <span className="luxe-contact-item">{item}</span>
                {idx < arr.length - 1 && <span className="luxe-sep">♦</span>}
              </React.Fragment>
            ))}
          </div>
        </header>

        {/* Summary */}
        {summary && (
          <section className="luxe-section">
            <h2 className="luxe-section-title">
              <span className="luxe-title-text">{labels.summary}</span>
            </h2>
            <div className="luxe-summary-box">
              <p className="luxe-summary-quote">{summary}</p>
            </div>
          </section>
        )}

        {/* Experience */}
        {experience && experience.length > 0 && (
          <section className="luxe-section">
            <h2 className="luxe-section-title">
              <span className="luxe-title-text">{labels.experience}</span>
            </h2>
            <div className="luxe-items">
              {experience.map(item => (
                <div key={item.id} className="luxe-entry">
                  <div className="luxe-entry-row-1">
                    <span className="luxe-role">{item.role}</span>
                    <span className="luxe-date">{item.startDate} – {item.current ? labels.present : item.endDate}</span>
                  </div>
                  <div className="luxe-entry-row-2">
                    <span className="luxe-company">{item.company}</span>
                    {item.location && <span className="luxe-location"> · {item.location}</span>}
                  </div>
                  {item.description && <p className="luxe-desc">{item.description}</p>}
                  {item.bulletPoints && item.bulletPoints.length > 0 && (
                    <ul className="luxe-bullets">
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
          <section className="luxe-section">
            <h2 className="luxe-section-title">
              <span className="luxe-title-text">{labels.projects}</span>
            </h2>
            <div className="luxe-items">
              {projects.map(proj => (
                <div key={proj.id} className="luxe-entry">
                  <div className="luxe-entry-row-1">
                    <span className="luxe-role">{proj.name}</span>
                    {proj.url && <span className="luxe-link">{proj.url.replace(/^https?:\/\//, '')}</span>}
                  </div>
                  {proj.techStack && proj.techStack.length > 0 && (
                    <div className="luxe-tech-line">
                      <em>{proj.techStack.join(' · ')}</em>
                    </div>
                  )}
                  {proj.description && <p className="luxe-desc">{proj.description}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {education && education.length > 0 && (
          <section className="luxe-section">
            <h2 className="luxe-section-title">
              <span className="luxe-title-text">{labels.education}</span>
            </h2>
            <div className="luxe-items">
              {education.map(edu => (
                <div key={edu.id} className="luxe-entry">
                  <div className="luxe-entry-row-1">
                    <span className="luxe-role">{edu.degree}</span>
                    <span className="luxe-date">{edu.startDate && `${edu.startDate} – `}{edu.endDate}</span>
                  </div>
                  <div className="luxe-entry-row-2">
                    <span className="luxe-company">{edu.institution}</span>
                    {edu.gpa && <span className="luxe-gpa"> — {edu.gpa}</span>}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills */}
        {skills && skills.length > 0 && (
          <section className="luxe-section">
            <h2 className="luxe-section-title">
              <span className="luxe-title-text">{labels.skills}</span>
            </h2>
            <div className="luxe-skills-list">
              {skills.map(sk => (
                <span key={sk.id} className="luxe-skill-tag">
                  {sk.name}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Certifications & Languages */}
        {((certifications && certifications.length > 0) || (languages && languages.length > 0)) && (
          <section className="luxe-section">
            <h2 className="luxe-section-title">
              <span className="luxe-title-text">
                {certifications?.length > 0 && languages?.length > 0
                  ? `${labels.certifications} & ${labels.languages}`
                  : certifications?.length > 0
                    ? labels.certifications
                    : labels.languages}
              </span>
            </h2>
            <div className="luxe-dual-grid">
              {certifications && certifications.map(cert => (
                <div key={cert.id} className="luxe-entry-row-2">
                  <strong className="luxe-subname">{cert.name}</strong>
                  <span className="luxe-location"> — {cert.issuer} {cert.date ? `(${cert.date})` : ''}</span>
                </div>
              ))}
              {languages && languages.map(l => (
                <div key={l.id} className="luxe-entry-row-2">
                  <strong className="luxe-subname">{l.language}:</strong>
                  <span className="luxe-location"> {l.proficiency}</span>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
