/* ==========================================================================
   BG CoatingOS™ — Digital Workspace Logic
   ========================================================================== */
const $ = selector => document.querySelector(selector);
const $$ = selector => document.querySelectorAll(selector);

let session = {
  signedIn: true,
  name: 'Demo User',
  email: 'user@bgcoating.com',
  plan: 'Pro'
};

function toggleSidebar() {
  $('#app').classList.toggle('collapsed');
}

function go(viewId) {
  $$('.view').forEach(v => v.classList.remove('on'));
  $$('.sb-item').forEach(i => i.classList.remove('on'));

  const targetView = $('#view-' + viewId);
  const targetNavItem = $('[data-view="' + viewId + '"]');

  if (targetView) targetView.classList.add('on');
  if (targetNavItem) targetNavItem.classList.add('on');
}

function openUpgrade() {
  $('#upmodal').classList.add('open');
}

function closeUpgrade() {
  $('#upmodal').classList.remove('open');
}

function toast(title, msg) {
  const t = document.createElement('div');
  t.className = 'toast';
  t.innerHTML = `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2 3 6v6c0 5 4 8 9 10 5-2 9-5 9-10V6z"/><path d="m9 12 2 2 4-4"/></svg><div><b>${title}</b><span>${msg}</span></div>`;
  const toastContainer = $('#toast');
  if (toastContainer) {
    toastContainer.appendChild(t);
    setTimeout(() => {
      t.classList.add('out');
      setTimeout(() => t.remove(), 380);
    }, 4200);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const boot = $('#boot');
  if (boot) {
    setTimeout(() => {
      boot.classList.add('done');
    }, 400);
  }
});
