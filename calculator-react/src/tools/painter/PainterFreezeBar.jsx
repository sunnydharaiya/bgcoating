// src/tools/painter/PainterFreezeBar.jsx
import React from 'react';
import { WORKFLOW, WF_LABELS } from '../../data/painterDatabase';

export default function PainterFreezeBar({
  currentSubTool,
  onNavigate,
  evaluation,
  formData
}) {
  const { stageProgress = {}, overallProgress = 0 } = evaluation || {};

  // Circumference for r=28 is 175.929
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - Math.min(100, Math.max(0, overallProgress)) / 100);

  // Normalize current stage name for display
  const stageLabels = {
    info: 'PROJECT & PAINTER',
    'project-info': 'PROJECT & PAINTER',
    'project_info': 'PROJECT & PAINTER',
    train: 'TRAINING & TEST',
    'training-test': 'TRAINING & TEST',
    'training_test': 'TRAINING & TEST',
    checklist: 'ASSESSMENT CHECKLIST',
    s1: 'BLASTING & PRIMING',
    'coat-stage-s1': 'BLASTING & PRIMING',
    'coat_stage_s1': 'BLASTING & PRIMING',
    s2: '1ST COAT',
    'coat-stage-s2': '1ST COAT',
    'coat_stage_s2': '1ST COAT',
    s3: '2ND COAT',
    'coat-stage-s3': '2ND COAT',
    'coat_stage_s3': '2ND COAT',
    s4: '3RD COAT',
    'coat-stage-s4': '3RD COAT',
    'coat_stage_s4': '3RD COAT',
    photo: 'PHOTOGRAPHIC REPORT',
    'photo-report': 'PHOTOGRAPHIC REPORT',
    'photo_report': 'PHOTOGRAPHIC REPORT',
    verdict: 'VERDICT & APPROVAL',
    'verdict-approval': 'VERDICT & APPROVAL',
    'verdict_approval': 'VERDICT & APPROVAL'
  };

  const activeStageDisplay = stageLabels[currentSubTool] || (currentSubTool ? currentSubTool.toUpperCase() : 'HOME');

  const chipDefs = [
    { id: 'info', label: 'Project & Painter' },
    { id: 'train', label: 'Training & Test' },
    { id: 'checklist', label: 'Assessment Checklist' },
    { id: 's1', label: 'Blasting & Priming' },
    { id: 's2', label: '1st Coat' },
    { id: 's3', label: '2nd Coat' },
    { id: 's4', label: '3rd Coat' },
    { id: 'photo', label: 'Photographic Report' },
    { id: 'verdict', label: 'Verdict & Approval' }
  ];

  return (
    <div className="frozen-top">
      <div className="prog-panel">
        <div className="prog-panel-l">
          <div className="prog-panel-title">
            <span className="ic">⚡</span>QUALIFICATION WORKFLOW PROGRESS
            <span className="stage" id="prog-stage">{activeStageDisplay}</span>
          </div>

          <div className="prog-bar-wrap">
            <div
              className="prog-bar-fill"
              id="prog-bar"
              style={{ width: `${overallProgress}%` }}
            />
          </div>

          <div className="prog-chips" id="prog-chips">
            {chipDefs.map((chip) => {
              const pct = stageProgress[chip.id] || 0;
              const isAct = currentSubTool === chip.id ||
                (chip.id === 'info' && (currentSubTool === 'project-info' || currentSubTool === 'project_info')) ||
                (chip.id === 'train' && (currentSubTool === 'training-test' || currentSubTool === 'training_test')) ||
                (chip.id === 'photo' && (currentSubTool === 'photo-report' || currentSubTool === 'photo_report')) ||
                (chip.id === 'verdict' && (currentSubTool === 'verdict-approval' || currentSubTool === 'verdict_approval'));
              const isComp = pct >= 100;

              return (
                <span
                  key={chip.id}
                  className={`prog-chip ${isAct ? 'act' : ''} ${isComp ? 'comp' : ''}`}
                  id={`pc-${chip.id}`}
                  onClick={() => onNavigate && onNavigate('painter', chip.id)}
                  style={{ cursor: 'pointer' }}
                >
                  {chip.label}
                  <span className="num" id={`pcn-${chip.id}`}>{pct}%</span>
                </span>
              );
            })}
          </div>
        </div>

        <div className="prog-donut">
          <svg width="70" height="70" viewBox="0 0 70 70">
            <defs>
              <linearGradient id="donut-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#F39322" />
                <stop offset="100%" stopColor="#9E1B1E" />
              </linearGradient>
            </defs>
            <circle className="bg" cx="35" cy="35" r={radius} />
            <circle
              className="fill"
              id="donut-fill"
              cx="35"
              cy="35"
              r={radius}
              style={{
                strokeDashoffset: strokeDashoffset,
                strokeDasharray: circumference
              }}
            />
          </svg>
          <div className="val" id="donut-pct">{overallProgress}%</div>
        </div>
      </div>
    </div>
  );
}
