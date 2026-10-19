import React, { useState, useEffect, useRef } from 'react';
import { QrCode, Copy, Download, RefreshCw, Check, Banknote } from 'lucide-react';
import QRCodeLib from 'qrcode';
import { generatePixPayload } from '../../utils/brazilianAlgorithms';

export default function PixGenerator({ onCopy, lang = 'pt' }) {
  const [keyType, setKeyType] = useState('cpf');
  const [pixKey, setPixKey] = useState('12345678909');
  const [merchantName, setMerchantName] = useState('DEV STUDIO');
  const [merchantCity, setMerchantCity] = useState('SAO PAULO');
  const [amount, setAmount] = useState('25.00');
  const [txId, setTxId] = useState('PAGAMENTO01');
  const [description, setDescription] = useState('Teste Pix StackKit');
  const [payload, setPayload] = useState('');
  const [copied, setCopied] = useState(false);
  const canvasRef = useRef(null);

  useEffect(() => {
    try {
      const generated = generatePixPayload({
        pixKey,
        keyType,
        merchantName,
        merchantCity,
        amount,
        txId,
        description
      });
      setPayload(generated);

      if (canvasRef.current) {
        QRCodeLib.toCanvas(canvasRef.current, generated, {
          width: 240,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#ffffff'
          }
        }, (err) => {
          if (err) console.error(err);
        });
      }
    } catch (e) {
      console.error(e);
    }
  }, [pixKey, keyType, merchantName, merchantCity, amount, txId, description]);

  const handleCopy = () => {
    navigator.clipboard.writeText(payload);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
    if (onCopy) onCopy('PIX Copia e Cola copiado com sucesso!');
  };

  const handleDownloadPng = () => {
    if (!canvasRef.current) return;
    const url = canvasRef.current.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = url;
    link.download = `pix_qrcode_${Date.now()}.png`;
    link.click();
    if (onCopy) onCopy('QR Code PIX baixado!');
  };

  return (
    <div className="workspace-grid">
      {/* Form Fields */}
      <div className="workspace-panel">
        <div className="panel-header">
          <div className="panel-title">
            <Banknote size={16} />
            <span>Dados da Cobrança PIX</span>
          </div>
        </div>

        <div className="panel-body">
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Tipo de Chave</label>
              <select value={keyType} onChange={e => setKeyType(e.target.value)}>
                <option value="cpf">CPF</option>
                <option value="cnpj">CNPJ</option>
                <option value="email">E-mail</option>
                <option value="telefone">Telefone celular</option>
                <option value="aleatoria">Chave Aleatória (EVP)</option>
              </select>
            </div>

            <div className="form-group" style={{ flex: 1.5 }}>
              <label className="form-label">Chave PIX</label>
              <input
                type="text"
                value={pixKey}
                onChange={e => setPixKey(e.target.value)}
                placeholder="Insira a chave..."
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Nome do Beneficiário</label>
              <input
                type="text"
                value={merchantName}
                maxLength={25}
                onChange={e => setMerchantName(e.target.value)}
                placeholder="Até 25 caracteres"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Cidade do Beneficiário</label>
              <input
                type="text"
                value={merchantCity}
                maxLength={15}
                onChange={e => setMerchantCity(e.target.value)}
                placeholder="Até 15 caracteres"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Valor (R$) - Opcional</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                placeholder="Ex: 50.00 ou deixe em branco"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Identificador (TxID)</label>
              <input
                type="text"
                value={txId}
                maxLength={25}
                onChange={e => setTxId(e.target.value)}
                placeholder="Ex: PEDIDO123 ou ***"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Descrição (Opcional)</label>
            <input
              type="text"
              value={description}
              maxLength={40}
              onChange={e => setDescription(e.target.value)}
              placeholder="Mensagem para o pagador..."
            />
          </div>
        </div>
      </div>

      {/* Output / QR Code */}
      <div className="workspace-panel">
        <div className="panel-header">
          <div className="panel-title">
            <QrCode size={16} />
            <span>QR Code e Copia e Cola</span>
          </div>
          <div className="panel-actions">
            <button className="btn-secondary" onClick={handleDownloadPng}>
              <Download size={14} />
              <span>Baixar QR</span>
            </button>
            <button className="btn-primary" onClick={handleCopy}>
              {copied ? <Check size={14} /> : <Copy size={14} />}
              <span>{copied ? 'Copiado!' : 'Copiar Código'}</span>
            </button>
          </div>
        </div>

        <div className="panel-body" style={{ alignItems: 'center', textAlign: 'center' }}>
          {/* QR Code Canvas */}
          <div style={{
            padding: 12,
            background: '#ffffff',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-md)',
            display: 'inline-flex'
          }}>
            <canvas ref={canvasRef} style={{ width: 220, height: 220, display: 'block' }} />
          </div>

          {amount && Number(amount) > 0 && (
            <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--accent-emerald)', marginTop: 4 }}>
              R$ {Number(amount).toFixed(2).replace('.', ',')}
            </div>
          )}

          {/* Copia e Cola Payload String */}
          <div style={{ width: '100%', marginTop: 8 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6, textAlign: 'left' }}>
              PIX COPIA E COLA (EMV STANDARD):
            </div>
            <textarea
              readOnly
              rows={3}
              className="batch-output"
              style={{ minHeight: 70, fontSize: 11 }}
              value={payload}
              onClick={e => e.target.select()}
            />
          </div>
        </div>

        <div className="panel-footer">
          <span>Padrão Banco Central do Brasil (EMV QRCPS-MPM)</span>
          <span>CRC16 Validado</span>
        </div>
      </div>
    </div>
  );
}
