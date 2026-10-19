import React, { useState } from 'react';
import { Clock, Calculator, DollarSign, HelpCircle } from 'lucide-react';

export default function OvertimeCalculator({ onCopy, lang = 'pt' }) {
  const [baseSalary, setBaseSalary] = useState('3500.00');
  const [monthlyHours, setMonthlyHours] = useState('220');
  const [hours50, setHours50] = useState('10');
  const [hours100, setHours100] = useState('5');
  const [workingDays, setWorkingDays] = useState('25');
  const [restDays, setRestDays] = useState('5'); // domingos e feriados

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
    return val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  return (
    <div className="workspace-grid">
      {/* Inputs */}
      <div className="workspace-panel">
        <div className="panel-header">
          <div className="panel-title">
            <Calculator size={16} />
            <span>Parâmetros de Cálculo CLT</span>
          </div>
        </div>

        <div className="panel-body">
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Salário Base Mensal (R$)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={baseSalary}
                onChange={e => setBaseSalary(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Jornada Mensal</label>
              <select value={monthlyHours} onChange={e => setMonthlyHours(e.target.value)}>
                <option value="220">220 horas (44h semanais)</option>
                <option value="200">200 horas (40h semanais)</option>
                <option value="180">180 horas (36h semanais)</option>
                <option value="150">150 horas (30h semanais)</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Horas Extras 50% (Dias Úteis)</label>
              <input
                type="number"
                step="0.5"
                min="0"
                value={hours50}
                onChange={e => setHours50(e.target.value)}
                placeholder="Ex: 10"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Horas Extras 100% (Domingos/Feriados)</label>
              <input
                type="number"
                step="0.5"
                min="0"
                value={hours100}
                onChange={e => setHours100(e.target.value)}
                placeholder="Ex: 5"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Dias Úteis no Mês</label>
              <input
                type="number"
                min="1"
                max="31"
                value={workingDays}
                onChange={e => setWorkingDays(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Domingos e Feriados no Mês</label>
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
            <span>Demonstrativo de Valores</span>
          </div>
        </div>

        <div className="panel-body">
          {/* Total Gross Highlight */}
          <div style={{
            padding: 16,
            borderRadius: 'var(--radius-lg)',
            background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.15) 0%, rgba(16, 185, 129, 0.15) 100%)',
            border: '1px solid rgba(6, 182, 212, 0.3)',
            display: 'flex',
            flexDirection: 'column',
            gap: 4
          }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
              Total Bruto Estimado a Receber:
            </span>
            <span style={{ fontSize: 28, fontWeight: 800, color: 'var(--accent-cyan)' }}>
              {formatBRL(totalGross)}
            </span>
          </div>

          {/* Breakdown cards */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div style={{ padding: 12, background: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Valor da Hora Normal:</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>{formatBRL(normalHourValue)}</div>
            </div>

            <div style={{ padding: 12, background: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Valor Hora 50%:</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>{formatBRL(hour50Value)}</div>
            </div>

            <div style={{ padding: 12, background: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Subtotal Horas 50%:</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>{formatBRL(total50)}</div>
            </div>

            <div style={{ padding: 12, background: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Subtotal Horas 100%:</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>{formatBRL(total100)}</div>
            </div>

            <div style={{ padding: 12, background: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Total Horas Extras:</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--accent-purple)' }}>{formatBRL(totalOvertime)}</div>
            </div>

            <div style={{ padding: 12, background: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Reflexo no DSR:</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--accent-emerald)' }}>{formatBRL(dsrValue)}</div>
            </div>
          </div>
        </div>

        <div className="panel-footer">
          <span>Artigo 59 da CLT e Súmula 172 do TST</span>
          <span>DSR incluso</span>
        </div>
      </div>
    </div>
  );
}
