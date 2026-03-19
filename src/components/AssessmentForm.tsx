import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Shield, CheckCircle } from 'lucide-react';
import type { AssessmentData } from '../App';

interface AssessmentFormProps {
  onSubmit: (data: Omit<AssessmentData, 'id' | 'timestamp'>) => void;
}

const securityControls = [
  { key: 'hasFirewall', label: 'Firewall Corporativo', desc: 'Filtragem de tráfego de rede' },
  { key: 'hasAntivirus', label: 'Antivírus / Antimalware', desc: 'Proteção de endpoints' },
  { key: 'hasBackup', label: 'Backup Regular de Dados', desc: 'Cópias de segurança automatizadas' },
  { key: 'hasTraining', label: 'Treinamento de Segurança', desc: 'Conscientização de colaboradores' },
  { key: 'hasIncidentResponse', label: 'Plano de Resposta a Incidentes', desc: 'Procedimentos documentados' },
  { key: 'hasAccessControl', label: 'Controle de Acesso (IAM)', desc: 'Gestão de identidades e permissões' },
  { key: 'hasEncryption', label: 'Criptografia de Dados', desc: 'Proteção de dados em repouso e trânsito' },
  { key: 'hasMonitoring', label: 'Monitoramento 24/7', desc: 'SIEM e detecção de anomalias' },
];

export function AssessmentForm({ onSubmit }: AssessmentFormProps) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    companyName: '',
    industry: '',
    employeeCount: '',
    hasFirewall: false,
    hasAntivirus: false,
    hasBackup: false,
    hasTraining: false,
    hasIncidentResponse: false,
    hasAccessControl: false,
    hasEncryption: false,
    hasMonitoring: false,
    updateFrequency: '',
    dataClassification: '',
    cloudUsage: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    navigate('/dashboard');
  };

  const toggle = (field: string) => {
    setFormData(prev => ({ ...prev, [field]: !prev[field as keyof typeof prev] }));
  };

  const checkedCount = securityControls.filter(c => formData[c.key as keyof typeof formData]).length;

  return (
    <div className="page-container">
      <div className="dash-header">
        <div>
          <h1 className="page-title">Nova Avaliação de Segurança</h1>
          <p className="page-subtitle">Preencha o formulário para gerar uma análise completa de riscos</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="form-card">

        {/* Empresa */}
        <section className="form-section">
          <div className="form-section-header">
            <Building2 className="w-5 h-5" />
            <h2>Informações da Empresa</h2>
          </div>
          <div className="form-grid-2">
            <div className="form-field">
              <label htmlFor="companyName">Nome da Empresa *</label>
              <input
                type="text" id="companyName"
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                placeholder="Ex: Acme Corp"
                required
              />
            </div>
            <div className="form-field">
              <label htmlFor="industry">Setor *</label>
              <select id="industry" value={formData.industry}
                onChange={(e) => setFormData({ ...formData, industry: e.target.value })} required>
                <option value="">Selecione...</option>
                <option value="tecnologia">Tecnologia</option>
                <option value="financeiro">Financeiro</option>
                <option value="saude">Saúde</option>
                <option value="varejo">Varejo</option>
                <option value="educacao">Educação</option>
                <option value="industria">Indústria</option>
                <option value="servicos">Serviços</option>
                <option value="outro">Outro</option>
              </select>
            </div>
            <div className="form-field">
              <label htmlFor="employeeCount">Número de Funcionários *</label>
              <select id="employeeCount" value={formData.employeeCount}
                onChange={(e) => setFormData({ ...formData, employeeCount: e.target.value })} required>
                <option value="">Selecione...</option>
                <option value="1-10">1–10</option>
                <option value="11-50">11–50</option>
                <option value="51-200">51–200</option>
                <option value="201-500">201–500</option>
                <option value="500+">500+</option>
              </select>
            </div>
            <div className="form-field">
              <label htmlFor="cloudUsage">Uso de Nuvem *</label>
              <select id="cloudUsage" value={formData.cloudUsage}
                onChange={(e) => setFormData({ ...formData, cloudUsage: e.target.value })} required>
                <option value="">Selecione...</option>
                <option value="nenhum">Nenhum</option>
                <option value="basico">Básico</option>
                <option value="moderado">Moderado</option>
                <option value="extensivo">Extensivo</option>
              </select>
            </div>
          </div>
        </section>

        {/* Controles */}
        <section className="form-section">
          <div className="form-section-header">
            <Shield className="w-5 h-5" />
            <h2>Controles de Segurança</h2>
            <span className="controls-counter">{checkedCount}/{securityControls.length} implementados</span>
          </div>
          <div className="controls-progress">
            <div className="controls-progress-fill" style={{ width: `${(checkedCount / securityControls.length) * 100}%` }} />
          </div>
          <div className="controls-grid">
            {securityControls.map(({ key, label, desc }) => {
              const checked = formData[key as keyof typeof formData] as boolean;
              return (
                <label key={key} className={`control-item ${checked ? 'control-item--checked' : ''}`}>
                  <input type="checkbox" checked={checked} onChange={() => toggle(key)} className="control-checkbox" />
                  <div className="control-item-body">
                    <span className="control-label">{label}</span>
                    <span className="control-desc">{desc}</span>
                  </div>
                  {checked && <CheckCircle className="w-4 h-4 control-check-icon" />}
                </label>
              );
            })}
          </div>
        </section>

        {/* Políticas */}
        <section className="form-section">
          <div className="form-section-header">
            <CheckCircle className="w-5 h-5" />
            <h2>Políticas e Procedimentos</h2>
          </div>
          <div className="form-grid-2">
            <div className="form-field">
              <label htmlFor="updateFrequency">Frequência de Atualizações *</label>
              <select id="updateFrequency" value={formData.updateFrequency}
                onChange={(e) => setFormData({ ...formData, updateFrequency: e.target.value })} required>
                <option value="">Selecione...</option>
                <option value="automatico">Automático</option>
                <option value="semanal">Semanal</option>
                <option value="mensal">Mensal</option>
                <option value="trimestral">Trimestral</option>
                <option value="irregular">Irregular</option>
              </select>
            </div>
            <div className="form-field">
              <label htmlFor="dataClassification">Classificação de Dados *</label>
              <select id="dataClassification" value={formData.dataClassification}
                onChange={(e) => setFormData({ ...formData, dataClassification: e.target.value })} required>
                <option value="">Selecione...</option>
                <option value="nenhum">Sem classificação</option>
                <option value="basico">Básica</option>
                <option value="formal">Formal implementada</option>
                <option value="avancado">Avançado com DLP</option>
              </select>
            </div>
          </div>
        </section>

        <div className="form-actions">
          <button type="button" onClick={() => navigate('/dashboard')} className="btn-ghost">
            Cancelar
          </button>
          <button type="submit" className="btn-primary">
            Gerar Análise de Risco
          </button>
        </div>
      </form>
    </div>
  );
}
