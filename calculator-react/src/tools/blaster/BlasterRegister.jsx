import React, { useState } from 'react';

export default function BlasterRegister({
  reports = [],
  onLoadReport,
  onDuplicateReport,
  onDeleteReport,
  onNewReport,
  onOpenPreview,
  onOpenPrint,
  onSaveActiveReport,
  onLoadSampleRecord
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortField, setSortField] = useState('savedAt');
  const [sortAsc, setSortAsc] = useState(false);

  // Column-specific filter inputs
  const [colFilters, setColFilters] = useState({
    repNo: '',
    name: '',
    proj: '',
    client: '',
    category: '',
    verdict: '',
    status: '',
    preparedBy: '',
    savedAt: ''
  });

  const handleColFilterChange = (field, val) => {
    setColFilters(prev => ({ ...prev, [field]: val }));
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  // KPIs
  const totalCount = reports.length;
  const draftCount = reports.filter(r => r.status === 'Draft').length;
  const approvedCount = reports.filter(r => r.status === 'Approved').length;
  const passCount = reports.filter(r => r.verdict === 'PASS').length;
  const failCount = reports.filter(r => r.verdict === 'FAIL').length;

  const filteredReports = reports.filter((r) => {
    const term = searchTerm.toLowerCase();
    const globalMatch =
      !term ||
      (r.repNo || '').toLowerCase().includes(term) ||
      (r.operatorName || '').toLowerCase().includes(term) ||
      (r.projectName || '').toLowerCase().includes(term) ||
      (r.client || '').toLowerCase().includes(term) ||
      (r.category || '').toLowerCase().includes(term);

    if (!globalMatch) return false;

    if (statusFilter === 'Draft' && r.status !== 'Draft') return false;
    if (statusFilter === 'Approved' && r.status !== 'Approved') return false;
    if (statusFilter === 'PASS' && r.verdict !== 'PASS') return false;
    if (statusFilter === 'FAIL' && r.verdict !== 'FAIL') return false;

    // Col filters
    if (colFilters.repNo && !(r.repNo || '').toLowerCase().includes(colFilters.repNo.toLowerCase())) return false;
    if (colFilters.name && !(r.operatorName || '').toLowerCase().includes(colFilters.name.toLowerCase())) return false;
    if (colFilters.proj && !(r.projectName || '').toLowerCase().includes(colFilters.proj.toLowerCase())) return false;
    if (colFilters.client && !(r.client || '').toLowerCase().includes(colFilters.client.toLowerCase())) return false;
    if (colFilters.category && !(r.category || '').toLowerCase().includes(colFilters.category.toLowerCase())) return false;
    if (colFilters.verdict && !(r.verdict || '').toLowerCase().includes(colFilters.verdict.toLowerCase())) return false;
    if (colFilters.status && !(r.status || '').toLowerCase().includes(colFilters.status.toLowerCase())) return false;
    if (colFilters.preparedBy && !(r.preparedBy || '').toLowerCase().includes(colFilters.preparedBy.toLowerCase())) return false;

    return true;
  });

  const sortedReports = [...filteredReports].sort((a, b) => {
    let valA = a[sortField] || '';
    let valB = b[sortField] || '';
    if (sortField === 'name') {
      valA = a.operatorName || '';
      valB = b.operatorName || '';
    } else if (sortField === 'proj') {
      valA = a.projectName || '';
      valB = b.projectName || '';
    }
    if (valA < valB) return sortAsc ? -1 : 1;
    if (valA > valB) return sortAsc ? 1 : -1;
    return 0;
  });

  const exportCSV = () => {
    const headers = [
      'Report No',
      'Date',
      'Operator Name',
      'Category',
      'Civil ID',
      'Project',
      'Client',
      'Pre-Test %',
      'Post-Test %',
      'Checklist %',
      'Inspection %',
      'Overall %',
      'Verdict',
      'Status'
    ];

    const rows = sortedReports.map((r) => [
      r.repNo || '',
      r.repDate || '',
      r.operatorName || '',
      r.category || '',
      r.civilId || '',
      r.projectName || '',
      r.client || '',
      r.prePct ? `${r.prePct.toFixed(0)}%` : '',
      r.postPct ? `${r.postPct.toFixed(0)}%` : '',
      r.chkPct ? `${r.chkPct.toFixed(0)}%` : '',
      r.inspPct ? `${r.inspPct.toFixed(0)}%` : '',
      r.overallScore ? `${r.overallScore.toFixed(1)}%` : '',
      r.verdict || '',
      r.status || 'Draft'
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.map((val) => `"${val}"`).join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Blaster_Qualification_Register_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleClearAll = () => {
    if (window.confirm('Delete all saved qualification reports from this browser? This cannot be undone.')) {
      sortedReports.forEach(r => onDeleteReport(r.id));
    }
  };

  const formatSavedDate = (isoStr) => {
    if (!isoStr) return { d: '—', t: '' };
    try {
      const dt = new Date(isoStr);
      const d = dt.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
      const t = dt.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
      return { d, t };
    } catch {
      return { d: isoStr, t: '' };
    }
  };

  return (
    <div className="sheet act" id="sh-reports">
      <div className="xl-corp">
        <div className="xl-corp-inner">
          <div className="xl-corp-l">BG Group of Paint &amp; Coating Consultant</div>
          <div className="xl-corp-t">REPORTS REGISTER — MASTER LISTING</div>
          <div className="xl-corp-s">All saved Operator Qualification Reports · search, filter, print, edit, duplicate</div>
        </div>
      </div>

      {/* KPI BAR */}
      <div className="rep-kpi-bar">
        <div className="rep-kpi">
          <div className="rep-kpi-l"><span className="ic">📊</span>Total</div>
          <div className="rep-kpi-v" id="rk-total">{totalCount}</div>
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
      </div>

      {/* ACTION BAR */}
      <div className="rep-action-bar">
        <div className="rep-action-bar-l">
          <div className="rep-action-bar-l-t">📁 Report Management Dashboard</div>
          <div className="rep-action-bar-l-s">Search, filter, sort, review, retrieve and export your saved Operator Qualification Reports. Start a new report with NEW GENERATION.</div>
        </div>
        <div className="rep-action-btn-grp">
          {onSaveActiveReport && (
            <button
              type="button"
              className="btn"
              style={{ background: '#E8700A', color: '#fff', fontWeight: 'bold' }}
              onClick={onSaveActiveReport}
              title="Save current active working draft as record in register"
            >
              💾 SAVE ACTIVE REPORT
            </button>
          )}
          {onLoadSampleRecord && (
            <button
              type="button"
              className="btn"
              style={{ background: '#B83216', color: '#fff', fontWeight: 'bold' }}
              onClick={onLoadSampleRecord}
              title="Load standard QatarEnergy / CTJV qualification dossier sample"
            >
              💡 SAMPLE DOSSIER
            </button>
          )}
          <button
            type="button"
            className="btn-new-generation"
            onClick={onNewReport}
            title="Start a brand new Qualification Report"
          >
            🚀 NEW GENERATION
          </button>
          <button
            type="button"
            className="btn btn-export-xls"
            onClick={exportCSV}
            title="Download the Report Register as CSV/Excel"
          >
            ⬇ EXPORT REGISTER (EXCEL)
          </button>
        </div>
      </div>

      {/* FILTER BAR */}
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
          All <span className="count">{totalCount}</span>
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

      {/* TABLE */}
      <div className="rep-tbl-w">
        <table className="rep-tbl">
          <colgroup>
            <col className="c-sr" />
            <col className="c-repno" />
            <col className="c-oper" />
            <col className="c-proj" />
            <col className="c-cust" />
            <col className="c-cat" />
            <col className="c-verd" />
            <col className="c-stat" />
            <col className="c-prep" />
            <col className="c-saved" />
            <col className="c-actcol" />
            <col className="c-actcol" />
            <col className="c-actcol" />
            <col className="c-actcol" />
            <col className="c-actcol" />
          </colgroup>
          <thead>
            <tr>
              <th className="center">Sr.</th>
              <th className="rep-sortable" onClick={() => handleSort('repNo')}>
                Report No. <span className="sort-ar">{sortField === 'repNo' ? (sortAsc ? '▲' : '▼') : ''}</span>
              </th>
              <th className="rep-sortable" onClick={() => handleSort('name')}>
                Operator <span className="sort-ar">{sortField === 'name' ? (sortAsc ? '▲' : '▼') : ''}</span>
              </th>
              <th className="rep-sortable" onClick={() => handleSort('proj')}>
                Project <span className="sort-ar">{sortField === 'proj' ? (sortAsc ? '▲' : '▼') : ''}</span>
              </th>
              <th className="rep-sortable" onClick={() => handleSort('client')}>
                Customer <span className="sort-ar">{sortField === 'client' ? (sortAsc ? '▲' : '▼') : ''}</span>
              </th>
              <th className="center rep-sortable" onClick={() => handleSort('category')}>
                Category <span className="sort-ar">{sortField === 'category' ? (sortAsc ? '▲' : '▼') : ''}</span>
              </th>
              <th className="center rep-sortable" onClick={() => handleSort('verdict')}>
                Verdict <span className="sort-ar">{sortField === 'verdict' ? (sortAsc ? '▲' : '▼') : ''}</span>
              </th>
              <th className="center rep-sortable" onClick={() => handleSort('status')}>
                Status <span className="sort-ar">{sortField === 'status' ? (sortAsc ? '▲' : '▼') : ''}</span>
              </th>
              <th className="rep-sortable" onClick={() => handleSort('preparedBy')}>
                Prepared By <span className="sort-ar">{sortField === 'preparedBy' ? (sortAsc ? '▲' : '▼') : ''}</span>
              </th>
              <th className={`rep-sortable ${sortField === 'savedAt' ? 'sorted' : ''}`} onClick={() => handleSort('savedAt')}>
                Saved On <span className="sort-ar">{sortField === 'savedAt' ? (sortAsc ? '▲' : '▼') : ''}</span>
              </th>
              <th className="center act-h">View</th>
              <th className="center act-h">Print</th>
              <th className="center act-h">Edit</th>
              <th className="center act-h">Copy</th>
              <th className="center act-h">Delete</th>
            </tr>
            <tr className="rep-col-filter-row">
              <th></th>
              <th>
                <input
                  type="text"
                  className="rep-col-filter"
                  placeholder="🔍"
                  value={colFilters.repNo}
                  onChange={(e) => handleColFilterChange('repNo', e.target.value)}
                />
              </th>
              <th>
                <input
                  type="text"
                  className="rep-col-filter"
                  placeholder="🔍"
                  value={colFilters.name}
                  onChange={(e) => handleColFilterChange('name', e.target.value)}
                />
              </th>
              <th>
                <input
                  type="text"
                  className="rep-col-filter"
                  placeholder="🔍"
                  value={colFilters.proj}
                  onChange={(e) => handleColFilterChange('proj', e.target.value)}
                />
              </th>
              <th>
                <input
                  type="text"
                  className="rep-col-filter"
                  placeholder="🔍"
                  value={colFilters.client}
                  onChange={(e) => handleColFilterChange('client', e.target.value)}
                />
              </th>
              <th>
                <input
                  type="text"
                  className="rep-col-filter"
                  placeholder="🔍"
                  value={colFilters.category}
                  onChange={(e) => handleColFilterChange('category', e.target.value)}
                />
              </th>
              <th>
                <input
                  type="text"
                  className="rep-col-filter"
                  placeholder="🔍"
                  value={colFilters.verdict}
                  onChange={(e) => handleColFilterChange('verdict', e.target.value)}
                />
              </th>
              <th>
                <input
                  type="text"
                  className="rep-col-filter"
                  placeholder="🔍"
                  value={colFilters.status}
                  onChange={(e) => handleColFilterChange('status', e.target.value)}
                />
              </th>
              <th>
                <input
                  type="text"
                  className="rep-col-filter"
                  placeholder="🔍"
                  value={colFilters.preparedBy}
                  onChange={(e) => handleColFilterChange('preparedBy', e.target.value)}
                />
              </th>
              <th>
                <input
                  type="text"
                  className="rep-col-filter"
                  placeholder="🔍"
                  value={colFilters.savedAt}
                  onChange={(e) => handleColFilterChange('savedAt', e.target.value)}
                />
              </th>
              <th></th><th></th><th></th><th></th><th></th>
            </tr>
          </thead>
          <tbody id="rep-tbody">
            {sortedReports.length === 0 ? (
              <tr>
                <td colSpan="15" style={{ textAlign: 'center', padding: '40px', color: 'var(--txt3)' }}>
                  <div style={{ maxWidth: '420px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center' }}>
                    <div style={{ fontWeight: 'bold', color: 'var(--txt2)', fontSize: '13px' }}>
                      No qualification reports found in database register.
                    </div>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
                      {onLoadSampleRecord && (
                        <button
                          type="button"
                          className="btn"
                          style={{ background: '#B83216', color: '#fff', fontSize: '11px', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer' }}
                          onClick={onLoadSampleRecord}
                        >
                          💡 Load Sample Qualification Dossier
                        </button>
                      )}
                      <button
                        type="button"
                        className="btn-new-generation"
                        style={{ fontSize: '11px', padding: '6px 12px', cursor: 'pointer' }}
                        onClick={onNewReport}
                      >
                        🚀 Start New Qualification Report
                      </button>
                    </div>
                  </div>
                </td>
              </tr>
            ) : (
              sortedReports.map((r, i) => {
                const { d, t } = formatSavedDate(r.savedAt);
                const isPass = r.verdict === 'PASS';
                const isApproved = r.status === 'Approved';
                return (
                  <tr key={r.id || i}>
                    <td className="sr">{i + 1}</td>
                    <td className="rep-no" title={r.repNo}>{r.repNo || '—'}</td>
                    <td title={r.operatorName}>
                      <b>{r.operatorName || '—'}</b>
                      <br />
                      <span style={{ fontSize: '9px', color: 'var(--txt3)' }}>Civ ID: {r.civilId || '—'}</span>
                    </td>
                    <td title={r.projectName}>{r.projectName || '—'}</td>
                    <td title={r.client}>{r.client || '—'}</td>
                    <td className="stage-cell" style={{ textAlign: 'center' }}>
                      <span className="stage-tag">{r.category || 'Blaster'}</span>
                    </td>
                    <td className="status-cell" style={{ textAlign: 'center' }}>
                      <span className={`st-tag ${isPass ? 'approved' : r.verdict === 'FAIL' ? 'draft' : ''}`}>
                        {r.verdict || 'PEND'}
                      </span>
                      {r.overallScore !== undefined && (
                        <>
                          <br />
                          <span style={{ fontSize: '9px', color: 'var(--txt3)', marginTop: '2px', display: 'inline-block' }}>
                            {r.overallScore.toFixed(1)}%
                          </span>
                        </>
                      )}
                    </td>
                    <td className="status-cell" style={{ textAlign: 'center' }}>
                      <span className={`st-tag ${isApproved ? 'approved' : 'draft'}`}>
                        {r.status || 'Draft'}
                      </span>
                    </td>
                    <td title={r.preparedBy}>{r.preparedBy || '—'}</td>
                    <td>
                      {d}
                      {t && (
                        <>
                          <br />
                          <span style={{ fontSize: '9.5px', color: 'var(--txt3)' }}>{t}</span>
                        </>
                      )}
                    </td>
                    <td className="center">
                      <button
                        type="button"
                        className="rep-act view"
                        title="View Report Preview"
                        onClick={() => {
                          if (onOpenPreview) onOpenPreview(r);
                          else onLoadReport(r);
                        }}
                      >
                        👁
                      </button>
                    </td>
                    <td className="center">
                      <button
                        type="button"
                        className="rep-act"
                        title="Print Report"
                        onClick={() => {
                          if (onOpenPrint) onOpenPrint(r);
                          else if (onOpenPreview) onOpenPreview(r);
                          else onLoadReport(r);
                        }}
                      >
                        📄
                      </button>
                    </td>
                    <td className="center">
                      <button
                        type="button"
                        className="rep-act edit"
                        title="Edit Report"
                        onClick={() => onLoadReport(r)}
                      >
                        ✎
                      </button>
                    </td>
                    <td className="center">
                      <button
                        type="button"
                        className="rep-act"
                        title="Copy Report"
                        onClick={() => onDuplicateReport(r)}
                      >
                        📋
                      </button>
                    </td>
                    <td className="center">
                      <button
                        type="button"
                        className="rep-act del"
                        title="Delete Report"
                        onClick={() => onDeleteReport(r.id)}
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

      <div className="remark-box" style={{ marginTop: '12px', borderLeftColor: '#1565C0' }}>
        <div className="remark-l" style={{ color: '#1565C0' }}>📌 How the Register Works</div>
        <div style={{ fontSize: '11.5px', color: 'var(--txt2)', lineHeight: 1.55 }}>
          Use <b>Save as Draft</b> to keep work-in-progress reports. Use <b>Validate &amp; Approve</b> once the report is complete and all signatures &amp; checks pass. Saved reports appear above. Click <b>✎</b> to load a record back into the form, <b>👁</b> to view its print layout, <b>📄</b> to print directly, <b>📋</b> to duplicate, or <b>🗑</b> to delete. Records are kept in your browser.
        </div>
      </div>

      <div className="btn-row">
        <button type="button" className="btn btn-add" onClick={exportCSV}>📤 Export Register (CSV)</button>
        <button type="button" className="btn btn-reset" onClick={handleClearAll}>🗑 Clear All Records</button>
      </div>
    </div>
  );
}
