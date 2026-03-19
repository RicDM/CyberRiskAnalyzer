import { useMemo } from 'react';
import { Info } from 'lucide-react';
import type { AssessmentData } from '../App';

interface CorrelationMatrixProps {
  assessments: AssessmentData[];
  selectedId: string;
}

interface SecurityControl {
  name: string;
  key: keyof AssessmentData;
}

const controls: SecurityControl[] = [
  { name: 'Firewall', key: 'hasFirewall' },
  { name: 'Antivírus', key: 'hasAntivirus' },
  { name: 'Backup', key: 'hasBackup' },
  { name: 'Treinamento', key: 'hasTraining' },
  { name: 'Resp. Incidentes', key: 'hasIncidentResponse' },
  { name: 'Controle Acesso', key: 'hasAccessControl' },
  { name: 'Criptografia', key: 'hasEncryption' },
  { name: 'Monitoramento', key: 'hasMonitoring' },
];

const threats = ['Phishing', 'Ransomware', 'DDoS', 'Malware', 'Insider Threat', 'Data Breach', 'SQL Injection', 'Zero-Day'];

const correlationMatrix: Record<string, Record<string, number>> = {
  hasFirewall:        { Phishing: 20, Ransomware: 30, DDoS: 85, Malware: 40, 'Insider Threat': 15, 'Data Breach': 35, 'SQL Injection': 60, 'Zero-Day': 25 },
  hasAntivirus:       { Phishing: 40, Ransomware: 70, DDoS: 10, Malware: 90, 'Insider Threat': 20, 'Data Breach': 30, 'SQL Injection': 25, 'Zero-Day': 35 },
  hasBackup:          { Phishing: 15, Ransomware: 85, DDoS: 50, Malware: 30, 'Insider Threat': 40, 'Data Breach': 60, 'SQL Injection': 20, 'Zero-Day': 45 },
  hasTraining:        { Phishing: 90, Ransomware: 60, DDoS: 10, Malware: 50, 'Insider Threat': 70, 'Data Breach': 55, 'SQL Injection': 30, 'Zero-Day': 25 },
  hasIncidentResponse:{ Phishing: 50, Ransomware: 65, DDoS: 70, Malware: 60, 'Insider Threat': 75, 'Data Breach': 80, 'SQL Injection': 55, 'Zero-Day': 85 },
  hasAccessControl:   { Phishing: 35, Ransomware: 45, DDoS: 20, Malware: 40, 'Insider Threat': 85, 'Data Breach': 75, 'SQL Injection': 70, 'Zero-Day': 50 },
  hasEncryption:      { Phishing: 25, Ransomware: 40, DDoS: 15, Malware: 35, 'Insider Threat': 60, 'Data Breach': 95, 'SQL Injection': 45, 'Zero-Day': 40 },
  hasMonitoring:      { Phishing: 55, Ransomware: 70, DDoS: 80, Malware: 75, 'Insider Threat': 80, 'Data Breach': 85, 'SQL Injection': 75, 'Zero-Day': 90 },
};

const getCellStyle = (value: number): string => {
  if (value >= 80) return 'cell-very-high';
  if (value >= 60) return 'cell-high';
  if (value >= 40) return 'cell-medium';
  if (value >= 20) return 'cell-low';
  return 'cell-very-low';
};

const getCellLabel = (value: number): string => {
  if (value >= 80) return 'Muito Alta';
  if (value >= 60) return 'Alta';
  if (value >= 40) return 'Moderada';
  if (value >= 20) return 'Baixa';
  return 'Muito Baixa';
};

export function CorrelationMatrix({ assessments, selectedId }: CorrelationMatrixProps) {
  const selected = assessments.find(a => a.id === selectedId);

  const missingControls = useMemo(() => {
    if (!selected) return new Set<string>();
    return new Set(
      controls.filter(c => selected[c.key] === false).map(c => c.key)
    );
  }, [selected]);

  return (
    <div className="page-container">
      <div className="dash-header">
        <div>
          <h1 className="page-title">Matriz de Correlação</h1>
          <p className="page-subtitle">
            Eficácia de cada controle contra tipos de ameaça
            {selected && <> · <strong>{selected.companyName}</strong></>}
          </p>
        </div>
      </div>

      <div className="info-box">
        <Info className="w-4 h-4 flex-shrink-0 mt-0.5 text-blue-400" />
        <p>
          Cada célula indica a eficácia (0–100%) de um controle contra uma ameaça.
          {selected && missingControls.size > 0 && (
            <> Linhas <span className="info-missing">destacadas em vermelho</span> indicam controles <strong>ausentes</strong> na avaliação de <strong>{selected.companyName}</strong>.</>
          )}
        </p>
      </div>

      <div className="matrix-card">
        <div className="matrix-scroll">
          <table className="matrix-table">
            <thead>
              <tr>
                <th className="matrix-header-fixed">Controle / Ameaça</th>
                {threats.map(threat => (
                  <th key={threat} className="matrix-th">{threat}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {controls.map((control, rowIndex) => {
                const isMissing = missingControls.has(control.key as string);
                return (
                  <tr key={control.key} className={`matrix-row ${isMissing ? 'matrix-row--missing' : rowIndex % 2 === 0 ? 'matrix-row--even' : 'matrix-row--odd'}`}>
                    <td className={`matrix-label-fixed ${isMissing ? 'matrix-label--missing' : ''}`}>
                      {control.name}
                      {isMissing && <span className="missing-tag">Ausente</span>}
                    </td>
                    {threats.map(threat => {
                      const value = correlationMatrix[control.key as string][threat];
                      return (
                        <td key={threat} className="matrix-cell">
                          <div className="cell-inner">
                            <div className={`cell-badge ${getCellStyle(value)}`}>{value}%</div>
                            <span className="cell-label">{getCellLabel(value)}</span>
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Legend */}
      <div className="chart-card">
        <h2 className="chart-title">Legenda de Eficácia</h2>
        <div className="legend-grid">
          {[
            { cls: 'cell-very-high', label: 'Muito Alta', range: '80–100%' },
            { cls: 'cell-high', label: 'Alta', range: '60–79%' },
            { cls: 'cell-medium', label: 'Moderada', range: '40–59%' },
            { cls: 'cell-low', label: 'Baixa', range: '20–39%' },
            { cls: 'cell-very-low', label: 'Muito Baixa', range: '0–19%' },
          ].map(({ cls, label, range }) => (
            <div key={label} className="legend-item">
              <div className={`legend-swatch cell-badge ${cls}`}>{range}</div>
              <span className="legend-label">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Insights */}
      <div className="chart-card">
        <h2 className="chart-title">Insights Principais</h2>
        <div className="insights-grid">
          <div className="insight-card">
            <h3>Proteção Contra Data Breach</h3>
            <p><strong>Criptografia (95%)</strong> e <strong>Monitoramento (85%)</strong> são os controles mais eficazes contra vazamento de dados.</p>
          </div>
          <div className="insight-card">
            <h3>Defesa Contra Phishing</h3>
            <p><strong>Treinamento (90%)</strong> é fundamental, pois o fator humano é a primeira linha de defesa contra engenharia social.</p>
          </div>
          <div className="insight-card">
            <h3>Mitigação de Ransomware</h3>
            <p><strong>Backup (85%)</strong> é crítico para recuperação, enquanto <strong>Antivírus (70%)</strong> previne a infecção inicial.</p>
          </div>
          <div className="insight-card">
            <h3>Ameaças Zero-Day</h3>
            <p><strong>Monitoramento (90%)</strong> e <strong>Resposta a Incidentes (85%)</strong> são essenciais para detectar e conter ataques desconhecidos.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
