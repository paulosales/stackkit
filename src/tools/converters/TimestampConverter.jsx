import React, { useState, useEffect } from 'react';
import { CalendarClock, Copy, Check, Clock, RefreshCw } from 'lucide-react';

export default function TimestampConverter({ onCopy, lang = 'pt' }) {
  // Live ticking clock
  const [currentEpoch, setCurrentEpoch] = useState(Math.floor(Date.now() / 1000));
  const [currentMs, setCurrentMs] = useState(Date.now());

  useEffect(() => {
    const timer = setInterval(() => {
      const now = Date.now();
      setCurrentMs(now);
      setCurrentEpoch(Math.floor(now / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Epoch to Date inputs
  const [inputEpoch, setInputEpoch] = useState(String(Math.floor(Date.now() / 1000)));

  // Date to Epoch inputs
  const now = new Date();
  const defaultDateStr = now.toISOString().slice(0, 16);
  const [inputDateTime, setInputDateTime] = useState(defaultDateStr);

  const [copiedKey, setCopiedKey] = useState(null);

  const parseEpoch = () => {
    const num = Number(inputEpoch);
    if (isNaN(num) || num === 0) return null;
    // Check if seconds or milliseconds
    const date = num > 1e11 ? new Date(num) : new Date(num * 1000);
    if (isNaN(date.getTime())) return null;

    return {
      iso: date.toISOString(),
      utc: date.toUTCString(),
      local: date.toLocaleString('pt-BR', { timeZoneName: 'short' }),
      relative: getRelativeTime(date)
    };
  };

  const getRelativeTime = (d) => {
    const diffSec = Math.floor((Date.now() - d.getTime()) / 1000);
    if (Math.abs(diffSec) < 60) return `${Math.abs(diffSec)} segundos ${diffSec > 0 ? 'atrás' : 'no futuro'}`;
    const diffMin = Math.floor(diffSec / 60);
    if (Math.abs(diffMin) < 60) return `${Math.abs(diffMin)} minutos ${diffMin > 0 ? 'atrás' : 'no futuro'}`;
    const diffHours = Math.floor(diffMin / 60);
    if (Math.abs(diffHours) < 24) return `${Math.abs(diffHours)} horas ${diffHours > 0 ? 'atrás' : 'no futuro'}`;
    const diffDays = Math.floor(diffHours / 24);
    return `${Math.abs(diffDays)} dias ${diffDays > 0 ? 'atrás' : 'no futuro'}`;
  };

  const parseDateResult = () => {
    if (!inputDateTime) return null;
    const date = new Date(inputDateTime);
    if (isNaN(date.getTime())) return null;
    return {
      seconds: Math.floor(date.getTime() / 1000),
      milliseconds: date.getTime(),
      iso: date.toISOString()
    };
  };

  const epochResult = parseEpoch();
  const dateResult = parseDateResult();

  const handleCopy = (key, val) => {
    navigator.clipboard.writeText(String(val));
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1500);
    if (onCopy) onCopy('Valor copiado!');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Live Current Epoch Banner */}
      <div style={{
        padding: '16px 20px',
        borderRadius: 'var(--radius-lg)',
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 16
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 38, height: 38, borderRadius: '50%',
            background: 'rgba(6, 182, 212, 0.15)', color: 'var(--accent-cyan)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <Clock size={20} />
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
              Timestamp Atual (Unix Epoch ao Vivo)
            </div>
            <div style={{ fontSize: 22, fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>
              {currentEpoch}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn-secondary" onClick={() => setInputEpoch(String(currentEpoch))}>
            Usar Atual
          </button>
          <button className="btn-primary" onClick={() => handleCopy('current', currentEpoch)}>
            {copiedKey === 'current' ? <Check size={14} /> : <Copy size={14} />}
            <span>Copiar</span>
          </button>
        </div>
      </div>

      <div className="workspace-grid">
        {/* Timestamp to Date */}
        <div className="workspace-panel">
          <div className="panel-header">
            <div className="panel-title">
              <CalendarClock size={16} />
              <span>Timestamp Unix → Data Legível</span>
            </div>
          </div>

          <div className="panel-body">
            <div className="form-group">
              <label className="form-label">Timestamp Unix (segundos ou milissegundos)</label>
              <input
                type="text"
                value={inputEpoch}
                onChange={e => setInputEpoch(e.target.value.replace(/\D/g, ''))}
                placeholder="Ex: 1776547200"
              />
            </div>

            {epochResult && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 4 }}>
                <div className="form-group">
                  <span className="form-label">Data e Hora Local:</span>
                  <div className="result-box" style={{ padding: '8px 12px', fontSize: 13 }}>
                    <span>{epochResult.local}</span>
                    <button className="btn-icon" onClick={() => handleCopy('local', epochResult.local)}>
                      {copiedKey === 'local' ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <span className="form-label">Padrão ISO 8601:</span>
                  <div className="result-box" style={{ padding: '8px 12px', fontSize: 13 }}>
                    <span>{epochResult.iso}</span>
                    <button className="btn-icon" onClick={() => handleCopy('iso', epochResult.iso)}>
                      {copiedKey === 'iso' ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <span className="form-label">Padrão UTC:</span>
                  <div className="result-box" style={{ padding: '8px 12px', fontSize: 13 }}>
                    <span>{epochResult.utc}</span>
                    <button className="btn-icon" onClick={() => handleCopy('utc', epochResult.utc)}>
                      {copiedKey === 'utc' ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
                    </button>
                  </div>
                </div>

                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                  Tempo relativo: <strong>{epochResult.relative}</strong>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Date to Timestamp */}
        <div className="workspace-panel">
          <div className="panel-header">
            <div className="panel-title">
              <CalendarClock size={16} />
              <span>Data e Hora → Timestamp Unix</span>
            </div>
          </div>

          <div className="panel-body">
            <div className="form-group">
              <label className="form-label">Selecione Data e Hora</label>
              <input
                type="datetime-local"
                value={inputDateTime}
                onChange={e => setInputDateTime(e.target.value)}
              />
            </div>

            {dateResult && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 4 }}>
                <div className="form-group">
                  <span className="form-label">Timestamp em Segundos (Unix Epoch):</span>
                  <div className="result-box" style={{ padding: '8px 12px', fontSize: 14 }}>
                    <span style={{ fontWeight: 700 }}>{dateResult.seconds}</span>
                    <button className="btn-icon" onClick={() => handleCopy('sec', dateResult.seconds)}>
                      {copiedKey === 'sec' ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <span className="form-label">Timestamp em Milissegundos:</span>
                  <div className="result-box" style={{ padding: '8px 12px', fontSize: 14 }}>
                    <span style={{ fontWeight: 700 }}>{dateResult.milliseconds}</span>
                    <button className="btn-icon" onClick={() => handleCopy('ms', dateResult.milliseconds)}>
                      {copiedKey === 'ms' ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
