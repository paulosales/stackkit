import React from 'react';
import { Code2, ShieldCheck, Zap, Globe, ArrowLeft, Mail, Heart, Cpu, CheckCircle } from 'lucide-react';

export default function AboutUs({ onGoBack, lang = 'pt' }) {
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
          background: 'rgba(139, 92, 246, 0.12)',
          color: 'var(--accent-purple)',
          fontSize: 12,
          fontWeight: 600,
          marginBottom: 12
        }}>
          <Code2 size={14} />
          <span>{isPt ? 'Sobre o Projeto' : 'About the Project'}</span>
        </div>
        <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 8, letterSpacing: '-0.02em' }}>
          {isPt ? 'Sobre o StackKit DevStudio' : 'About StackKit DevStudio'}
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>
          {isPt ? 'A Estação de Trabalho Definitiva para Desenvolvedores Modernos' : 'The Definitive Workstation for Modern Developers'}
        </p>
      </header>

      {/* Mission Banner */}
      <div style={{
        background: 'var(--bg-surface-elevated)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-xl)',
        padding: '32px',
        marginBottom: 36
      }}>
        <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 12, color: 'var(--accent-cyan)' }}>
          {isPt ? 'Nossa Missão' : 'Our Mission'}
        </h3>
        <p style={{ fontSize: 15, lineHeight: 1.7, margin: 0, color: 'var(--text-secondary)' }}>
          {isPt
            ? 'O StackKit DevStudio nasceu com um objetivo claro: fornecer a melhor, mais veloz e mais confiável suíte de utilitários para desenvolvedores, engenheiros de QA e criadores digitais. Eliminamos o atrito de anúncios invasivos, interfaces poluídas e ferramentas lentas que enviam dados para servidores desconhecidos.'
            : 'StackKit DevStudio was built with a clear purpose: to provide the fastest, most reliable, and beautifully engineered workstation for software engineers, QA professionals, and digital creators worldwide. We eliminate invasive ads, bloated interfaces, and slow tools that transmit sensitive data to mystery servers.'}
        </p>
      </div>

      {/* Core Pillars Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: 20,
        marginBottom: 36
      }}>
        <div style={{
          padding: 24,
          borderRadius: 'var(--radius-lg)',
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)'
        }}>
          <div style={{
            width: 40, height: 40, borderRadius: 'var(--radius-md)',
            background: 'rgba(6, 182, 212, 0.15)', color: 'var(--accent-cyan)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16
          }}>
            <ShieldCheck size={22} />
          </div>
          <h4 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>
            {isPt ? '100% Client-Side & Privado' : '100% Client-Side Privacy'}
          </h4>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            {isPt
              ? 'Toda a computação — de validações fiscais e tokens JWT a conversões e hashes — é executada no seu próprio navegador através do motor Web Crypto e JavaScript.'
              : 'All computing — from fiscal check digits and JWT tokens to conversions and hashes — executes in your local browser runtime via Web Crypto and native JS.'}
          </p>
        </div>

        <div style={{
          padding: 24,
          borderRadius: 'var(--radius-lg)',
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)'
        }}>
          <div style={{
            width: 40, height: 40, borderRadius: 'var(--radius-md)',
            background: 'rgba(16, 185, 129, 0.15)', color: 'var(--accent-emerald)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16
          }}>
            <Zap size={22} />
          </div>
          <h4 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>
            {isPt ? 'Performance Instantânea' : 'Instant Performance'}
          </h4>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            {isPt
              ? 'Construído com React e Vite de última geração. Zero latência de rede, inicialização em milissegundos e atalhos de teclado (Ctrl+K) para produtividade máxima.'
              : 'Engineered with React and Vite. Zero server latency, sub-millisecond responsiveness, and full keyboard navigation (Ctrl+K) for high productivity.'}
          </p>
        </div>

        <div style={{
          padding: 24,
          borderRadius: 'var(--radius-lg)',
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-subtle)'
        }}>
          <div style={{
            width: 40, height: 40, borderRadius: 'var(--radius-md)',
            background: 'rgba(139, 92, 246, 0.15)', color: 'var(--accent-purple)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16
          }}>
            <Globe size={22} />
          </div>
          <h4 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>
            {isPt ? 'Padrões Globais & Brasil' : 'Global Standards & Brazil'}
          </h4>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            {isPt
              ? 'Suporte completo a padrões fiscais brasileiros (CPF, CNPJ 2026, INSS, CNJ) e especificações mundiais (RFC 7519, RFC 8259, IANA Time Zones).'
              : 'Comprehensive support for Brazilian fiscal specifications (CPF, Alphanumeric CNPJ, INSS, CNJ) and global RFC standards.'}
          </p>
        </div>
      </div>

      {/* Contact Section */}
      <section style={{
        padding: 28,
        borderRadius: 'var(--radius-lg)',
        background: 'var(--bg-surface-elevated)',
        border: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 20
      }}>
        <div>
          <h4 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>
            {isPt ? 'Dúvidas, Sugestões ou Parcerias?' : 'Feedback, Bug Reports & Inquiries'}
          </h4>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: 0 }}>
            {isPt
              ? 'Tem uma sugestão de nova ferramenta ou encontrou um bug? Adoraríamos ouvir você.'
              : 'Have a feature request, new tool suggestion, or bug report? We would love to hear from you.'}
          </p>
        </div>
        <a
          href="mailto:contato@stackkit.com.br"
          className="btn-primary"
          style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8 }}
        >
          <Mail size={16} />
          <span>contato@stackkit.com.br</span>
        </a>
      </section>
    </div>
  );
}
