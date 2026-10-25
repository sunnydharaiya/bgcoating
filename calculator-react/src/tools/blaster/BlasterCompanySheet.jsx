import React from 'react';

export default function BlasterCompanySheet({
  company,
  onChange,
  onNavigate,
  onSaveDraft,
  onValidate
}) {
  const handleLogoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange('logo', reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveLogo = (e) => {
    e.stopPropagation();
    onChange('logo', '');
  };

  return (
    <div className="sheet act" id="sh-company">
      <div className="xl-corp">
        <div className="xl-corp-inner">
          <div className="xl-corp-l">BG Group of Paint &amp; Coating Consultant</div>
          <div className="xl-corp-t">COMPANY DETAILS <span className="pro-chip">PRO</span></div>
          <div className="xl-corp-s">Upload your company name, logo, address &amp; contact details — reflected ONLY in Preview &amp; Print output</div>
        </div>
      </div>

      <div className="pro-note" id="company-pro-note">
        <div className="pro-note-ic">🔒</div>
        <div className="pro-note-t">
          <b>PRO Feature.</b> In the Free version company details are view-only and the printed report carries BG Group branding.
          In the <b>Pro version</b> your company name &amp; logo replace BG branding during <b>Preview &amp; Print generation only</b> —
          everywhere inside the application, BG Group branding remains as it is.
        </div>
      </div>

      <div id="company-branding-host">
        <div className="xl-sec-h" id="sec-company-0">
          <span className="ic">🏢</span>Company Branding
          <span className="num">REFLECTED IN PRINT HEADER</span>
        </div>
        <div className="op-photo-w">
          <div
            className={`op-photo-slot ${company.logo ? 'has-photo' : ''}`}
            id="co-logo-slot"
            tabIndex={0}
            onClick={() => document.getElementById('co-logo-input')?.click()}
            style={{ width: '130px', height: '130px' }}
            title="Click to upload your company logo"
          >
            {company.logo ? (
              <>
                <img src={company.logo} alt="Company Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                <button
                  className="op-ph-rm"
                  type="button"
                  onClick={handleRemoveLogo}
                  title="Remove logo"
                >
                  ✕
                </button>
              </>
            ) : (
              <>
                <div className="ph-ic">🏢</div>
                <div className="ph-l">Upload Logo</div>
                <div className="ph-s">Square PNG / JPG</div>
              </>
            )}
          </div>
          <input
            type="file"
            id="co-logo-input"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleLogoUpload}
          />
          <div className="op-photo-info">
            <div className="op-photo-info-h">🏢 Brand Identity (Print Header)</div>
            <div className="xl-info xl-info-2" style={{ marginBottom: 0 }}>
              <div className="xl-cell">
                <div className="xl-cell-l">Company Name</div>
                <div className="xl-cell-v">
                  <input
                    type="text"
                    id="co-name"
                    value={company.name || ''}
                    onChange={(e) => onChange('name', e.target.value)}
                    placeholder="Company Name"
                  />
                </div>
              </div>
              <div className="xl-cell">
                <div className="xl-cell-l">Tagline</div>
                <div className="xl-cell-v">
                  <input
                    type="text"
                    id="co-tagline"
                    value={company.division || ''}
                    onChange={(e) => onChange('division', e.target.value)}
                    placeholder="Tagline / Division"
                  />
                </div>
              </div>
              <div className="xl-cell">
                <div className="xl-cell-l">Email</div>
                <div className="xl-cell-v">
                  <input
                    type="text"
                    id="co-email"
                    value={company.email || ''}
                    onChange={(e) => onChange('email', e.target.value)}
                    placeholder="support@company.com"
                  />
                </div>
              </div>
              <div className="xl-cell">
                <div className="xl-cell-l">Website</div>
                <div className="xl-cell-v">
                  <input
                    type="text"
                    id="co-web"
                    value={company.website || ''}
                    onChange={(e) => onChange('website', e.target.value)}
                    placeholder="www.company.com"
                  />
                </div>
              </div>
              <div className="xl-cell">
                <div className="xl-cell-l">Phone</div>
                <div className="xl-cell-v xl-cell-span-2">
                  <input
                    type="text"
                    id="co-phone"
                    value={company.contact || ''}
                    onChange={(e) => onChange('contact', e.target.value)}
                    placeholder="+91 ..."
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="btn-row btn-row-std">
        <button type="button" className="btn btn-draft-std" onClick={onSaveDraft}>💾 Save as Draft</button>
        <button type="button" className="btn btn-validate-std" onClick={onValidate}>✓ Validate &amp; Approve</button>
        <button type="button" className="btn btn-save" onClick={() => onNavigate('watermark')}>Next: Watermark Removal →</button>
      </div>
    </div>
  );
}
