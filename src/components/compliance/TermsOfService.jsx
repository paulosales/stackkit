import React from 'react';
import { FileText, CheckCircle2, ArrowLeft, AlertTriangle, Scale, Code } from 'lucide-react';

export default function TermsOfService({ onGoBack, lang = 'pt' }) {
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
          background: 'rgba(16, 185, 129, 0.12)',
          color: 'var(--accent-emerald)',
          fontSize: 12,
          fontWeight: 600,
          marginBottom: 12
        }}>
          <Scale size={14} />
          <span>{isPt ? 'Termos Legais' : 'Legal Terms'}</span>
        </div>
        <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8, letterSpacing: '-0.02em' }}>
          {isPt ? 'Termos de Uso e Serviço' : 'Terms of Service'}
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>
          {isPt ? 'Última atualização: 19 de Outubro de 2026 · Versão 2.1' : 'Last updated: October 19, 2026 · Version 2.1'}
        </p>
      </header>

      <div className="compliance-content" style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
        <section>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>
            {isPt ? '1. Aceitação dos Termos' : '1. Acceptance of Terms'}
          </h2>
          <p>
            {isPt
              ? 'Ao acessar e utilizar o StackKit DevStudio (https://stackkit.com.br), você concorda integralmente em cumprir e vincular-se a estes Termos de Uso. Caso não concorde com qualquer disposição aqui estabelecida, solicitamos que não utilize nossos serviços.'
              : 'By accessing and utilizing StackKit DevStudio (https://stackkit.com.br), you agree to comply with and be bound by these Terms of Service. If you disagree with any portion of these terms, please discontinue using our platform.'}
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
            {isPt ? '2. Finalidade Educacional e Testes de Software' : '2. Educational and Software Testing Purpose'}
          </h2>
          <p>
            {isPt
              ? 'O StackKit DevStudio disponibiliza ferramentas de geração de documentos e identificadores matemáticos (como CPF, CNPJ, RG, Número de Benefício INSS, Processos Judiciais CNJ e Cartões de Crédito de Teste). Todas essas ferramentas foram criadas com o propósito estrito de servir a desenvolvedores, engenheiros de qualidade (QA), estudantes e analistas para testes de homologação de software, testes unitários e validação de formulários.'
              : 'StackKit DevStudio provides utilities for generating mathematical documents and identifiers (such as CPF, CNPJ, RG, INSS Benefit Numbers, CNJ Lawsuits, and Synthetic Credit Cards). All these tools exist strictly to assist software engineers, QA professionals, students, and analysts with system validation, unit testing, and form debugging.'}
          </p>
          <p>
            <strong>{isPt ? 'Aviso Importante:' : 'Important Notice:'}</strong> {isPt
              ? 'Os números gerados NÃO representam pessoas reais e NÃO possuem validade comercial, fiscal ou creditícia. É expressamente proibido o uso de qualquer dado gerado nesta plataforma para fraudes, falsidade ideológica, abertura ilícita de contas ou qualquer conduta que viole as leis vigentes.'
              : 'Generated numbers DO NOT represent real persons or entities and hold zero legal, tax, or commercial value. Using any data generated on this platform for unlawful conduct, impersonation, fraudulent transactions, or commercial deception is strictly forbidden.'}
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>
            {isPt ? '3. Propriedade Intelectual e Licenciamento' : '3. Intellectual Property & Open Standards'}
          </h2>
          <p>
            {isPt
              ? 'O StackKit implementa especificações abertas da internet (como RFC 7519 para JWT, RFC 8259 para JSON, RFC 4648 para Base64, e algoritmos de Módulo 11 da Receita Federal). O design, código e interface do estúdio são protegidos pelas leis de propriedade intelectual.'
              : 'StackKit implements recognized open standards (such as RFC 7519 for JWT, RFC 8259 for JSON, RFC 4648 for Base64, and official public algorithms). The platform design and software implementation are protected by copyright and intellectual property legislation.'}
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>
            {isPt ? '4. Isenção de Garantias' : '4. Disclaimer of Warranties'}
          </h2>
          <p>
            {isPt
              ? 'O serviço é fornecido "como está" (as is) e "conforme disponível" (as available), sem garantias expressas ou implícitas de qualquer natureza. O StackKit não se responsabiliza por eventuais indisponibilidades técnicas, erros em cálculos ou incompatibilidades.'
              : 'The service is provided on an "as is" and "as available" basis without warranties of any kind. StackKit makes no representations regarding uninterrupted access or absolute infallibility of third-party network APIs.'}
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>
            {isPt ? '5. Foro e Legislação Aplicável' : '5. Governing Law'}
          </h2>
          <p>
            {isPt
              ? 'Estes Termos de Uso são regidos e interpretados de acordo com a legislação da República Federativa do Brasil, em particular o Marco Civil da Internet (Lei nº 12.965/2014) e o Código de Defesa do Consumidor.'
              : 'These Terms shall be governed and construed in accordance with the laws of the Federative Republic of Brazil, notably the Marco Civil da Internet (Law No. 12.965/2014).'}
          </p>
        </section>
      </div>
    </div>
  );
}
