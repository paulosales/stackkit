import React from 'react';

export default function CompactAtsTemplate({ resume, accentColor = '#000000', font = 'roboto', labels }) {
  const { personal, summary, experience, education, skills, projects, certifications, languages } = resume.data || {};

  return (
    <div className={`resume-page ats-template font-${font}`}>
      {/* ATS Header */}
      <header className="ats-header">
        <h1 className="ats-name">{personal?.fullName || 'YOUR NAME'}</h1>
        {personal?.jobTitle && <div className="ats-title">{personal.jobTitle}</div>}
        <div className="ats-contact">
          {[
            personal?.location,
            personal?.phone,
            personal?.email,
            personal?.linkedin && `linkedin.com/in/${personal.linkedin.replace(/^https?:\/\/(?:www\.)?linkedin\.com\/in\//, '')}`,
            personal?.github && `github.com/${personal.github.replace(/^https?:\/\/(?:www\.)?github\.com\//, '')}`,
            personal?.website && personal.website.replace(/^https?:\/\//, '')
          ].filter(Boolean).join(' | ')}
        </div>
      </header>

      {/* Summary */}
      {summary && (
        <section className="ats-section">
          <h2 className="ats-heading">{labels.summary.toUpperCase()}</h2>
          <p className="ats-text">{summary}</p>
        </section>
      )}

      {/* Experience */}
      {experience && experience.length > 0 && (
        <section className="ats-section">
          <h2 className="ats-heading">{labels.experience.toUpperCase()}</h2>
          {experience.map(item => (
            <div key={item.id} className="ats-item">
              <div className="ats-line-1">
                <span className="ats-role"><strong>{item.role}</strong></span>
                <span className="ats-date">{item.startDate} – {item.current ? labels.present : item.endDate}</span>
              </div>
              <div className="ats-line-2">
                <span className="ats-company">{item.company}</span>
                {item.location && <span className="ats-loc">, {item.location}</span>}
              </div>
              {item.description && <p className="ats-desc">{item.description}</p>}
              {item.bulletPoints && item.bulletPoints.length > 0 && (
                <ul className="ats-bullets">
                  {item.bulletPoints.map((bp, i) => (
                    <li key={i}>{bp}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </section>
      )}

      {/* Education */}
      {education && education.length > 0 && (
        <section className="ats-section">
          <h2 className="ats-heading">{labels.education.toUpperCase()}</h2>
          {education.map(item => (
            <div key={item.id} className="ats-item">
              <div className="ats-line-1">
                <span className="ats-role"><strong>{item.degree} {item.fieldOfStudy ? `in ${item.fieldOfStudy}` : ''}</strong></span>
                <span className="ats-date">{item.startDate} – {item.endDate}</span>
              </div>
              <div className="ats-line-2">
                <span className="ats-company">{item.institution}</span>
                {item.location && <span className="ats-loc">, {item.location}</span>}
              </div>
              {item.gpa && <div className="ats-gpa">GPA: {item.gpa}</div>}
              {item.details && <p className="ats-desc">{item.details}</p>}
            </div>
          ))}
        </section>
      )}

      {/* Skills */}
      {skills && skills.length > 0 && (
        <section className="ats-section">
          <h2 className="ats-heading">{labels.skills.toUpperCase()}</h2>
          <p className="ats-text">
            <strong>Skills: </strong>
            {skills.map(s => s.name).join(', ')}
          </p>
        </section>
      )}

      {/* Projects */}
      {projects && projects.length > 0 && (
        <section className="ats-section">
          <h2 className="ats-heading">{labels.projects.toUpperCase()}</h2>
          {projects.map(proj => (
            <div key={proj.id} className="ats-item">
              <div className="ats-line-1">
                <span><strong>{proj.name}</strong> {proj.role ? `(${proj.role})` : ''}</span>
                {proj.url && <span className="ats-date">{proj.url.replace(/^https?:\/\//, '')}</span>}
              </div>
              {proj.description && <p className="ats-desc">{proj.description}</p>}
              {proj.techStack && proj.techStack.length > 0 && (
                <div className="ats-desc">
                  <strong>Technologies: </strong>{proj.techStack.join(', ')}
                </div>
              )}
            </div>
          ))}
        </section>
      )}

      {/* Certifications & Languages */}
      {((certifications && certifications.length > 0) || (languages && languages.length > 0)) && (
        <section className="ats-section">
          <h2 className="ats-heading">ADDITIONAL INFORMATION</h2>
          {certifications && certifications.length > 0 && (
            <p className="ats-text">
              <strong>Certifications: </strong>
              {certifications.map(c => `${c.name} (${c.issuer}${c.date ? ` - ${c.date}` : ''})`).join('; ')}
            </p>
          )}
          {languages && languages.length > 0 && (
            <p className="ats-text">
              <strong>Languages: </strong>
              {languages.map(l => `${l.language} (${l.proficiency})`).join(', ')}
            </p>
          )}
        </section>
      )}
    </div>
  );
}
