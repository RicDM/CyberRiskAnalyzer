import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import { AssessmentForm } from './components/AssessmentForm';
import { Dashboard } from './components/Dashboard';
import { CorrelationMatrix } from './components/CorrelationMatrix';
import { Navigation } from './components/Navigation';
import { mockAssessments } from './data/mockData';

export interface AssessmentData {
  id: string;
  timestamp: Date;
  companyName: string;
  industry: string;
  employeeCount: string;
  hasFirewall: boolean;
  hasAntivirus: boolean;
  hasBackup: boolean;
  hasTraining: boolean;
  hasIncidentResponse: boolean;
  hasAccessControl: boolean;
  hasEncryption: boolean;
  hasMonitoring: boolean;
  updateFrequency: string;
  dataClassification: string;
  cloudUsage: string;
}

function App() {
  const [assessments, setAssessments] = useState<AssessmentData[]>(mockAssessments);
  const [selectedId, setSelectedId] = useState<string>(mockAssessments[mockAssessments.length - 1].id);

  const handleAssessmentSubmit = (data: Omit<AssessmentData, 'id' | 'timestamp'>) => {
    const newAssessment: AssessmentData = {
      ...data,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
    };
    const updated = [...assessments, newAssessment];
    setAssessments(updated);
    setSelectedId(newAssessment.id);
  };

  return (
    <Router>
      <div className="app-root">
        <Navigation />
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route
            path="/dashboard"
            element={
              <Dashboard
                assessments={assessments}
                selectedId={selectedId}
                onSelectId={setSelectedId}
              />
            }
          />
          <Route
            path="/assessment"
            element={<AssessmentForm onSubmit={handleAssessmentSubmit} />}
          />
          <Route
            path="/correlation"
            element={
              <CorrelationMatrix
                assessments={assessments}
                selectedId={selectedId}
              />
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
