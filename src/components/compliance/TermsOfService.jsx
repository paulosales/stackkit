import React from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, AlertTriangle, Scale } from 'lucide-react';

export default function TermsOfService({ onGoBack }) {
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
          background: 'rgba(16, 185, 129, 0.12)',
          color: 'var(--accent-emerald)',
          fontSize: 12,
          fontWeight: 600,
          marginBottom: 12
        }}>
          <Scale size={14} />
          <span>{t('compliance.legalTerms')}</span>
        </div>
        <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8, letterSpacing: '-0.02em' }}>
          {t('compliance.termsOfServiceTitle')}
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>
          {t('compliance.termsLastUpdated')}
        </p>
      </header>

      <div className="compliance-content" style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
        <section>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>
            {t('compliance.termsSec1Title')}
          </h2>
          <p>
            {t('compliance.termsSec1Desc')}
          </p>
        </section>

        <section style={{
          background: 'rgba(245, 158, 11, 0.08)',
          borderLeft: '4px solid var(--accent-amber)',
          padding: '16px 20px',
          borderRadius: '0 var(--radius-md) var(--radius-md) 0'
        }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
            <AlertTriangle size={20} className="text-amber" />
            {t('compliance.termsSec2Title')}
          </h2>
          <p>
            {t('compliance.termsSec2P1')}
          </p>
          <p>
            <strong>{t('compliance.termsSec2NoticeLabel')}</strong> {t('compliance.termsSec2NoticeText')}
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>
            {t('compliance.termsSec3Title')}
          </h2>
          <p>
            {t('compliance.termsSec3Desc')}
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>
            {t('compliance.termsSec4Title')}
          </h2>
          <p>
            {t('compliance.termsSec4Desc')}
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>
            {t('compliance.termsSec5Title')}
          </h2>
          <p>
            {t('compliance.termsSec5Desc')}
          </p>
        </section>
      </div>
    </div>
  );
}
