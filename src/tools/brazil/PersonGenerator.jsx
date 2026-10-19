import React, { useState, useEffect } from 'react';
import { UserCheck, RefreshCw, Copy, Download, Check, FileJson, FileSpreadsheet } from 'lucide-react';
import { generateCPF, generateRG } from '../../utils/brazilianAlgorithms';
import {
  firstNamesMale, firstNamesFemale, lastNames,
  statesAndCities, streetTypes, streetNames, emailDomains, getZodiacSign
} from '../../data/brazilianData';

export default function PersonGenerator({ onCopy, lang = 'pt' }) {
  const [genderFilter, setGenderFilter] = useState('any'); // 'any', 'male', 'female'
  const [stateFilter, setStateFilter] = useState('');
  const [person, setPerson] = useState(null);
  const [copiedField, setCopiedField] = useState(null);

  const generateSinglePerson = () => {
    const isMale = genderFilter === 'male' || (genderFilter === 'any' && Math.random() > 0.5);
    const firstName = isMale
      ? firstNamesMale[Math.floor(Math.random() * firstNamesMale.length)]
      : firstNamesFemale[Math.floor(Math.random() * firstNamesFemale.length)];

    const lastName1 = lastNames[Math.floor(Math.random() * lastNames.length)];
    const lastName2 = lastNames[Math.floor(Math.random() * lastNames.length)];
    const fullName = `${firstName} ${lastName1} ${lastName2}`;

    // Father & Mother
    const fatherName = `${firstNamesMale[Math.floor(Math.random() * firstNamesMale.length)]} ${lastName2}`;
    const motherName = `${firstNamesFemale[Math.floor(Math.random() * firstNamesFemale.length)]} ${lastName1}`;

    // Age and Date of Birth (between 18 and 68 years old)
    const currentYear = 2026;
    const age = Math.floor(Math.random() * 50) + 18;
    const birthYear = currentYear - age;
    const birthMonth = Math.floor(Math.random() * 12) + 1;
    const birthDay = Math.floor(Math.random() * 28) + 1;
    const birthDate = `${String(birthDay).padStart(2, '0')}/${String(birthMonth).padStart(2, '0')}/${birthYear}`;
    const sign = getZodiacSign(birthDay, birthMonth);

    // Location
    let stateObj = statesAndCities[Math.floor(Math.random() * statesAndCities.length)];
    if (stateFilter) {
      const found = statesAndCities.find(s => s.uf === stateFilter);
      if (found) stateObj = found;
    }

    const cityObj = stateObj.cities[Math.floor(Math.random() * stateObj.cities.length)];
    const neighborhood = cityObj.neighborhoods[Math.floor(Math.random() * cityObj.neighborhoods.length)];
    const streetType = streetTypes[Math.floor(Math.random() * streetTypes.length)];
    const street = streetNames[Math.floor(Math.random() * streetNames.length)];
    const streetNumber = Math.floor(Math.random() * 2500) + 1;
    const cep = `${cityObj.cepPrefix}-${String(Math.floor(Math.random() * 900) + 100)}`;
    const ddd = stateObj.ddd[Math.floor(Math.random() * stateObj.ddd.length)];

    // Contacts
    const cleanFirstName = firstName.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const cleanLastName = lastName2.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const domain = emailDomains[Math.floor(Math.random() * emailDomains.length)];
    const email = `${cleanFirstName}.${cleanLastName}${Math.floor(Math.random() * 99)}@${domain}`;

    const cellPhone = `(${ddd}) 9${Math.floor(Math.random() * 9000 + 1000)}-${Math.floor(Math.random() * 9000 + 1000)}`;
    const landline = `(${ddd}) 3${Math.floor(Math.random() * 900 + 100)}-${Math.floor(Math.random() * 9000 + 1000)}`;

    setPerson({
      nome: fullName,
      sexo: isMale ? 'Masculino' : 'Feminino',
      idade: `${age} anos`,
      dataNascimento: birthDate,
      signo: sign,
      cpf: generateCPF(true),
      rg: generateRG(true),
      nomeMae: motherName,
      nomePai: fatherName,
      email,
      telefone: landline,
      celular: cellPhone,
      cep,
      endereco: `${streetType} ${street}, ${streetNumber}`,
      bairro: neighborhood,
      cidade: cityObj.name,
      estado: stateObj.name,
      uf: stateObj.uf
    });
  };

  useEffect(() => {
    generateSinglePerson();
  }, [genderFilter, stateFilter]);

  const copyVal = (key, val) => {
    navigator.clipboard.writeText(val);
    setCopiedField(key);
    setTimeout(() => setCopiedField(null), 1500);
    if (onCopy) onCopy(`${key.toUpperCase()} copiado!`);
  };

  const copyFullJson = () => {
    navigator.clipboard.writeText(JSON.stringify(person, null, 2));
    if (onCopy) onCopy('JSON completo da pessoa copiado!');
  };

  const downloadJson = () => {
    const blob = new Blob([JSON.stringify(person, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pessoa_${person?.nome.replace(/\s+/g, '_')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!person) return null;

  return (
    <div className="workspace-panel">
      <div className="panel-header">
        <div className="panel-title">
          <UserCheck size={16} />
          <span>Perfil de Pessoa Brasileira</span>
        </div>
        <div className="panel-actions">
          <button className="btn-secondary" onClick={copyFullJson} title="Copiar como JSON">
            <FileJson size={14} />
            <span>Copiar JSON</span>
          </button>
          <button className="btn-secondary" onClick={downloadJson} title="Baixar JSON">
            <Download size={14} />
            <span>Baixar</span>
          </button>
          <button className="btn-primary" onClick={generateSinglePerson}>
            <RefreshCw size={14} />
            <span>Gerar Outra Pessoa</span>
          </button>
        </div>
      </div>

      <div className="panel-body">
        {/* Filters bar */}
        <div className="form-row" style={{ marginBottom: 10 }}>
          <div className="form-group">
            <label className="form-label">Gênero</label>
            <select value={genderFilter} onChange={e => setGenderFilter(e.target.value)}>
              <option value="any">Qualquer (Aleatório)</option>
              <option value="male">Masculino</option>
              <option value="female">Feminino</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Estado</label>
            <select value={stateFilter} onChange={e => setStateFilter(e.target.value)}>
              <option value="">Qualquer Estado</option>
              {statesAndCities.map(s => (
                <option key={s.uf} value={s.uf}>{s.name} ({s.uf})</option>
              ))}
            </select>
          </div>
        </div>

        {/* Profile Grid Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 16
        }}>
          {/* Dados Pessoais */}
          <div style={{
            background: 'var(--bg-surface-elevated)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: 16,
            display: 'flex',
            flexDirection: 'column',
            gap: 12
          }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--accent-cyan)', display: 'flex', alignItems: 'center', gap: 6 }}>
              👤 Dados Pessoais
            </div>

            <div className="form-group">
              <label className="form-label">Nome Completo</label>
              <div className="result-box" style={{ padding: '8px 12px', fontSize: 13 }}>
                <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{person.nome}</span>
                <button className="btn-icon" onClick={() => copyVal('nome', person.nome)}>
                  {copiedField === 'nome' ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
                </button>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              <div>
                <label className="form-label">CPF</label>
                <div className="result-box" style={{ padding: '8px 12px', fontSize: 12 }}>
                  <span>{person.cpf}</span>
                  <button className="btn-icon" onClick={() => copyVal('cpf', person.cpf)}>
                    {copiedField === 'cpf' ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="form-label">RG</label>
                <div className="result-box" style={{ padding: '8px 12px', fontSize: 12 }}>
                  <span>{person.rg}</span>
                  <button className="btn-icon" onClick={() => copyVal('rg', person.rg)}>
                    {copiedField === 'rg' ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
                  </button>
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              <div>
                <span className="form-label">Data de Nasc. / Idade</span>
                <div style={{ fontSize: 13, color: 'var(--text-primary)', marginTop: 2 }}>
                  {person.dataNascimento} ({person.idade})
                </div>
              </div>
              <div>
                <span className="form-label">Signo / Sexo</span>
                <div style={{ fontSize: 13, color: 'var(--text-primary)', marginTop: 2 }}>
                  {person.signo} · {person.sexo}
                </div>
              </div>
            </div>

            <div>
              <span className="form-label">Filiação</span>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>
                Mãe: {person.nomeMae}<br />
                Pai: {person.nomePai}
              </div>
            </div>
          </div>

          {/* Endereço & Contato */}
          <div style={{
            background: 'var(--bg-surface-elevated)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: 16,
            display: 'flex',
            flexDirection: 'column',
            gap: 12
          }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--accent-purple)', display: 'flex', alignItems: 'center', gap: 6 }}>
              📍 Localização e Contato
            </div>

            <div className="form-group">
              <label className="form-label">E-mail</label>
              <div className="result-box" style={{ padding: '8px 12px', fontSize: 13 }}>
                <span style={{ color: 'var(--text-primary)' }}>{person.email}</span>
                <button className="btn-icon" onClick={() => copyVal('email', person.email)}>
                  {copiedField === 'email' ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
                </button>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              <div>
                <label className="form-label">Celular</label>
                <div className="result-box" style={{ padding: '8px 12px', fontSize: 12 }}>
                  <span>{person.celular}</span>
                  <button className="btn-icon" onClick={() => copyVal('celular', person.celular)}>
                    {copiedField === 'celular' ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="form-label">CEP</label>
                <div className="result-box" style={{ padding: '8px 12px', fontSize: 12 }}>
                  <span>{person.cep}</span>
                  <button className="btn-icon" onClick={() => copyVal('cep', person.cep)}>
                    {copiedField === 'cep' ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
                  </button>
                </div>
              </div>
            </div>

            <div>
              <span className="form-label">Endereço Residencial</span>
              <div style={{ fontSize: 13, color: 'var(--text-primary)', marginTop: 4 }}>
                {person.endereco}
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>
                Bairro: {person.bairro} · {person.cidade} - {person.uf}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="panel-footer">
        <span>Perfis fictícios para preenchimento de formulários e testes de software</span>
        <span>Dados gerados aleatoriamente</span>
      </div>
    </div>
  );
}
