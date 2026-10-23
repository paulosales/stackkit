import React from 'react';

export default function ExecutiveTemplate({ resume, accentColor = '#1e3a8a', font = 'merriweather', labels }) {
  const { personal, summary, experience, education, skills, projects, certifications, languages } = resume.data || {};

  return (
    <div className={`resume-page executive-template font-${font}`} style={{ '--accent': accentColor }}>
      {/* Centered Formal Header */}
      <header className="executive-header">
        <h1 className="executive-name">{personal?.fullName || 'Your Name'}</h1>
        {personal?.jobTitle && <p className="executive-title">{personal.jobTitle}</p>}
        
        <div className="executive-contact-line">
          {[
            personal?.location,
            personal?.phone,
            personal?.email,
            personal?.linkedin && personal.linkedin.replace(/^https?:\/\/(?:www\.)?linkedin\.com\/in\//, 'linkedin: in/'),
            personal?.website && personal.website.replace(/^https?:\/\//, '')
          ].filter(Boolean).map((item, idx, arr) => (
            <React.Fragment key={idx}>
              <span>{item}</span>
              {idx < arr.length - 1 && <span className="dot-sep">•</span>}
            </React.Fragment>
          ))}
        </div>
        <div className="executive-divider" />
      </header>

      {/* Summary */}
      {summary && (
        <section className="executive-section">
          <h2 className="executive-section-heading">{labels.summary}</h2>
          <p className="executive-summary">{summary}</p>
        </section>
      )}

      {/* Experience */}
      {experience && experience.length > 0 && (
        <section className="executive-section">
          <h2 className="executive-section-heading">{labels.experience}</h2>
          <div className="executive-items">
            {experience.map(item => (
              <div key={item.id} className="executive-entry">
                <div className="entry-line-1">
                  <span className="entry-role">{item.role}</span>
                  <span className="entry-date">{item.startDate} – {item.current ? labels.present : item.endDate}</span>
                </div>
                <div className="entry-line-2">
                  <span className="entry-company">{item.company}</span>
                  {item.location && <span className="entry-location">| {item.location}</span>}
                </div>
                {item.description && <p className="entry-desc">{item.description}</p>}
                {item.bulletPoints && item.bulletPoints.length > 0 && (
                  <ul className="executive-bullets">
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
        <section className="executive-section">
          <h2 className="executive-section-heading">{labels.education}</h2>
          <div className="executive-items">
            {education.map(item => (
              <div key={item.id} className="executive-entry">
                <div className="entry-line-1">
                  <span className="entry-role">{item.degree} {item.fieldOfStudy ? `– ${item.fieldOfStudy}` : ''}</span>
                  <span className="entry-date">{item.startDate} – {item.endDate}</span>
                </div>
                <div className="entry-line-2">
                  <span className="entry-company">{item.institution}</span>
                  {item.location && <span className="entry-location">| {item.location}</span>}
                </div>
                {item.gpa && <p className="entry-gpa">{item.gpa}</p>}
                {item.details && <p className="entry-desc">{item.details}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {skills && skills.length > 0 && (
        <section className="executive-section">
          <h2 className="executive-section-heading">{labels.skills}</h2>
          <p className="executive-skills-line">
            {skills.map(s => s.name).join(' • ')}
          </p>
        </section>
      )}

      {/* Certifications & Languages */}
      {((certifications && certifications.length > 0) || (languages && languages.length > 0)) && (
        <section className="executive-section">
          <div className="executive-grid-2">
            {certifications && certifications.length > 0 && (
              <div>
                <h2 className="executive-section-heading small">{labels.certifications}</h2>
                <ul className="executive-simple-list">
                  {certifications.map(c => (
                    <li key={c.id}>
                      <strong>{c.name}</strong> – {c.issuer} {c.date ? `(${c.date})` : ''}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {languages && languages.length > 0 && (
              <div>
                <h2 className="executive-section-heading small">{labels.languages}</h2>
                <ul className="executive-simple-list">
                  {languages.map(l => (
                    <li key={l.id}>
                      <strong>{l.language}:</strong> {l.proficiency}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
