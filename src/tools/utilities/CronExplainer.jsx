import React, { useState } from 'react';
import { Timer, Copy, Check, Sparkles, AlertCircle } from 'lucide-react';
import { explainCron } from '../../utils/formatters';

const PRESETS = [
  { label: 'A cada minuto', expression: '* * * * *' },
  { label: 'A cada 15 minutos', expression: '*/15 * * * *' },
  { label: 'No início de cada hora', expression: '0 * * * *' },
  { label: 'Todos os dias à meia-noite', expression: '0 0 * * *' },
  { label: 'Todos os dias às 09:00', expression: '0 9 * * *' },
  { label: 'De segunda a sexta às 08:30', expression: '30 8 * * 1-5' },
  { label: 'No 1º dia de cada mês à meia-noite', expression: '0 0 1 * *' },
  { label: 'A cada domingo às 12:00', expression: '0 12 * * 0' }
];

export default function CronExplainer({ onCopy, lang = 'pt' }) {
  const [cron, setCron] = useState('*/15 * * * *');
  const [copied, setCopied] = useState(false);

  const explanation = explainCron(cron);

  const handleCopy = () => {
    navigator.clipboard.writeText(cron);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
    if (onCopy) onCopy('Expressão cron copiada!');
  };

  return (
    <div className="workspace-panel">
      <div className="panel-header">
        <div className="panel-title">
          <Timer size={16} />
          <span>Explicador de Expressões Cron</span>
        </div>
      </div>

      <div className="panel-body">
        {/* Presets */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)' }}>Exemplos populares:</span>
          {PRESETS.map(p => (
            <button
              key={p.label}
              className="btn-secondary"
              style={{ padding: '3px 9px', fontSize: 11 }}
              onClick={() => setCron(p.expression)}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Input */}
        <div className="form-group" style={{ marginTop: 8 }}>
          <label className="form-label">Expressão Cron (5 partes padrão: minuto hora dia_mês mês dia_semana)</label>
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              type="text"
              value={cron}
              onChange={e => setCron(e.target.value)}
              placeholder="* * * * *"
              style={{ fontSize: 18, fontFamily: 'var(--font-mono)', fontWeight: 700 }}
            />
            <button className="btn-secondary" onClick={handleCopy}>
              {copied ? <Check size={16} color="#10b981" /> : <Copy size={16} />}
              <span>{copied ? 'Copiado!' : 'Copiar'}</span>
            </button>
          </div>
        </div>

        {/* Human Translation Card */}
        {explanation.valid ? (
          <div style={{
            padding: '24px',
            borderRadius: 'var(--radius-lg)',
            background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.12) 0%, rgba(59, 130, 246, 0.12) 100%)',
            border: '1px solid rgba(6, 182, 212, 0.3)',
            display: 'flex',
            flexDirection: 'column',
            gap: 8
          }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--accent-cyan)', textTransform: 'uppercase' }}>
              Significado em Português Claro:
            </div>
            <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.3 }}>
              “{explanation.description}”
            </div>
          </div>
        ) : (
          <div style={{
            padding: '12px', borderRadius: 'var(--radius-md)',
            background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)',
            color: '#ef4444', display: 'flex', alignItems: 'center', gap: 8, fontSize: 13
          }}>
            <AlertCircle size={16} />
            <span>{explanation.message}</span>
          </div>
        )}

        {/* Field Breakdown Table */}
        {explanation.valid && explanation.parts && (
          <div style={{ marginTop: 10 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 10 }}>
              Detalhamento Campo a Campo:
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 10 }}>
              <div style={{ padding: 12, background: 'var(--bg-input)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', textAlign: 'center' }}>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Minuto (0-59)</div>
                <div style={{ fontSize: 18, fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)', marginTop: 4 }}>
                  {explanation.parts.minute}
                </div>
              </div>

              <div style={{ padding: 12, background: 'var(--bg-input)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', textAlign: 'center' }}>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Hora (0-23)</div>
                <div style={{ fontSize: 18, fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)', marginTop: 4 }}>
                  {explanation.parts.hour}
                </div>
              </div>

              <div style={{ padding: 12, background: 'var(--bg-input)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', textAlign: 'center' }}>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Dia do Mês (1-31)</div>
                <div style={{ fontSize: 18, fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)', marginTop: 4 }}>
                  {explanation.parts.dayOfMonth}
                </div>
              </div>

              <div style={{ padding: 12, background: 'var(--bg-input)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', textAlign: 'center' }}>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Mês (1-12)</div>
                <div style={{ fontSize: 18, fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)', marginTop: 4 }}>
                  {explanation.parts.month}
                </div>
              </div>

              <div style={{ padding: 12, background: 'var(--bg-input)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', textAlign: 'center' }}>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Dia Semana (0-7)</div>
                <div style={{ fontSize: 18, fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)', marginTop: 4 }}>
                  {explanation.parts.dayOfWeek}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="panel-footer">
        <span>Sintaxe POSIX crontab padrão</span>
        <span>Linux, AWS EventBridge, Kubernetes CronJobs</span>
      </div>
    </div>
  );
}
