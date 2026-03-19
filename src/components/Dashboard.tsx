import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Shield, AlertTriangle, TrendingUp, Activity,
  Plus, ChevronDown, Building2, Calendar,
} from 'lucide-react';
import {
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  Radar, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell,
  AreaChart, Area,
} from 'recharts';
import type { AssessmentData } from '../App';

interface DashboardProps {
  assessments: AssessmentData[];
  selectedId: string;
  onSelectId: (id: string) => void;
}

interface RiskAnalysis {
  overallScore: number;
  riskLevel: 'Baixo' | 'Médio' | 'Alto' | 'Crítico';
  threats: Array<{ type: string; probability: number; impact: number }>;
  vulnerabilities: Array<{ area: string; severity: string; description: string }>;
  recommendations: Array<{ priority: string; action: string }>;
}

function computeScore(a: AssessmentData): number {
  let score = 100;
  if (!a.hasFirewall) score -= 15;
  if (!a.hasAntivirus) score -= 12;
  if (!a.hasBackup) score -= 10;
  if (!a.hasTraining) score -= 8;
  if (!a.hasIncidentResponse) score -= 10;
  if (!a.hasAccessControl) score -= 12;
  if (!a.hasEncryption) score -= 10;
  if (!a.hasMonitoring) score -= 8;
  if (a.updateFrequency === 'irregular') score -= 10;
  if (a.updateFrequency === 'trimestral') score -= 5;
  if (a.dataClassification === 'nenhum') score -= 8;
  return Math.max(0, score);
}

function getRiskLevel(score: number): RiskAnalysis['riskLevel'] {
  if (score >= 80) return 'Baixo';
  if (score >= 60) return 'Médio';
  if (score >= 40) return 'Alto';
  return 'Crítico';
}

const COLORS = ['#f43f5e', '#f59e0b', '#eab308', '#84cc16', '#22c55e', '#06b6d4'];
const INDUSTRY_LABELS: Record<string, string> = {
  tecnologia: 'Tecnologia', financeiro: 'Financeiro', saude: 'Saúde',
  varejo: 'Varejo', educacao: 'Educação', industria: 'Indústria',
  servicos: 'Serviços', outro: 'Outro',
};

const getRiskColor = (level: string) => {
  switch (level) {
    case 'Baixo': return 'risk-low';
    case 'Médio': return 'risk-medium';
    case 'Alto': return 'risk-high';
    case 'Crítico': return 'risk-critical';
    default: return 'risk-default';
  }
};

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case 'Crítica': return 'risk-critical';
    case 'Alta': return 'risk-high';
    case 'Média': return 'risk-medium';
    default: return 'risk-low';
  }
};

export function Dashboard({ assessments, selectedId, onSelectId }: DashboardProps) {
  const navigate = useNavigate();
  const [showSelector, setShowSelector] = useState(false);

  const selected = assessments.find(a => a.id === selectedId) ?? assessments[assessments.length - 1];

  const riskAnalysis = useMemo<RiskAnalysis | null>(() => {
    if (!selected) return null;
    const score = computeScore(selected);
    const riskLevel = getRiskLevel(score);

    const threats = [
      { type: 'Phishing', probability: selected.hasTraining ? 30 : 75, impact: 70 },
      { type: 'Ransomware', probability: selected.hasBackup ? 25 : 65, impact: 90 },
      { type: 'DDoS', probability: selected.hasFirewall ? 20 : 55, impact: 60 },
      { type: 'Malware', probability: selected.hasAntivirus ? 15 : 70, impact: 75 },
      { type: 'Insider Threat', probability: selected.hasAccessControl ? 20 : 50, impact: 80 },
      { type: 'Data Breach', probability: selected.hasEncryption ? 15 : 60, impact: 95 },
    ];

    const vulnerabilities: RiskAnalysis['vulnerabilities'] = [];
    if (!selected.hasFirewall) vulnerabilities.push({ area: 'Perímetro de Rede', severity: 'Alta', description: 'Ausência de firewall expõe a rede a ataques externos' });
    if (!selected.hasBackup) vulnerabilities.push({ area: 'Continuidade de Negócios', severity: 'Crítica', description: 'Sem backup regular, dados podem ser perdidos permanentemente' });
    if (!selected.hasTraining) vulnerabilities.push({ area: 'Fator Humano', severity: 'Alta', description: 'Funcionários não treinados são vulneráveis a engenharia social' });
    if (!selected.hasEncryption) vulnerabilities.push({ area: 'Proteção de Dados', severity: 'Alta', description: 'Dados não criptografados podem ser interceptados' });
    if (!selected.hasIncidentResponse) vulnerabilities.push({ area: 'Resposta a Incidentes', severity: 'Média', description: 'Sem plano de resposta, ataques causam maior impacto operacional' });

    const recommendations: RiskAnalysis['recommendations'] = [];
    if (!selected.hasFirewall) recommendations.push({ priority: 'Crítica', action: 'Implementar firewall de próxima geração (NGFW)' });
    if (!selected.hasBackup) recommendations.push({ priority: 'Crítica', action: 'Estabelecer rotina de backup automático com teste de restauração' });
    if (!selected.hasTraining) recommendations.push({ priority: 'Alta', action: 'Implementar programa de conscientização em segurança' });
    if (!selected.hasEncryption) recommendations.push({ priority: 'Alta', action: 'Implementar criptografia end-to-end para dados sensíveis' });
    if (!selected.hasMonitoring) recommendations.push({ priority: 'Média', action: 'Estabelecer monitoramento contínuo com SIEM' });
    if (!selected.hasIncidentResponse) recommendations.push({ priority: 'Alta', action: 'Criar e testar plano formal de resposta a incidentes' });

    return { overallScore: score, riskLevel, threats, vulnerabilities, recommendations };
  }, [selected]);

  const securityPosture = useMemo(() => {
    if (!selected) return [];
    return [
      { category: 'Perímetro', score: (selected.hasFirewall ? 50 : 0) + (selected.hasMonitoring ? 50 : 0) },
      { category: 'Endpoint', score: (selected.hasAntivirus ? 60 : 0) + (selected.hasEncryption ? 40 : 0) },
      { category: 'Identidade', score: selected.hasAccessControl ? 100 : 20 },
      { category: 'Incidentes', score: selected.hasIncidentResponse ? 100 : 15 },
      { category: 'Backup', score: selected.hasBackup ? 100 : 0 },
      { category: 'Treinamento', score: selected.hasTraining ? 100 : 10 },
    ];
  }, [selected]);

  const threatDistribution = useMemo(() => {
    if (!riskAnalysis) return [];
    return riskAnalysis.threats.map(t => ({ name: t.type, value: t.probability }));
  }, [riskAnalysis]);

  // Dados para AreaChart de tendência
  const trendData = useMemo(() => {
    return [...assessments]
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
      .map(a => ({
        name: a.companyName.length > 10 ? a.companyName.split(' ')[0] : a.companyName,
        score: computeScore(a),
        date: new Date(a.timestamp).toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' }),
      }));
  }, [assessments]);

  // Dados para BarChart comparativo
  const comparisonData = useMemo(() => {
    return assessments.map(a => ({
      name: a.companyName.split(' ')[0],
      score: computeScore(a),
      nivel: getRiskLevel(computeScore(a)),
    }));
  }, [assessments]);

  const getBarColor = (score: number) => {
    if (score >= 80) return '#22c55e';
    if (score >= 60) return '#eab308';
    if (score >= 40) return '#f97316';
    return '#ef4444';
  };

  if (!selected || !riskAnalysis) {
    return (
      <div className="page-container">
        <div className="empty-state">
          <div className="empty-state-icon"><Shield className="w-12 h-12" /></div>
          <h2>Nenhuma Avaliação</h2>
          <p>Complete uma avaliação para visualizar a análise de riscos</p>
          <button onClick={() => navigate('/assessment')} className="btn-primary">
            <Plus className="w-4 h-4" /> Nova Avaliação
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      {/* Header */}
      <div className="dash-header">
        <div>
          <h1 className="page-title">Dashboard de Riscos Cibernéticos</h1>
          <p className="page-subtitle">Análise de segurança · {assessments.length} avaliações carregadas</p>
        </div>

        {/* Assessment Selector */}
        <div className="selector-wrap">
          <button className="selector-btn" onClick={() => setShowSelector(v => !v)}>
            <Building2 className="w-4 h-4" />
            <span>{selected.companyName}</span>
            <ChevronDown className={`w-4 h-4 selector-chevron ${showSelector ? 'open' : ''}`} />
          </button>
          {showSelector && (
            <div className="selector-dropdown">
              {assessments.map(a => {
                const s = computeScore(a);
                return (
                  <button
                    key={a.id}
                    className={`selector-option ${a.id === selectedId ? 'active' : ''}`}
                    onClick={() => { onSelectId(a.id); setShowSelector(false); }}
                  >
                    <div className="selector-option-top">
                      <span className="selector-company">{a.companyName}</span>
                      <span className={`selector-badge ${getRiskColor(getRiskLevel(s))}`}>{s}</span>
                    </div>
                    <div className="selector-option-meta">
                      <Calendar className="w-3 h-3" />
                      {new Date(a.timestamp).toLocaleDateString('pt-BR')} · {INDUSTRY_LABELS[a.industry] ?? a.industry}
                    </div>
                  </button>
                );
              })}
              <div className="selector-footer">
                <button onClick={() => { navigate('/assessment'); setShowSelector(false); }} className="selector-new">
                  <Plus className="w-3 h-3" /> Nova Avaliação
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="kpi-grid">
        <div className={`kpi-card kpi-risk ${getRiskColor(riskAnalysis.riskLevel)}`}>
          <div className="kpi-icon"><Shield className="w-5 h-5" /></div>
          <div className="kpi-content">
            <span className="kpi-label">Nível de Risco</span>
            <span className="kpi-value">{riskAnalysis.riskLevel}</span>
          </div>
          <div className="kpi-score-ring">
            <svg viewBox="0 0 36 36" className="kpi-ring-svg">
              <path className="kpi-ring-bg" d="M18 2.0845 a15.9155 15.9155 0 0 1 0 31.831 a15.9155 15.9155 0 0 1 0 -31.831" />
              <path
                className="kpi-ring-fill"
                strokeDasharray={`${riskAnalysis.overallScore}, 100`}
                d="M18 2.0845 a15.9155 15.9155 0 0 1 0 31.831 a15.9155 15.9155 0 0 1 0 -31.831"
              />
              <text x="18" y="22" className="kpi-ring-text">{riskAnalysis.overallScore}</text>
            </svg>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon kpi-icon--blue"><Activity className="w-5 h-5" /></div>
          <div className="kpi-content">
            <span className="kpi-label">Score de Segurança</span>
            <span className="kpi-value">{riskAnalysis.overallScore}<small>/100</small></span>
          </div>
          <div className="kpi-bar-wrap">
            <div className="kpi-bar" style={{ width: `${riskAnalysis.overallScore}%` }} />
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon kpi-icon--orange"><AlertTriangle className="w-5 h-5" /></div>
          <div className="kpi-content">
            <span className="kpi-label">Vulnerabilidades</span>
            <span className="kpi-value">{riskAnalysis.vulnerabilities.length}</span>
          </div>
          <div className="kpi-sub">identificadas</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon kpi-icon--purple"><TrendingUp className="w-5 h-5" /></div>
          <div className="kpi-content">
            <span className="kpi-label">Ameaças Mapeadas</span>
            <span className="kpi-value">{riskAnalysis.threats.length}</span>
          </div>
          <div className="kpi-sub">tipos de ataque</div>
        </div>
      </div>

      {/* Trend + Comparison Charts */}
      <div className="charts-grid-2">
        <div className="chart-card">
          <h2 className="chart-title">Tendência de Score por Empresa</h2>
          <p className="chart-subtitle">Evolução do nível de segurança entre avaliações</p>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 11 }} />
              <YAxis domain={[0, 100]} tick={{ fill: '#94a3b8', fontSize: 11 }} />
              <Tooltip
                contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8, color: '#e2e8f0' }}
                labelStyle={{ color: '#94a3b8' }}
              />
              <Area type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={2} fill="url(#scoreGrad)" dot={{ fill: '#6366f1', strokeWidth: 2, r: 4 }} activeDot={{ r: 6 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h2 className="chart-title">Comparativo de Scores</h2>
          <p className="chart-subtitle">Score de segurança por empresa avaliada</p>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={comparisonData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 11 }} />
              <YAxis domain={[0, 100]} tick={{ fill: '#94a3b8', fontSize: 11 }} />
              <Tooltip
                contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8, color: '#e2e8f0' }}
              />
              <Bar dataKey="score" radius={[4, 4, 0, 0]}>
                {comparisonData.map((entry, index) => (
                  <Cell key={index} fill={entry.name === selected.companyName.split(' ')[0] ? '#6366f1' : getBarColor(entry.score)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Radar + Pie */}
      <div className="charts-grid-2">
        <div className="chart-card">
          <h2 className="chart-title">Postura de Segurança</h2>
          <p className="chart-subtitle">{selected.companyName} · cobertura por domínio</p>
          <ResponsiveContainer width="100%" height={280}>
            <RadarChart data={securityPosture}>
              <PolarGrid stroke="rgba(255,255,255,0.1)" />
              <PolarAngleAxis dataKey="category" tick={{ fill: '#94a3b8', fontSize: 11 }} />
              <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: '#64748b', fontSize: 9 }} />
              <Radar name="Score" dataKey="score" stroke="#6366f1" fill="#6366f1" fillOpacity={0.3} strokeWidth={2} />
              <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8, color: '#e2e8f0' }} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h2 className="chart-title">Distribuição de Probabilidade</h2>
          <p className="chart-subtitle">Probabilidade por tipo de ameaça</p>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={threatDistribution}
                cx="50%" cy="50%"
                innerRadius={55} outerRadius={95}
                paddingAngle={3}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}%`}
                labelLine={false}
              >
                {threatDistribution.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8, color: '#e2e8f0' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Threats Table */}
      <div className="chart-card">
        <h2 className="chart-title">Análise de Ameaças</h2>
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Tipo de Ameaça</th>
                <th>Probabilidade</th>
                <th>Impacto</th>
                <th>Nível de Risco</th>
              </tr>
            </thead>
            <tbody>
              {riskAnalysis.threats.map((threat, index) => {
                const risk = (threat.probability * threat.impact) / 100;
                let riskLvl = 'Baixo';
                if (risk > 70) riskLvl = 'Crítico';
                else if (risk > 50) riskLvl = 'Alto';
                else if (risk > 30) riskLvl = 'Médio';
                return (
                  <tr key={index}>
                    <td className="table-threat-name">{threat.type}</td>
                    <td>
                      <div className="progress-cell">
                        <div className="progress-bar">
                          <div className="progress-fill progress-fill--orange" style={{ width: `${threat.probability}%` }} />
                        </div>
                        <span>{threat.probability}%</span>
                      </div>
                    </td>
                    <td>
                      <div className="progress-cell">
                        <div className="progress-bar">
                          <div className="progress-fill progress-fill--red" style={{ width: `${threat.impact}%` }} />
                        </div>
                        <span>{threat.impact}%</span>
                      </div>
                    </td>
                    <td>
                      <span className={`risk-badge ${getRiskColor(riskLvl as any)}`}>{riskLvl}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Vulnerabilities + Recommendations */}
      <div className="charts-grid-2">
        <div className="chart-card">
          <h2 className="chart-title">Vulnerabilidades Identificadas</h2>
          <div className="list-stack">
            {riskAnalysis.vulnerabilities.map((vuln, index) => (
              <div key={index} className="list-item">
                <div className="list-item-header">
                  <span className="list-item-title">{vuln.area}</span>
                  <span className={`risk-badge ${getSeverityColor(vuln.severity)}`}>{vuln.severity}</span>
                </div>
                <p className="list-item-desc">{vuln.description}</p>
              </div>
            ))}
            {riskAnalysis.vulnerabilities.length === 0 && (
              <div className="empty-list">
                <Shield className="w-10 h-10 text-green-400" />
                <p>Nenhuma vulnerabilidade crítica identificada</p>
              </div>
            )}
          </div>
        </div>

        <div className="chart-card">
          <h2 className="chart-title">Recomendações Prioritárias</h2>
          <div className="list-stack">
            {riskAnalysis.recommendations.map((rec, index) => (
              <div key={index} className="list-item">
                <div className="list-item-header">
                  <span className={`risk-badge ${getSeverityColor(rec.priority)}`}>{rec.priority}</span>
                </div>
                <p className="list-item-desc">{rec.action}</p>
              </div>
            ))}
            {riskAnalysis.recommendations.length === 0 && (
              <div className="empty-list">
                <Shield className="w-10 h-10 text-green-400" />
                <p>Todos os controles essenciais implementados!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
