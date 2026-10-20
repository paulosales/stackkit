import React from 'react';
import { Shield, Lock, Eye, CheckCircle2, ArrowLeft, Cookie, ServerOff, HelpCircle } from 'lucide-react';

export default function PrivacyPolicy({ onGoBack, lang = 'pt' }) {
  const isPt = lang === 'pt';

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
          <span>{isPt ? 'Voltar' : 'Back'}</span>
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
          <span>{isPt ? 'Segurança & Privacidade' : 'Security & Privacy'}</span>
        </div>
        <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8, letterSpacing: '-0.02em' }}>
          {isPt ? 'Política de Privacidade' : 'Privacy Policy'}
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>
          {isPt ? 'Última atualização: 19 de Outubro de 2026 · Versão 2.1' : 'Last updated: October 19, 2026 · Version 2.1'}
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
              {isPt ? 'Processamento 100% Client-Side' : '100% Client-Side Processing'}
            </h4>
            <p style={{ fontSize: 12.5, color: 'var(--text-secondary)', margin: 0 }}>
              {isPt
                ? 'Seus dados, códigos, senhas e documentos digitados nunca são transmitidos para servidores do StackKit.'
                : 'Your inputs, codes, passwords, and documents are processed locally and never sent to our servers.'}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12 }}>
          <Lock size={22} className="text-emerald" style={{ flexShrink: 0, marginTop: 2 }} />
          <div>
            <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>
              {isPt ? 'Conformidade LGPD & GDPR' : 'LGPD & GDPR Compliant'}
            </h4>
            <p style={{ fontSize: 12.5, color: 'var(--text-secondary)', margin: 0 }}>
              {isPt
                ? 'Respeito total aos direitos de privacidade do usuário e minimização estrita na coleta de dados.'
                : 'Full respect for user privacy rights and strict data minimization.'}
            </p>
          </div>
        </div>
      </div>

      <div className="compliance-content" style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
        <section>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>
            {isPt ? '1. Introdução e Compromisso' : '1. Introduction and Commitment'}
          </h2>
          <p>
            {isPt
              ? 'No StackKit DevStudio (disponível em https://stackkit.com.br), acessível a desenvolvedores e profissionais em todo o mundo, a privacidade dos nossos visitantes é uma das nossas prioridades centrais. Esta Política de Privacidade descreve os tipos de informações coletadas e registradas pelo StackKit e como as utilizamos.'
              : 'At StackKit DevStudio (available at https://stackkit.com.br), accessible to developers and professionals worldwide, the privacy of our visitors is one of our main priorities. This Privacy Policy document outlines the types of information collected and recorded by StackKit and how we use it.'}
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>
            {isPt ? '2. Arquitetura Client-Side (Zero Armazenamento de Dados)' : '2. Client-Side Architecture (Zero Server Storage)'}
          </h2>
          <p>
            {isPt
              ? 'Ao contrário de plataformas convencionais da web, o StackKit foi projetado com uma arquitetura técnica client-side estrita. Quando você utiliza ferramentas como Gerador de CPF, Validador de CNPJ, JWT Inspector, Formatador JSON, Gerador de Senhas ou Simulador de Cidadania Canadense, toda a lógica matemática, análise sintática e geração de chaves ocorre estritamente no motor JavaScript do seu navegador local.'
              : 'Unlike conventional web platforms, StackKit was engineered with a strict client-side technical architecture. When you use tools such as the CPF Generator, CNPJ Validator, JWT Inspector, JSON Formatter, Password Generator, or Canadian Citizenship Test Simulator, all mathematical algorithms, syntax parsers, and cryptographic key derivations execute strictly within your local browser JavaScript engine.'}
          </p>
          <p>
            {isPt
              ? 'Nenhum token JWT, código-fonte, payload JSON, texto confidencial ou número de documento digitado por você é enviado para nossos servidores ou para terceiros.'
              : 'No JWT tokens, source code, JSON payloads, confidential text, or document numbers entered by you are ever transmitted to our servers or third parties.'}
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
            {isPt ? '3. Publicidade e Cookies do Google AdSense' : '3. Google AdSense Advertising & Cookies Policy'}
          </h2>
          <p>
            {isPt
              ? 'O StackKit exibe anúncios veiculados pelo Google AdSense para subsidiar a manutenção dos serviços e garantir que todas as ferramentas permaneçam 100% gratuitas.'
              : 'StackKit displays advertisements served by Google AdSense to fund ongoing hosting, development, and ensure all developer utilities remain 100% free of charge.'}
          </p>
          <p>
            <strong>{isPt ? 'Declaração Obrigatória do Google AdSense:' : 'Mandatory Google AdSense Disclosures:'}</strong>
          </p>
          <ul style={{ paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <li>
              {isPt
                ? 'Fornecedores terceiros, incluindo o Google, utilizam cookies para veicular anúncios com base nas visitas anteriores do usuário a este site ou a outros sites na internet.'
                : 'Third-party vendors, including Google, use cookies to serve ads based on a user\'s prior visits to your website or other websites.'}
            </li>
            <li>
              {isPt
                ? 'O uso de cookies de publicidade pelo Google permite que ele e seus parceiros veiculem anúncios para seus usuários com base nas visitas a seus sites e/ou outros sites na internet.'
                : 'Google\'s use of advertising cookies enables it and its partners to serve ads to users based on their visits to this site and/or other sites on the Internet.'}
            </li>
            <li>
              {isPt
                ? 'Os usuários podem desativar a publicidade personalizada acessando as Configurações de Anúncios do Google em: '
                : 'Users may opt out of personalized advertising by visiting Google Ads Settings at: '}
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
              {isPt
                ? 'Alternativamente, você pode desativar o uso de cookies de fornecedores terceiros para publicidade personalizada acessando o portal '
                : 'Alternatively, users can opt out of third-party vendor use of cookies for personalized advertising by visiting '}
              <a
                href="https://www.aboutads.info/choices/"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: 'var(--accent-cyan)', textDecoration: 'underline' }}
              >
                www.aboutads.info/choices/
              </a>
              {isPt ? ' ou ' : ' or '}
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
            {isPt ? '4. Arquivos de Log e Métricas de Navegação' : '4. Log Files and Web Analytics'}
          </h2>
          <p>
            {isPt
              ? 'Como a maioria dos servidores web, utilizamos arquivos de log padrão. Essas informações incluem endereços de protocolo de internet (IP), tipo de navegador, Provedor de Serviços de Internet (ISP), carimbo de data/hora, páginas de referência/saída e número de cliques. Essas informações não estão vinculadas a nenhuma informação pessoalmente identificável e destinam-se exclusivamente à análise de tendências técnicas e integridade do serviço.'
              : 'Like most websites, our hosting platform collects standard log files. Information recorded includes internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and click counts. These metrics are not linked to personally identifiable information and serve exclusively to analyze platform performance and prevent malicious traffic.'}
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>
            {isPt ? '5. Armazenamento Local no Navegador (LocalStorage)' : '5. Browser Local Storage (LocalStorage)'}
          </h2>
          <p>
            {isPt
              ? 'O StackKit utiliza o recurso LocalStorage do seu navegador para guardar exclusivamente suas preferências de uso: tema claro ou escuro, idioma preferido (Português ou Inglês), estado da barra lateral e lista de ferramentas marcadas como favoritas. Nenhum dado de LocalStorage é transmitido externamente.'
              : 'StackKit utilizes your browser\'s native LocalStorage strictly to store your interface preferences: selected theme (dark or light), preferred language (Portuguese or English), sidebar state, and your list of favorited tools. No LocalStorage data is ever synchronized or transmitted remotely.'}
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>
            {isPt ? '6. Direitos do Titular (LGPD e GDPR)' : '6. Privacy Rights (LGPD and GDPR)'}
          </h2>
          <p>
            {isPt
              ? 'Em conformidade com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018 - LGPD) do Brasil e com o Regulamento Geral sobre a Proteção de Dados (GDPR) da União Europeia, garantimos a todos os usuários total transparência, direito de confirmação de tratamento de dados, revogação de consentimento de cookies publicitários e acesso irrestrito.'
              : 'In accordance with Brazil\'s Lei Geral de Proteção de Dados (Law No. 13.709/2018 - LGPD) and the European Union General Data Protection Regulation (GDPR), we ensure full transparency, rights of access, and instant cookie consent revocation.'}
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>
            {isPt ? '7. Contato com o Encarregado de Privacidade' : '7. Contacting the Privacy Officer'}
          </h2>
          <p>
            {isPt
              ? 'Se você tiver qualquer dúvida adicional ou precisar de mais esclarecimentos sobre nossa Política de Privacidade, não hesite em entrar em contato conosco pelo e-mail: contato@stackkit.com.br.'
              : 'If you have questions or require further clarification regarding our Privacy Policy, please contact our team at: contato@stackkit.com.br.'}
          </p>
        </section>
      </div>
    </div>
  );
}
