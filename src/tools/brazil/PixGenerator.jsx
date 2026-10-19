import React, { useState, useEffect, useRef } from 'react';
import { QrCode, Copy, Download, Check, Banknote, Image as ImageIcon, Upload, Trash2, Ban } from 'lucide-react';
import QRCodeLib from 'qrcode';
import { generatePixPayload } from '../../utils/brazilianAlgorithms';
import { drawQrWithLogo, getSvgWithLogo, PIX_LOGO_SVG } from '../../utils/qrCodeUtils';

export default function PixGenerator({ onCopy, lang = 'pt' }) {
  const [keyType, setKeyType] = useState('cpf');
  const [pixKey, setPixKey] = useState('12345678909');
  const [merchantName, setMerchantName] = useState('DEV STUDIO');
  const [merchantCity, setMerchantCity] = useState('SAO PAULO');
  const [amount, setAmount] = useState('25.00');
  const [txId, setTxId] = useState('PAGAMENTO01');
  const [description, setDescription] = useState('Teste Pix StackKit');
  const [payload, setPayload] = useState('');
  const [copiedPayload, setCopiedPayload] = useState(false);
  const [copiedImage, setCopiedImage] = useState(false);

  // Logo in PIX QR Code state
  const [logoPreset, setLogoPreset] = useState('pix'); // 'pix' | 'custom' | 'none'
  const [customLogoUrl, setCustomLogoUrl] = useState(null);
  const [logoSizePercent, setLogoSizePercent] = useState(22);
  const [logoShape, setLogoShape] = useState('rounded'); // 'rounded' | 'circle'
  const fileInputRef = useRef(null);
  const canvasRef = useRef(null);

  // Active logo url
  const activeLogoUrl = logoPreset === 'pix'
    ? PIX_LOGO_SVG
    : (logoPreset === 'custom' ? customLogoUrl : null);

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
        drawQrWithLogo({
          canvas: canvasRef.current,
          text: generated || ' ',
          size: 240,
          darkColor: '#000000',
          lightColor: '#ffffff',
          errorLevel: 'H',
          logoUrl: activeLogoUrl,
          logoSizePercent,
          logoShape,
          logoBgColor: '#ffffff'
        });
      }
    } catch (e) {
      console.error(e);
    }
  }, [pixKey, keyType, merchantName, merchantCity, amount, txId, description, activeLogoUrl, logoSizePercent, logoShape]);

  // Handle custom logo file upload
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      if (onCopy) onCopy('Selecione uma imagem válida (PNG, JPG, SVG, WebP).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      if (onCopy) onCopy('A imagem deve ter no máximo 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setCustomLogoUrl(event.target.result);
      setLogoPreset('custom');
      if (onCopy) onCopy('Logotipo personalizado adicionado ao PIX!');
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveCustomLogo = () => {
    setCustomLogoUrl(null);
    setLogoPreset('none');
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (onCopy) onCopy('Logotipo removido do QR Code PIX.');
  };

  const handleCopyPayload = () => {
    navigator.clipboard.writeText(payload);
    setCopiedPayload(true);
    setTimeout(() => setCopiedPayload(false), 1500);
    if (onCopy) onCopy('PIX Copia e Cola copiado com sucesso!');
  };

  const handleDownloadPng = () => {
    if (!canvasRef.current) return;
    const url = canvasRef.current.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = url;
    link.download = `pix_qrcode_${Date.now()}.png`;
    link.click();
    if (onCopy) onCopy('QR Code PIX com imagem baixado!');
  };

  const handleDownloadSvg = async () => {
    try {
      const baseSvg = await QRCodeLib.toString(payload || ' ', {
        type: 'svg',
        width: 240,
        margin: 2,
        errorCorrectionLevel: 'H',
        color: {
          dark: '#000000',
          light: '#ffffff'
        }
      });

      const finalSvg = getSvgWithLogo({
        svgString: baseSvg,
        size: 240,
        logoUrl: activeLogoUrl,
        logoSizePercent,
        logoShape,
        lightColor: '#ffffff'
      });

      const blob = new Blob([finalSvg], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `pix_qrcode_${Date.now()}.svg`;
      a.click();
      URL.revokeObjectURL(url);
      if (onCopy) onCopy('QR Code PIX baixado como SVG!');
    } catch (e) {
      console.error(e);
    }
  };

  const handleCopyImage = async () => {
    if (!canvasRef.current) return;
    try {
      canvasRef.current.toBlob(async (blob) => {
        if (!blob) return;
        await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
        setCopiedImage(true);
        setTimeout(() => setCopiedImage(false), 1500);
        if (onCopy) onCopy('Imagem do QR Code PIX copiada!');
      });
    } catch (e) {
      handleCopyPayload();
    }
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

          {/* Logo / Image in PIX QR Code */}
          <div className="qr-logo-section">
            <div className="qr-logo-section-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <ImageIcon size={15} className="text-cyan" />
                <span style={{ fontWeight: 700, fontSize: 13 }}>Imagem ou Logotipo no Centro</span>
              </div>
              {activeLogoUrl && (
                <span className="badge badge-emerald" style={{ fontSize: 10.5 }}>Ativo</span>
              )}
            </div>

            {/* Presets Row */}
            <div className="qr-presets-row">
              <button
                type="button"
                className={`qr-preset-chip ${logoPreset === 'pix' ? 'active' : ''}`}
                onClick={() => setLogoPreset('pix')}
              >
                <img src={PIX_LOGO_SVG} alt="PIX Oficial" className="qr-preset-icon-img" />
                <span>Logo PIX Oficial</span>
              </button>

              <button
                type="button"
                className={`qr-preset-chip ${logoPreset === 'custom' ? 'active' : ''}`}
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload size={13} />
                <span>Sua Imagem</span>
              </button>

              <button
                type="button"
                className={`qr-preset-chip ${logoPreset === 'none' ? 'active' : ''}`}
                onClick={() => setLogoPreset('none')}
              >
                <Ban size={13} style={{ opacity: 0.6 }} />
                <span>Nenhum</span>
              </button>
            </div>

            {/* Hidden File Input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/svg+xml"
              style={{ display: 'none' }}
              onChange={handleFileUpload}
            />

            {/* Custom Logo Details */}
            {logoPreset === 'custom' && customLogoUrl && (
              <div className="qr-custom-logo-card">
                <img src={customLogoUrl} alt="Custom Logo Preview" className="qr-custom-logo-thumb" />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)' }}>Logotipo personalizado</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Incorporado ao QR Code PIX</div>
                </div>
                <button
                  type="button"
                  className="city-action-btn delete-btn"
                  title="Remover logotipo"
                  onClick={handleRemoveCustomLogo}
                >
                  <Trash2 size={13} />
                </button>
              </div>
            )}

            {/* Options when logo active */}
            {activeLogoUrl && (
              <div className="qr-logo-options-box">
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">
                      <span>Tamanho da Logo</span>
                      <span className="badge badge-cyan">{logoSizePercent}%</span>
                    </label>
                    <input
                      type="range"
                      min="16"
                      max="26"
                      step="1"
                      value={logoSizePercent}
                      onChange={e => setLogoSizePercent(Number(e.target.value))}
                      style={{ width: '100%', accentColor: 'var(--accent-cyan)' }}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Formato</label>
                    <div className="qr-shape-toggle">
                      <button
                        type="button"
                        className={`qr-shape-btn ${logoShape === 'rounded' ? 'active' : ''}`}
                        onClick={() => setLogoShape('rounded')}
                      >
                        Arredondado
                      </button>
                      <button
                        type="button"
                        className={`qr-shape-btn ${logoShape === 'circle' ? 'active' : ''}`}
                        onClick={() => setLogoShape('circle')}
                      >
                        Círculo
                      </button>
                    </div>
                  </div>
                </div>

                <div style={{ fontSize: 11, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 5, marginTop: 4 }}>
                  <span>🛡️</span>
                  <span>Correção de erro em nível <strong>Máximo (H)</strong> para leitura instantânea em apps bancários.</span>
                </div>
              </div>
            )}
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
            <button className="btn-secondary" onClick={handleDownloadSvg}>
              <Download size={14} />
              <span>SVG</span>
            </button>
            <button className="btn-secondary" onClick={handleDownloadPng}>
              <Download size={14} />
              <span>PNG</span>
            </button>
            <button className="btn-secondary" onClick={handleCopyImage}>
              {copiedImage ? <Check size={14} /> : <Copy size={14} />}
              <span>{copiedImage ? 'Imagem Copiada!' : 'Copiar Imagem'}</span>
            </button>
            <button className="btn-primary" onClick={handleCopyPayload}>
              {copiedPayload ? <Check size={14} /> : <Copy size={14} />}
              <span>{copiedPayload ? 'Copiado!' : 'Copiar Código'}</span>
            </button>
          </div>
        </div>

        <div className="panel-body" style={{ alignItems: 'center', textAlign: 'center' }}>
          {/* QR Code Canvas */}
          <div style={{
            padding: 14,
            background: '#ffffff',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-md)',
            display: 'inline-flex'
          }}>
            <canvas ref={canvasRef} style={{ width: 240, height: 240, display: 'block' }} />
          </div>

          {amount && Number(amount) > 0 && (
            <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--accent-emerald)', marginTop: 6 }}>
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
          <span>{activeLogoUrl ? 'Logo central aplicada' : 'CRC16 Validado'}</span>
        </div>
      </div>
    </div>
  );
}
