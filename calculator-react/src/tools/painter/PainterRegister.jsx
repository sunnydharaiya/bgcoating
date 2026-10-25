// src/tools/painter/PainterRegister.jsx
import React, { useState } from 'react';
import { validateStageSequence } from '../../data/painterDatabase';

export default function PainterRegister({
  reports = [],
  onLoadReport,
  onDuplicateReport,
  onDeleteReport,
  onPrintReport,
  onExportCSV,
  onNewGeneration,
  onClearAll
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [colFilters, setColFilters] = useState({});
  const [sortKey, setSortKey] = useState('savedAt');
  const [sortDir, setSortDir] = useState('desc');

  // Multi-column filter handler
  const handleColFilterChange = (col, val) => {
    setColFilters(prev => ({
      ...prev,
      [col]: val.toLowerCase()
    }));
  };

  // Filter logic
  let filtered = reports.filter((r) => {
    // Top status chips filter
    if (statusFilter === 'Draft' && r.status !== 'Draft') return false;
    if (statusFilter === 'Approved' && r.status !== 'Approved') return false;
    if (statusFilter === 'PASS' && r.verdict !== 'PASS') return false;
    if (statusFilter === 'FAIL' && r.verdict !== 'FAIL') return false;

    // Search bar filter
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      const match = (
        (r.repNo || '').toLowerCase().includes(term) ||
        (r.name || '').toLowerCase().includes(term) ||
        (r.civil || '').toLowerCase().includes(term) ||
        (r.proj || '').toLowerCase().includes(term) ||
        (r.projNo || '').toLowerCase().includes(term) ||
        (r.client || '').toLowerCase().includes(term) ||
        (r.contractor || '').toLowerCase().includes(term) ||
        (r.preparedBy || '').toLowerCase().includes(term)
      );
      if (!match) return false;
    }

    // Column-specific filters
    for (const [col, val] of Object.entries(colFilters)) {
      if (!val) continue;
      const target = (r[col] || '').toString().toLowerCase();
      if (!target.includes(val)) return false;
    }

    return true;
  });

  // Sort logic
  filtered.sort((a, b) => {
    const valA = a[sortKey] || '';
    const valB = b[sortKey] || '';
    if (valA < valB) return sortDir === 'asc' ? -1 : 1;
    if (valA > valB) return sortDir === 'asc' ? 1 : -1;
    return 0;
  });

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  // KPIs
  const total = reports.length;
  const draftCount = reports.filter(r => r.status === 'Draft').length;
  const approvedCount = reports.filter(r => r.status === 'Approved').length;
  const passCount = reports.filter(r => r.verdict === 'PASS').length;
  const failCount = reports.filter(r => r.verdict === 'FAIL').length;

  // Chronological Sequence Check
  const seqChecks = reports.map(r => validateStageSequence(r, reports));
  const seqOkCount = seqChecks.filter(s => s?.valid).length;
  const seqBadCount = seqChecks.filter(s => s && !s.valid).length;

  return (
    <div className="sheet" id="sh-reports">
      {/* Corporate Header */}
      <div className="xl-corp">
        <div className="xl-corp-inner">
          <div className="xl-corp-l">BG Group of Paint &amp; Coating Consultant</div>
          <div className="xl-corp-t">REPORTS REGISTER — MASTER LISTING</div>
          <div className="xl-corp-s">
            All saved Spray Painter Qualification Reports · search, filter, print, edit, duplicate
          </div>
        </div>
      </div>

      {/* KPI bar */}
      <div className="rep-kpi-bar" style={{ gridTemplateColumns: 'repeat(7, 1fr)' }}>
        <div className="rep-kpi">
          <div className="rep-kpi-l"><span className="ic">📊</span>Total</div>
          <div className="rep-kpi-v" id="rk-total">{total}</div>
        </div>
        <div className="rep-kpi drafts">
          <div className="rep-kpi-l"><span className="ic">📝</span>Drafts</div>
          <div className="rep-kpi-v" id="rk-drafts">{draftCount}</div>
        </div>
        <div className="rep-kpi approved">
          <div className="rep-kpi-l"><span className="ic">✓</span>Approved</div>
          <div className="rep-kpi-v" id="rk-approved">{approvedCount}</div>
        </div>
        <div className="rep-kpi ok">
          <div className="rep-kpi-l"><span className="ic">⊕</span>Pass</div>
          <div className="rep-kpi-v" id="rk-pass">{passCount}</div>
        </div>
        <div className="rep-kpi err">
          <div className="rep-kpi-l"><span className="ic">⊖</span>Fail</div>
          <div className="rep-kpi-v" id="rk-fail">{failCount}</div>
        </div>
        <div className="rep-kpi ok">
          <div className="rep-kpi-l"><span className="ic">🔗</span>Sequence OK</div>
          <div className="rep-kpi-v" id="rk-seq-ok" style={{ color: '#2E7D32' }}>{seqOkCount}</div>
        </div>
        <div className="rep-kpi err">
          <div className="rep-kpi-l"><span className="ic">⚠</span>Sequence ERR</div>
          <div className="rep-kpi-v" id="rk-seq-bad" style={{ color: '#C62828' }}>{seqBadCount}</div>
        </div>
      </div>

      {/* Action bar */}
      <div className="rep-action-bar">
        <div className="rep-action-bar-l">
          <div className="rep-action-bar-l-t">📁 Report Management Dashboard</div>
          <div className="rep-action-bar-l-s">
            Search, filter, sort, review, retrieve and export your saved Spray Painter Qualification Reports. Start a new report with NEW GENERATION.
          </div>
        </div>
        <div className="rep-action-btn-grp">
          <button
            type="button"
            className="btn-new-generation"
            onClick={onNewGeneration}
            title="Start a brand new Qualification Report"
          >
            🚀 NEW GENERATION
          </button>
          <button
            type="button"
            className="btn btn-export-xls"
            onClick={onExportCSV}
            title="Download the Report Register as CSV/Excel"
          >
            ⬇ EXPORT REGISTER (CSV)
          </button>
        </div>
      </div>

      {/* Filter bar */}
      <div className="rep-filter-bar">
        <div className="rep-search">
          <span className="rep-search-ic">🔍</span>
          <input
            type="text"
            id="rep-search-input"
            placeholder="Search by Report No, Operator, Project, Customer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button
          type="button"
          className={`rep-filter-chip ${statusFilter === 'all' ? 'act' : ''}`}
          onClick={() => setStatusFilter('all')}
        >
          All <span className="count">{total}</span>
        </button>
        <button
          type="button"
          className={`rep-filter-chip ${statusFilter === 'Draft' ? 'act' : ''}`}
          onClick={() => setStatusFilter('Draft')}
        >
          Drafts <span className="count">{draftCount}</span>
        </button>
        <button
          type="button"
          className={`rep-filter-chip ${statusFilter === 'Approved' ? 'act' : ''}`}
          onClick={() => setStatusFilter('Approved')}
        >
          Approved <span className="count">{approvedCount}</span>
        </button>
        <button
          type="button"
          className={`rep-filter-chip ${statusFilter === 'PASS' ? 'act' : ''}`}
          onClick={() => setStatusFilter('PASS')}
        >
          Pass <span className="count">{passCount}</span>
        </button>
        <button
          type="button"
          className={`rep-filter-chip ${statusFilter === 'FAIL' ? 'act' : ''}`}
          onClick={() => setStatusFilter('FAIL')}
        >
          Fail <span className="count">{failCount}</span>
        </button>
      </div>

      {/* Table */}
      <div className="rep-tbl-w">
        <table className="rep-tbl">
          <thead>
            <tr className="rep-sort-row">
              <th className="center">Sr.</th>
              <th className="rep-sortable" onClick={() => handleSort('repNo')}>
                Report No. <span className="sort-ar">{sortKey === 'repNo' ? (sortDir === 'asc' ? '▲' : '▼') : ''}</span>
              </th>
              <th className="rep-sortable" onClick={() => handleSort('name')}>
                Operator <span className="sort-ar">{sortKey === 'name' ? (sortDir === 'asc' ? '▲' : '▼') : ''}</span>
              </th>
              <th className="rep-sortable" onClick={() => handleSort('proj')}>
                Project <span className="sort-ar">{sortKey === 'proj' ? (sortDir === 'asc' ? '▲' : '▼') : ''}</span>
              </th>
              <th className="rep-sortable" onClick={() => handleSort('client')}>
                Customer <span className="sort-ar">{sortKey === 'client' ? (sortDir === 'asc' ? '▲' : '▼') : ''}</span>
              </th>
              <th className="center">Stage Sequence</th>
              <th className="center rep-sortable" onClick={() => handleSort('verdict')}>
                Verdict <span className="sort-ar">{sortKey === 'verdict' ? (sortDir === 'asc' ? '▲' : '▼') : ''}</span>
              </th>
              <th className="center rep-sortable" onClick={() => handleSort('status')}>
                Status <span className="sort-ar">{sortKey === 'status' ? (sortDir === 'asc' ? '▲' : '▼') : ''}</span>
              </th>
              <th className="rep-sortable" onClick={() => handleSort('preparedBy')}>
                Prepared By <span className="sort-ar">{sortKey === 'preparedBy' ? (sortDir === 'asc' ? '▲' : '▼') : ''}</span>
              </th>
              <th className="rep-sortable" onClick={() => handleSort('savedAt')}>
                Saved On <span className="sort-ar">{sortKey === 'savedAt' ? (sortDir === 'asc' ? '▲' : '▼') : ''}</span>
              </th>
              <th className="center" style={{ width: '46px' }}>View</th>
              <th className="center" style={{ width: '46px' }}>Print</th>
              <th className="center" style={{ width: '46px' }}>Edit</th>
              <th className="center" style={{ width: '46px' }}>Copy</th>
              <th className="center" style={{ width: '46px' }}>Delete</th>
            </tr>
            <tr className="rep-filter-row">
              <th />
              <th>
                <input
                  type="text"
                  className="rep-col-filter"
                  placeholder="🔍 filter"
                  value={colFilters.repNo || ''}
                  onChange={(e) => handleColFilterChange('repNo', e.target.value)}
                />
              </th>
              <th>
                <input
                  type="text"
                  className="rep-col-filter"
                  placeholder="🔍 filter"
                  value={colFilters.name || ''}
                  onChange={(e) => handleColFilterChange('name', e.target.value)}
                />
              </th>
              <th>
                <input
                  type="text"
                  className="rep-col-filter"
                  placeholder="🔍 filter"
                  value={colFilters.proj || ''}
                  onChange={(e) => handleColFilterChange('proj', e.target.value)}
                />
              </th>
              <th>
                <input
                  type="text"
                  className="rep-col-filter"
                  placeholder="🔍 filter"
                  value={colFilters.client || ''}
                  onChange={(e) => handleColFilterChange('client', e.target.value)}
                />
              </th>
              <th />
              <th>
                <input
                  type="text"
                  className="rep-col-filter"
                  placeholder="🔍"
                  value={colFilters.verdict || ''}
                  onChange={(e) => handleColFilterChange('verdict', e.target.value)}
                />
              </th>
              <th>
                <input
                  type="text"
                  className="rep-col-filter"
                  placeholder="🔍"
                  value={colFilters.status || ''}
                  onChange={(e) => handleColFilterChange('status', e.target.value)}
                />
              </th>
              <th>
                <input
                  type="text"
                  className="rep-col-filter"
                  placeholder="🔍 filter"
                  value={colFilters.preparedBy || ''}
                  onChange={(e) => handleColFilterChange('preparedBy', e.target.value)}
                />
              </th>
              <th>
                <input
                  type="text"
                  className="rep-col-filter"
                  placeholder="🔍 date"
                  value={colFilters.savedAt || ''}
                  onChange={(e) => handleColFilterChange('savedAt', e.target.value)}
                />
              </th>
              <th colSpan="5" />
            </tr>
          </thead>
          <tbody id="rep-tbody">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="15" style={{ textAlign: 'center', padding: '30px', color: 'var(--txt3)' }}>
                  No qualification report records found matching filter criteria.
                </td>
              </tr>
            ) : (
              filtered.map((r, idx) => {
                const seq = validateStageSequence(r, reports);
                const savedDate = r.savedAt ? new Date(r.savedAt) : null;
                const formattedDate = savedDate && !isNaN(savedDate)
                  ? savedDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
                  : '—';
                const formattedTime = savedDate && !isNaN(savedDate)
                  ? savedDate.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
                  : '';

                return (
                  <tr key={r.id || idx}>
                    <td className="sr">{idx + 1}</td>
                    <td className="rep-no">{r.repNo || '—'}</td>
                    <td>
                      <b>{r.name || 'Operator'}</b><br />
                      <span style={{ fontSize: '10px', color: 'var(--txt3)' }}>Civ ID: {r.civil || '—'}</span>
                    </td>
                    <td>{r.proj || '—'}</td>
                    <td>{r.client || '—'}</td>
                    <td className="stage-cell" style={{ textAlign: 'center' }}>
                      <span style={{
                        fontFamily: "'JetBrains Mono',monospace",
                        fontWeight: 700,
                        color: seq?.valid ? '#2E7D32' : '#C62828',
                        whiteSpace: 'nowrap',
                        fontSize: '10.5px'
                      }}>
                        {seq?.valid ? '✓ ' : '✗ '}{seq?.label || 'B&P + 1st'}
                      </span>
                      <br />
                      <span style={{ fontSize: '8.5px', color: 'var(--txt3)' }}>
                        Proj: {r.projNo || '—'}
                      </span>
                    </td>
                    <td className="status-cell" style={{ textAlign: 'center' }}>
                      <span className={`st-tag ${r.verdict === 'PASS' ? 'approved' : r.verdict === 'FAIL' ? 'fail' : 'pending'}`}>
                        {r.verdict || 'PENDING'}
                      </span>
                      <br />
                      <span style={{ fontSize: '9.5px', color: 'var(--txt3)', marginTop: '2px', display: 'inline-block' }}>
                        {r.overall ? `${r.overall.toFixed(1)}%` : '—'}
                      </span>
                    </td>
                    <td className="status-cell" style={{ textAlign: 'center' }}>
                      <span className={`st-tag ${r.status === 'Approved' ? 'approved' : 'draft'}`}>
                        {r.status || 'Draft'}
                      </span>
                    </td>
                    <td>{r.preparedBy || '—'}</td>
                    <td>
                      {formattedDate}<br />
                      <span style={{ fontSize: '9.5px', color: 'var(--txt3)' }}>{formattedTime}</span>
                    </td>
                    <td className="center">
                      <button
                        type="button"
                        className="rep-act view"
                        title="View Print"
                        onClick={() => onPrintReport && onPrintReport(r)}
                      >
                        👁
                      </button>
                    </td>
                    <td className="center">
                      <button
                        type="button"
                        className="rep-act"
                        title="Print"
                        onClick={() => onPrintReport && onPrintReport(r)}
                      >
                        📄
                      </button>
                    </td>
                    <td className="center">
                      <button
                        type="button"
                        className="rep-act edit"
                        title="Edit"
                        onClick={() => onLoadReport && onLoadReport(r)}
                      >
                        ✎
                      </button>
                    </td>
                    <td className="center">
                      <button
                        type="button"
                        className="rep-act"
                        title="Duplicate"
                        onClick={() => onDuplicateReport && onDuplicateReport(r)}
                      >
                        📋
                      </button>
                    </td>
                    <td className="center">
                      <button
                        type="button"
                        className="rep-act del"
                        title="Delete"
                        onClick={() => onDeleteReport && onDeleteReport(r.id)}
                      >
                        🗑
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Stage validation legend */}
      <div className="remark-box" style={{ marginTop: '12px', borderLeftColor: '#1565C0', background: 'linear-gradient(180deg,#F4F8FC,#fff)' }}>
        <div className="remark-l" style={{ color: '#1565C0' }}>
          🔗 Stage Validation Logic — Per Industry Standard Coating Sequence
        </div>
        <div style={{ fontSize: '11.5px', color: 'var(--txt)', lineHeight: 1.6 }}>
          The system validates that all coating reports follow the correct chronology: <b style={{ color: '#1565C0' }}>B&amp;P → 1st Coat → 2nd Coat → 3rd Coat</b>. Each coat depends on the approval of the previous stage.<br />
          <span style={{ color: '#2E7D32', fontFamily: "'JetBrains Mono',monospace", fontWeight: 700 }}>✓ GREEN font</span> — correct sequence (e.g. <span style={{ color: '#2E7D32', fontFamily: "'JetBrains Mono',monospace", fontWeight: 700 }}>B&amp;P</span>, <span style={{ color: '#2E7D32', fontFamily: "'JetBrains Mono',monospace", fontWeight: 700 }}>B&amp;P + 1st</span>, <span style={{ color: '#2E7D32', fontFamily: "'JetBrains Mono',monospace", fontWeight: 700 }}>B&amp;P + 1st + 2nd</span>, <span style={{ color: '#2E7D32', fontFamily: "'JetBrains Mono',monospace", fontWeight: 700 }}>B&amp;P + 1st + 2nd + 3rd</span>).<br />
          <span style={{ color: '#C62828', fontFamily: "'JetBrains Mono',monospace", fontWeight: 700 }}>✗ RED font</span> — incorrect sequence (e.g. <span style={{ color: '#C62828', fontFamily: "'JetBrains Mono',monospace", fontWeight: 700 }}>Only 1st</span>, <span style={{ color: '#C62828', fontFamily: "'JetBrains Mono',monospace", fontWeight: 700 }}>Only 2nd</span>, <span style={{ color: '#C62828', fontFamily: "'JetBrains Mono',monospace", fontWeight: 700 }}>2nd + 3rd (no B&amp;P + no 1st)</span>, <span style={{ color: '#C62828', fontFamily: "'JetBrains Mono',monospace", fontWeight: 700 }}>3rd (no B&amp;P + no 1st + no 2nd)</span>). Higher-stage coats cannot exist without their predecessors approved.<br />
          <span style={{ color: 'var(--txt3)', fontStyle: 'italic' }}>
            Sequence Stage is computed per Project No. — multiple reports on the same project are aggregated to show the cumulative chronology.
          </span>
        </div>
      </div>

      <div className="remark-box" style={{ marginTop: '12px', borderLeftColor: '#1565C0' }}>
        <div className="remark-l" style={{ color: '#1565C0' }}>📌 How the Register Works</div>
        <div style={{ fontSize: '11.5px', color: 'var(--txt2)', lineHeight: 1.55 }}>
          Saved reports appear above. Click <b>✎</b> to load a record back into the form for editing, <b>👁</b> to open the read-only Preview, <b>📄</b> to print directly, <b>📋</b> to duplicate, or <b>🗑</b> to delete. Records are kept in the current browser session.
        </div>
      </div>

      <div className="btn-row">
        <button type="button" className="btn btn-add" onClick={onExportCSV}>
          📤 Export Register (CSV)
        </button>
        <button type="button" className="btn btn-reset" onClick={onClearAll}>
          🗑 Clear All Records
        </button>
      </div>
    </div>
  );
}
