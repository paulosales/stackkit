import React from 'react';
import { useTranslation } from 'react-i18next';
import { Code2, ShieldCheck, Zap, Globe, ArrowLeft, Mail } from 'lucide-react';

export default function AboutUs({ onGoBack }) {
  const { t } = useTranslation();

  return (
    <div className="compliance-page-container" style={{
      maxWidth: 900,
      margin: '0 auto',
      padding: '32px 24px 64px 24px',
      color: 'var(--text-primary)',
      lineHeight: 1.7
    }}>
      <div style={{ marginBottom: 24 }}>
        <button
          className="btn-secondary"
          onClick={onGoBack}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 14px' }}
        >
          <ArrowLeft size={16} />
          <span>{t('compliance.back')}</span>
        </button>
      </div>

      <header style={{
        marginBottom: 36,
        paddingBottom: 24,
        borderBottom: '1px solid var(--border-subtle)'
      }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          padding: '4px 12px',
          borderRadius: 20,
          background: 'rgba(139, 92, 246, 0.12)',
          color: 'var(--accent-purple)',
          fontSize: 12,
          fontWeight: 600,
          marginBottom: 12
        }}>
          <Code2 size={14} />
          <span>{t('compliance.aboutProject')}</span>
        </div>
        <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8, letterSpacing: '-0.02em' }}>
          {t('compliance.aboutTitle')}
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>
          {t('compliance.aboutSubtitle')}
        </p>
      </header>

      {/* Mission Banner */}
      <div style={{
        background: 'var(--bg-surface-elevated)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-xl)',
        padding: '32px',
        marginBottom: 36
      }}>
        <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 12, color: 'var(--accent-cyan)' }}>
          {t('compliance.missionTitle')}
        </h3>
        <p style={{ fontSize: 15, lineHeight: 1.7, margin: 0, color: 'var(--text-secondary)' }}>
          {t('compliance.missionDesc')}
        </p>
      </div>

      {/* Core Pillars Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: 20,
        marginBottom: 36
      }}>
        <div style={{
          padding: 24,
          borderRadius: 'var(--radius-lg)',
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)'
        }}>
          <div style={{
            width: 40, height: 40, borderRadius: 'var(--radius-md)',
            background: 'rgba(6, 182, 212, 0.15)', color: 'var(--accent-cyan)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16
          }}>
            <ShieldCheck size={22} />
          </div>
          <h4 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>
            {t('compliance.pillarPrivacyTitle')}
          </h4>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            {t('compliance.pillarPrivacyDesc')}
          </p>
        </div>

        <div style={{
          padding: 24,
          borderRadius: 'var(--radius-lg)',
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)'
        }}>
          <div style={{
            width: 40, height: 40, borderRadius: 'var(--radius-md)',
            background: 'rgba(16, 185, 129, 0.15)', color: 'var(--accent-emerald)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16
          }}>
            <Zap size={22} />
          </div>
          <h4 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>
            {t('compliance.pillarPerformanceTitle')}
          </h4>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            {t('compliance.pillarPerformanceDesc')}
          </p>
        </div>

        <div style={{
          padding: 24,
          borderRadius: 'var(--radius-lg)',
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)'
        }}>
          <div style={{
            width: 40, height: 40, borderRadius: 'var(--radius-md)',
            background: 'rgba(139, 92, 246, 0.15)', color: 'var(--accent-purple)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16
          }}>
            <Globe size={22} />
          </div>
          <h4 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>
            {t('compliance.pillarStandardsTitle')}
          </h4>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            {t('compliance.pillarStandardsDesc')}
          </p>
        </div>
      </div>

      {/* Contact Section */}
      <section style={{
        padding: 28,
        borderRadius: 'var(--radius-lg)',
        background: 'var(--bg-surface-elevated)',
        border: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 20
      }}>
        <div>
          <h4 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>
            {t('compliance.contactTitle')}
          </h4>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: 0 }}>
            {t('compliance.contactDesc')}
          </p>
        </div>
        <a
          href="mailto:contato@stackkit.com.br"
          className="btn-primary"
          style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8 }}
        >
          <Mail size={16} />
          <span>contato@stackkit.com.br</span>
        </a>
      </section>
    </div>
  );
}
