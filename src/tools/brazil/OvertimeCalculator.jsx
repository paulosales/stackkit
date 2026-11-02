import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Calculator, DollarSign, Copy, Check } from 'lucide-react';

export default function OvertimeCalculator({ onCopy }) {
  const { t, i18n } = useTranslation();
  const [baseSalary, setBaseSalary] = useState('3500.00');
  const [monthlyHours, setMonthlyHours] = useState('220');
  const [hours50, setHours50] = useState('10');
  const [hours100, setHours100] = useState('5');
  const [workingDays, setWorkingDays] = useState('25');
  const [restDays, setRestDays] = useState('5'); // domingos e feriados
  const [copiedKey, setCopiedKey] = useState(null);

  const salaryNum = Math.max(0, parseFloat(baseSalary) || 0);
  const hoursNum = Math.max(1, parseFloat(monthlyHours) || 220);
  const h50Num = Math.max(0, parseFloat(hours50) || 0);
  const h100Num = Math.max(0, parseFloat(hours100) || 0);
  const wDaysNum = Math.max(1, parseFloat(workingDays) || 25);
  const rDaysNum = Math.max(0, parseFloat(restDays) || 5);

  // Calculations
  const normalHourValue = salaryNum / hoursNum;
  const hour50Value = normalHourValue * 1.5;
  const hour100Value = normalHourValue * 2.0;

  const total50 = h50Num * hour50Value;
  const total100 = h100Num * hour100Value;
  const totalOvertime = total50 + total100;

  // DSR Reflex: (Total Horas Extras / Dias Úteis) * Domingos e Feriados
  const dsrValue = (totalOvertime / wDaysNum) * rDaysNum;
  const totalGross = salaryNum + totalOvertime + dsrValue;

  const formatBRL = (val) => {
    const locale = i18n.language === 'en' ? 'en-US' : i18n.language === 'es' ? 'es-ES' : 'pt-BR';
    return val.toLocaleString(locale, { style: 'currency', currency: 'BRL' });
  };

  const handleCopy = (val, key) => {
    const text = formatBRL(val);
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1500);
    if (onCopy) {
      onCopy(t('tools.overtime.toasts.copied', { value: text }));
    }
  };

  return (
    <div className="workspace-grid">
      {/* Inputs */}
      <div className="workspace-panel">
        <div className="panel-header">
          <div className="panel-title">
            <Calculator size={16} />
            <span>{t('tools.overtime.paramsTitle')}</span>
          </div>
        </div>

        <div className="panel-body">
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">{t('tools.overtime.baseSalary')}</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={baseSalary}
                onChange={e => setBaseSalary(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">{t('tools.overtime.monthlyHours')}</label>
              <select value={monthlyHours} onChange={e => setMonthlyHours(e.target.value)}>
                <option value="220">{t('tools.overtime.hoursOptions.220')}</option>
                <option value="200">{t('tools.overtime.hoursOptions.200')}</option>
                <option value="180">{t('tools.overtime.hoursOptions.180')}</option>
                <option value="150">{t('tools.overtime.hoursOptions.150')}</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">{t('tools.overtime.hours50')}</label>
              <input
                type="number"
                step="0.5"
                min="0"
                value={hours50}
                onChange={e => setHours50(e.target.value)}
                placeholder={t('tools.overtime.hours50Placeholder')}
              />
            </div>

            <div className="form-group">
              <label className="form-label">{t('tools.overtime.hours100')}</label>
              <input
                type="number"
                step="0.5"
                min="0"
                value={hours100}
                onChange={e => setHours100(e.target.value)}
                placeholder={t('tools.overtime.hours100Placeholder')}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">{t('tools.overtime.workingDays')}</label>
              <input
                type="number"
                min="1"
                max="31"
                value={workingDays}
                onChange={e => setWorkingDays(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">{t('tools.overtime.restDays')}</label>
              <input
                type="number"
                min="0"
                max="15"
                value={restDays}
                onChange={e => setRestDays(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Breakdown Summary */}
      <div className="workspace-panel">
        <div className="panel-header">
          <div className="panel-title">
            <DollarSign size={16} />
            <span>{t('tools.overtime.breakdownTitle')}</span>
          </div>
        </div>

        <div className="panel-body">
          {/* Total Gross Highlight */}
          <div
            onClick={() => handleCopy(totalGross, 'gross')}
            style={{
              padding: 16,
              borderRadius: 'var(--radius-lg)',
              background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.15) 0%, rgba(16, 185, 129, 0.15) 100%)',
              border: '1px solid rgba(6, 182, 212, 0.3)',
              display: 'flex',
              flexDirection: 'column',
              gap: 4,
              cursor: 'pointer',
              position: 'relative'
            }}
            title={t('tools.common.copy')}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                {t('tools.overtime.totalGrossLabel')}
              </span>
              {copiedKey === 'gross' ? (
                <Check size={16} color="var(--accent-emerald)" />
              ) : (
                <Copy size={15} style={{ opacity: 0.6 }} />
              )}
            </div>
            <span style={{ fontSize: 28, fontWeight: 800, color: 'var(--accent-cyan)' }}>
              {formatBRL(totalGross)}
            </span>
          </div>

          {/* Breakdown cards */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {[
              { key: 'normalHour', label: t('tools.overtime.normalHourValue'), value: normalHourValue, color: 'var(--text-primary)' },
              { key: 'hour50', label: t('tools.overtime.hour50Value'), value: hour50Value, color: 'var(--text-primary)' },
              { key: 'total50', label: t('tools.overtime.total50'), value: total50, color: 'var(--text-primary)' },
              { key: 'total100', label: t('tools.overtime.total100'), value: total100, color: 'var(--text-primary)' },
              { key: 'totalOvertime', label: t('tools.overtime.totalOvertime'), value: totalOvertime, color: 'var(--accent-purple)' },
              { key: 'dsr', label: t('tools.overtime.dsrValue'), value: dsrValue, color: 'var(--accent-emerald)' }
            ].map(item => (
              <div
                key={item.key}
                onClick={() => handleCopy(item.value, item.key)}
                style={{
                  padding: 12,
                  background: 'var(--bg-surface-elevated)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-subtle)',
                  cursor: 'pointer',
                  transition: 'border-color 0.15s ease'
                }}
                title={t('tools.common.copy')}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{item.label}</div>
                  {copiedKey === item.key ? (
                    <Check size={12} color="var(--accent-emerald)" />
                  ) : (
                    <Copy size={11} style={{ opacity: 0.35 }} />
                  )}
                </div>
                <div style={{ fontSize: 15, fontWeight: 700, color: item.color }}>{formatBRL(item.value)}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="panel-footer">
          <span>{t('tools.overtime.legalBasis')}</span>
          <span>{t('tools.overtime.dsrIncluded')}</span>
        </div>
      </div>
    </div>
  );
}
