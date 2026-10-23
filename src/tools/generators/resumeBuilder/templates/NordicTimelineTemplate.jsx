import { Mail, Phone, MapPin, Globe } from 'lucide-react';
import { Linkedin, Github } from '../icons';

export default function NordicTimelineTemplate({ resume, accentColor = '#059669', font = 'inter', labels }) {
  const { personal, summary, experience, education, skills, projects, certifications, languages } = resume.data || {};

  return (
    <div className={`resume-page nordic-template font-${font}`} style={{ '--accent': accentColor }}>
      {/* Top Banner Bar */}
      <div className="nordic-accent-bar" />

      {/* Header */}
      <header className="nordic-header">
        <div className="nordic-title-box">
          <h1 className="nordic-name">{personal?.fullName || 'Your Name'}</h1>
          {personal?.jobTitle && <p className="nordic-subtitle">{personal.jobTitle}</p>}
        </div>

        {/* Contact Strip */}
        <div className="nordic-contacts">
          {personal?.email && <span>{personal.email}</span>}
          {personal?.phone && <span>· {personal.phone}</span>}
          {personal?.location && <span>· {personal.location}</span>}
          {personal?.website && <span>· {personal.website.replace(/^https?:\/\//, '')}</span>}
          {personal?.linkedin && (
            <span>· {personal.linkedin.replace(/^https?:\/\/(?:www\.)?linkedin\.com\/in\//, 'linkedin.com/in/')}</span>
          )}
          {personal?.github && (
            <span>· {personal.github.replace(/^https?:\/\/(?:www\.)?github\.com\//, 'github.com/')}</span>
          )}
        </div>
      </header>

      {/* Summary */}
      {summary && (
        <section className="nordic-section">
          <h2 className="nordic-heading">{labels.summary}</h2>
          <p className="nordic-body-text">{summary}</p>
        </section>
      )}

      {/* Experience Timeline */}
      {experience && experience.length > 0 && (
        <section className="nordic-section">
          <h2 className="nordic-heading">{labels.experience}</h2>
          <div className="nordic-timeline-container">
            {experience.map(exp => (
              <div key={exp.id} className="nordic-timeline-node">
                <div className="node-marker" />
                <div className="node-body">
                  <div className="node-top">
                    <div>
                      <h3 className="node-role">{exp.role}</h3>
                      <span className="node-company">{exp.company}</span>
                      {exp.location && <span className="node-loc">({exp.location})</span>}
                    </div>
                    <span className="node-badge">
                      {exp.startDate} – {exp.current ? labels.present : exp.endDate}
                    </span>
                  </div>
                  {exp.description && <p className="node-desc">{exp.description}</p>}
                  {exp.bulletPoints && exp.bulletPoints.length > 0 && (
                    <ul className="nordic-bullets">
                      {exp.bulletPoints.map((bp, i) => (
                        <li key={i}>{bp}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {education && education.length > 0 && (
        <section className="nordic-section">
          <h2 className="nordic-heading">{labels.education}</h2>
          <div className="nordic-grid">
            {education.map(edu => (
              <div key={edu.id} className="nordic-card">
                <div className="card-top">
                  <h3 className="card-degree">{edu.degree}</h3>
                  <span className="card-dates">{edu.startDate} – {edu.endDate}</span>
                </div>
                <div className="card-inst">{edu.institution} {edu.location ? `· ${edu.location}` : ''}</div>
                {edu.gpa && <div className="card-gpa">{edu.gpa}</div>}
                {edu.details && <p className="card-desc">{edu.details}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {skills && skills.length > 0 && (
        <section className="nordic-section">
          <h2 className="nordic-heading">{labels.skills}</h2>
          <div className="nordic-skills-wrapper">
            {skills.map(s => (
              <span key={s.id} className="nordic-skill-pill">
                {s.name}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {projects && projects.length > 0 && (
        <section className="nordic-section">
          <h2 className="nordic-heading">{labels.projects}</h2>
          <div className="nordic-grid">
            {projects.map(proj => (
              <div key={proj.id} className="nordic-card">
                <div className="card-top">
                  <h3 className="card-degree">{proj.name}</h3>
                  {proj.role && <span className="card-role">{proj.role}</span>}
                </div>
                {proj.description && <p className="card-desc">{proj.description}</p>}
                {proj.techStack && proj.techStack.length > 0 && (
                  <div className="nordic-techs">
                    {proj.techStack.map((t, idx) => (
                      <span key={idx} className="mini-tag">{t}</span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Languages & Certifications Dual Row */}
      {((certifications && certifications.length > 0) || (languages && languages.length > 0)) && (
        <div className="nordic-split-row">
          {certifications && certifications.length > 0 && (
            <div className="nordic-sub-col">
              <h2 className="nordic-heading">{labels.certifications}</h2>
              <ul className="nordic-bullet-list">
                {certifications.map(c => (
                  <li key={c.id}>
                    <strong>{c.name}</strong> ({c.issuer}{c.date ? `, ${c.date}` : ''})
                  </li>
                ))}
              </ul>
            </div>
          )}
          {languages && languages.length > 0 && (
            <div className="nordic-sub-col">
              <h2 className="nordic-heading">{labels.languages}</h2>
              <ul className="nordic-bullet-list">
                {languages.map(l => (
                  <li key={l.id}>
                    <strong>{l.language}:</strong> {l.proficiency}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
