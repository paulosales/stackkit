import React from 'react';
import { useTranslation } from 'react-i18next';
import { Shield, Lock, ArrowLeft, Cookie, ServerOff } from 'lucide-react';

export default function PrivacyPolicy({ onGoBack }) {
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
          background: 'rgba(6, 182, 212, 0.12)',
          color: 'var(--accent-cyan)',
          fontSize: 12,
          fontWeight: 600,
          marginBottom: 12
        }}>
          <Shield size={14} />
          <span>{t('compliance.securityPrivacy')}</span>
        </div>
        <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8, letterSpacing: '-0.02em' }}>
          {t('compliance.privacyPolicyTitle')}
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>
          {t('compliance.privacyLastUpdated')}
        </p>
      </header>

      {/* Highlights Box */}
      <div style={{
        background: 'var(--bg-surface-elevated)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        padding: '24px',
        marginBottom: 36,
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: 20
      }}>
        <div style={{ display: 'flex', gap: 12 }}>
          <ServerOff size={22} className="text-cyan" style={{ flexShrink: 0, marginTop: 2 }} />
          <div>
            <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>
              {t('compliance.privacyHighlight1Title')}
            </h4>
            <p style={{ fontSize: 12.5, color: 'var(--text-secondary)', margin: 0 }}>
              {t('compliance.privacyHighlight1Desc')}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12 }}>
          <Lock size={22} className="text-emerald" style={{ flexShrink: 0, marginTop: 2 }} />
          <div>
            <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>
              {t('compliance.privacyHighlight2Title')}
            </h4>
            <p style={{ fontSize: 12.5, color: 'var(--text-secondary)', margin: 0 }}>
              {t('compliance.privacyHighlight2Desc')}
            </p>
          </div>
        </div>
      </div>

      <div className="compliance-content" style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
        <section>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>
            {t('compliance.privacySec1Title')}
          </h2>
          <p>
            {t('compliance.privacySec1Desc')}
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>
            {t('compliance.privacySec2Title')}
          </h2>
          <p>
            {t('compliance.privacySec2P1')}
          </p>
          <p>
            {t('compliance.privacySec2P2')}
          </p>
        </section>

        <section style={{
          background: 'rgba(6, 182, 212, 0.05)',
          borderLeft: '4px solid var(--accent-cyan)',
          padding: '16px 20px',
          borderRadius: '0 var(--radius-md) var(--radius-md) 0'
        }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Cookie size={20} className="text-cyan" />
            {t('compliance.privacySec3Title')}
          </h2>
          <p>
            {t('compliance.privacySec3P1')}
          </p>
          <p>
            <strong>{t('compliance.privacySec3Disclosures')}</strong>
          </p>
          <ul style={{ paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <li>
              {t('compliance.privacySec3Item1')}
            </li>
            <li>
              {t('compliance.privacySec3Item2')}
            </li>
            <li>
              {t('compliance.privacySec3Item3Prefix')}
              <a
                href="https://adssettings.google.com/"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: 'var(--accent-cyan)', textDecoration: 'underline' }}
              >
                https://adssettings.google.com/
              </a>
            </li>
            <li>
              {t('compliance.privacySec3Item4Prefix')}
              <a
                href="https://www.aboutads.info/choices/"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: 'var(--accent-cyan)', textDecoration: 'underline' }}
              >
                www.aboutads.info/choices/
              </a>
              {t('compliance.privacySec3Item4Or')}
              <a
                href="https://www.youronlinechoices.com/"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: 'var(--accent-cyan)', textDecoration: 'underline' }}
              >
                www.youronlinechoices.com/
              </a>.
            </li>
          </ul>
        </section>

        <section>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>
            {t('compliance.privacySec4Title')}
          </h2>
          <p>
            {t('compliance.privacySec4Desc')}
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>
            {t('compliance.privacySec5Title')}
          </h2>
          <p>
            {t('compliance.privacySec5Desc')}
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>
            {t('compliance.privacySec6Title')}
          </h2>
          <p>
            {t('compliance.privacySec6Desc')}
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>
            {t('compliance.privacySec7Title')}
          </h2>
          <p>
            {t('compliance.privacySec7Desc')}
          </p>
        </section>
      </div>
    </div>
  );
}
