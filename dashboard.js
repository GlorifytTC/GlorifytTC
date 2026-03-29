// dashboard.js - Complete dashboard functionality with all new features

const API = 'http://localhost:8000';
let token = localStorage.getItem('gt_token');
let currentEmailId = null;
let dashData = null;

// ── Auth guard ──
if (!token) window.location.href = 'emailbot.html';

function authHeaders() {
    return { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token };
}

// ── Toast ──
function toast(msg, type = '') {
    const t = document.getElementById('toast');
    if (t) {
        t.textContent = msg;
        t.className = 'toast show ' + type;
        setTimeout(() => t.className = 'toast', 3500);
    }
}

// ── Navigation ──
function showPanel(id, el) {
    document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    document.getElementById('panel-' + id).classList.add('active');
    if (el) el.classList.add('active');
}

// ── Load dashboard ──
async function loadDashboard() {
    try {
        const res = await fetch(`${API}/api/dashboard`, { headers: authHeaders() });
        if (res.status === 401) {
            localStorage.removeItem('gt_token');
            window.location.href = 'emailbot.html';
            return;
        }
        dashData = await res.json();
        renderDashboard(dashData);
    } catch (e) {
        toast('Failed to load dashboard', 'error');
    } finally {
        const loader = document.getElementById('loadingOverlay');
        if (loader) loader.style.display = 'none';
    }
}

function renderDashboard(d) {
    const info = d.info;
    
    // User card
    const userNameEl = document.getElementById('userName');
    const userPlanEl = document.getElementById('userPlan');
    const userAvatarEl = document.getElementById('userAvatar');
    if (userNameEl) userNameEl.textContent = info.company_name;
    if (userPlanEl) userPlanEl.textContent = info.plan || 'No plan';
    if (userAvatarEl) userAvatarEl.textContent = info.company_name?.[0]?.toUpperCase() || '?';
    
    // Bot status & Trial countdown
    const badge = document.getElementById('botStatusBadge');
    const txt = document.getElementById('botStatusText');
    const upgradeBanner = document.getElementById('upgradeBanner');
    const trialCountdown = document.getElementById('trialCountdown');
    const subscriptionEndDate = document.getElementById('subscriptionEndDate');
    
    if (info.bot_active && info.sub_status === 'active') {
        if (badge) badge.className = 'status-badge';
        if (txt) txt.textContent = 'Bot Active';
        if (upgradeBanner) upgradeBanner.style.display = 'none';
        if (trialCountdown) trialCountdown.style.display = 'none';
    } else if (info.sub_status === 'trial') {
        if (badge) badge.className = 'status-badge';
        if (txt) txt.textContent = 'Trial Active';
        if (upgradeBanner) upgradeBanner.style.display = 'none';
        if (trialCountdown) {
            trialCountdown.style.display = 'block';
            if (info.trial_end) {
                const trialEnd = new Date(info.trial_end);
                const today = new Date();
                const daysLeft = Math.ceil((trialEnd - today) / (1000 * 60 * 60 * 24));
                document.getElementById('trialDaysLeft').textContent = daysLeft > 0 ? daysLeft : 0;
                if (daysLeft <= 3 && daysLeft > 0) {
                    document.getElementById('trialWarning').textContent = `⚠️ Your trial ends in ${daysLeft} days! Upgrade to continue.`;
                } else if (daysLeft <= 0) {
                    document.getElementById('trialWarning').textContent = '⚠️ Your trial has expired. Upgrade to continue using the bot.';
                }
            }
        }
        if (subscriptionEndDate && info.trial_end) {
            const endDate = new Date(info.trial_end).toLocaleDateString('sv-SE');
            subscriptionEndDate.textContent = `Trial ends: ${endDate}`;
        }
    } else {
        if (badge) badge.className = 'status-badge inactive';
        if (txt) txt.textContent = 'Inactive';
        if (upgradeBanner) upgradeBanner.style.display = 'flex';
        if (trialCountdown) trialCountdown.style.display = 'none';
    }
    
    // Stats
    const statTotal = document.getElementById('statTotal');
    const statAuto = document.getElementById('statAuto');
    const statDrafts = document.getElementById('statDrafts');
    const statSpam = document.getElementById('statSpam');
    
    if (statTotal) statTotal.textContent = d.stats.emails_today;
    if (statAuto) statAuto.textContent = d.stats.auto_replied;
    if (statDrafts) statDrafts.textContent = d.stats.awaiting;
    if (statSpam) statSpam.textContent = d.stats.spam;
    
    // Recent emails
    renderEmailList(d.recent, 'recentEmailsList');
    
    // Settings prefill
    const companyName = document.getElementById('companyName');
    const companyEmail = document.getElementById('companyEmail');
    const signature = document.getElementById('signature');
    
    if (companyName) companyName.value = info.company_name || '';
    if (companyEmail) companyEmail.value = info.email || '';
    if (signature) signature.value = d.info.signature || '';
    
    // Billing
    const billingPlan = document.getElementById('billingPlan');
    const subStatusBadge = document.getElementById('subStatusBadge');
    const billingDesc = document.getElementById('billingDesc');
    const emailUsage = document.getElementById('emailUsage');
    
    if (billingPlan) billingPlan.textContent = info.plan || 'No plan';
    if (subStatusBadge) {
        subStatusBadge.textContent = info.sub_status || 'inactive';
        subStatusBadge.className = `sub-status-badge sub-${info.sub_status || 'inactive'}`;
    }
    
    const planLimits = { small: '500', medium: '2 000', large: 'Unlimited', none: '—', trial: '500' };
    const lim = planLimits[info.plan] || planLimits[info.sub_status] || '—';
    if (billingDesc) {
        if (info.sub_status === 'trial') {
            billingDesc.textContent = `Trial — 500 emails free`;
        } else {
            billingDesc.textContent = info.plan && info.plan !== 'none' ? `${info.plan} plan — ${lim} emails/month` : 'Subscribe to get started';
        }
    }
    if (emailUsage) emailUsage.textContent = `${d.stats.emails_today} / ${lim}`;
    
    // Gmail status
    checkGmailStatus();
    
    // Load invoices
    loadInvoices();
    
    // Load VAT number
    loadVatNumber();
}

function renderEmailList(emails, containerId) {
    const el = document.getElementById(containerId);
    if (!el) return;
    
    if (!emails || emails.length === 0) {
        el.innerHTML = '<div class="empty-state">No emails yet</div>';
        return;
    }
    
    el.innerHTML = emails.map(e => {
        const dotClass = { auto_replied: 'dot-auto', draft: 'dot-draft', spam: 'dot-spam', pending: 'dot-pending' }[e.status] || 'dot-pending';
        const tagClass = { auto_replied: 'etag-auto', draft: 'etag-draft', spam: 'etag-spam' }[e.status] || 'etag-pending';
        const tagLabel = { auto_replied: 'AUTO REPLIED', draft: 'NEEDS APPROVAL', spam: 'SPAM', pending: 'PENDING', archived: 'ARCHIVED' }[e.status] || e.status.toUpperCase();
        const time = new Date(e.received_at).toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' });
        
        const fromName = (e.from_name || e.from_email || 'Unknown').replace(/'/g, '');
        const subject = (e.subject || '(no subject)').replace(/'/g, '');
        const reply = (e.ai_reply || 'No AI reply yet').replace(/'/g, "\\'");
        
        return `<div class="email-item" onclick="openDraftModal(${e.id},'${fromName}: ${subject}','${reply}')">
            <div class="email-dot ${dotClass}"></div>
            <div class="email-meta">
                <div class="email-from">${fromName}</div>
                <div class="email-subject">${subject}</div>
            </div>
            <div class="email-right">
                <div class="email-time">${time}</div>
                <div class="etag ${tagClass}">${tagLabel}</div>
            </div>
        </div>`;
    }).join('');
}

// ── Filter emails ──
async function filterEmails(status, btn) {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const url = status ? `${API}/api/emails?status=${status}` : `${API}/api/emails`;
    const res = await fetch(url, { headers: authHeaders() });
    const data = await res.json();
    renderEmailList(data, 'allEmailsList');
}

// ── Draft modal ──
function openDraftModal(id, from, reply) {
    currentEmailId = id;
    const draftFrom = document.getElementById('draftFrom');
    const draftContent = document.getElementById('draftContent');
    const draftModal = document.getElementById('draftModal');
    
    if (draftFrom) draftFrom.textContent = from;
    if (draftContent) draftContent.textContent = reply || 'No AI reply yet';
    if (draftModal) draftModal.classList.add('active');
}

function closeDraft() {
    const draftModal = document.getElementById('draftModal');
    if (draftModal) draftModal.classList.remove('active');
}

// Draft modal click outside to close
const draftModal = document.getElementById('draftModal');
if (draftModal) {
    draftModal.addEventListener('click', e => {
        if (e.target === e.currentTarget) closeDraft();
    });
}

async function approveDraft() {
    if (!currentEmailId) return;
    await fetch(`${API}/api/emails/${currentEmailId}/approve`, { method: 'POST', headers: authHeaders() });
    closeDraft();
    toast('✓ Reply sent successfully', 'success');
    loadDashboard();
}

async function rejectDraft() {
    if (!currentEmailId) return;
    await fetch(`${API}/api/emails/${currentEmailId}/reject`, { method: 'POST', headers: authHeaders() });
    closeDraft();
    toast('Email discarded');
    loadDashboard();
}

// ── Documents ──
async function loadDocuments() {
    const res = await fetch(`${API}/api/documents`, { headers: authHeaders() });
    const docs = await res.json();
    const el = document.getElementById('docList');
    if (!el) return;
    
    if (!docs.length) {
        el.innerHTML = '<div class="empty-state">No documents uploaded yet</div>';
        return;
    }
    
    el.innerHTML = docs.map(d => {
        const fileType = d.filename.endsWith('.pdf') ? 'pdf' : 'word';
        return `
            <div class="doc-item">
                <div class="doc-icon"><i class="fas fa-file-${fileType}"></i></div>
                <div><div class="doc-name">${d.filename}</div><div class="doc-size">${(d.file_size / 1024).toFixed(0)} KB</div></div>
                <div class="doc-status ${d.status === 'trained' ? 'doc-trained' : 'doc-processing'}">${d.status.toUpperCase()}</div>
            </div>`;
    }).join('');
}

function handleUpload(input) {
    Array.from(input.files).forEach(file => {
        const item = document.createElement('div');
        item.className = 'doc-item';
        item.innerHTML = `<div class="doc-icon"><i class="fas fa-file"></i></div>
            <div><div class="doc-name">${file.name}</div><div class="doc-size">${(file.size / 1024).toFixed(0)} KB · Processing...</div></div>
            <div class="doc-status doc-processing">PROCESSING</div>`;
        document.getElementById('docList').appendChild(item);
        
        setTimeout(() => {
            item.querySelector('.doc-status').className = 'doc-status doc-trained';
            item.querySelector('.doc-status').textContent = 'TRAINED';
        }, 3000);
    });
    toast(`${input.files.length} file(s) uploaded`);
}

function handleDrop(e) {
    e.preventDefault();
    const dt = e.dataTransfer;
    if (dt.files.length) handleUpload(dt);
}

// ── Settings ──
async function saveSettings() {
    const data = {
        auto_reply_prices: document.getElementById('togglePrices')?.checked || false,
        draft_appointments: document.getElementById('toggleAppts')?.checked || false,
        auto_archive_spam: document.getElementById('toggleSpam')?.checked || false,
        daily_summary: document.getElementById('toggleSummary')?.checked || false,
        signature: document.getElementById('signature')?.value || '',
        check_interval: document.getElementById('checkInterval')?.value || 5,
    };
    
    const res = await fetch(`${API}/api/settings`, { method: 'PUT', headers: authHeaders(), body: JSON.stringify(data) });
    if (res.ok) toast('✓ Settings saved', 'success');
    else toast('Failed to save', 'error');
}

// ── Gmail OAuth ──
async function startGmailAuth() {
    try {
        const res = await fetch(`${API}/api/gmail/auth`, {
            headers: authHeaders()
        });
        const data = await res.json();
        
        if (data.auth_url) {
            window.location.href = data.auth_url;
        } else {
            toast(data.error || 'Gmail connection not available', 'error');
        }
    } catch (e) {
        toast('Failed to connect Gmail', 'error');
    }
}

async function disconnectGmail() {
    if (!confirm('Are you sure you want to disconnect Gmail? The bot will stop monitoring your inbox.')) return;
    try {
        const res = await fetch(`${API}/api/gmail/disconnect`, {
            method: 'POST',
            headers: authHeaders()
        });
        if (res.ok) {
            toast('✓ Gmail disconnected', 'success');
            checkGmailStatus();
        } else {
            toast('Failed to disconnect', 'error');
        }
    } catch (e) {
        toast('Failed to disconnect', 'error');
    }
}

async function checkGmailStatus() {
    try {
        const res = await fetch(`${API}/api/gmail/status`, {
            headers: authHeaders()
        });
        const data = await res.json();
        
        const gmailEmailEl = document.getElementById('gmailEmail');
        const gmailStatusEl = document.getElementById('gmailStatus');
        const connectBtn = document.getElementById('connectGmailBtn');
        const disconnectBtn = document.getElementById('disconnectGmailBtn');
        
        if (data.connected) {
            if (gmailEmailEl) gmailEmailEl.innerHTML = '<i class="fas fa-check-circle"></i> Connected';
            if (gmailStatusEl) {
                gmailStatusEl.innerHTML = '● Active - Bot is monitoring';
                gmailStatusEl.className = 'gmail-status connected';
            }
            if (connectBtn) connectBtn.style.display = 'none';
            if (disconnectBtn) disconnectBtn.style.display = 'flex';
        } else {
            if (gmailEmailEl) gmailEmailEl.textContent = 'Not connected';
            if (gmailStatusEl) {
                gmailStatusEl.innerHTML = '● Not connected';
                gmailStatusEl.className = 'gmail-status disconnected';
            }
            if (connectBtn) connectBtn.style.display = 'flex';
            if (disconnectBtn) disconnectBtn.style.display = 'none';
        }
    } catch (e) {
        console.log('Gmail status check failed:', e);
    }
}

// ── Password Change ──
async function changePassword() {
    const cur = document.getElementById('curPass')?.value || '';
    const nw = document.getElementById('newPass')?.value || '';
    const conf = document.getElementById('confPass')?.value || '';
    
    if (nw !== conf) {
        toast('Passwords do not match', 'error');
        return;
    }
    if (nw.length < 8) {
        toast('Min 8 characters', 'error');
        return;
    }
    
    const res = await fetch(`${API}/api/change-password`, {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify({ current_password: cur, new_password: nw })
    });
    const data = await res.json();
    
    if (res.ok) {
        toast('✓ Password updated', 'success');
        const curPass = document.getElementById('curPass');
        const newPass = document.getElementById('newPass');
        const confPass = document.getElementById('confPass');
        if (curPass) curPass.value = '';
        if (newPass) newPass.value = '';
        if (confPass) confPass.value = '';
    } else {
        toast(data.detail || 'Failed', 'error');
    }
}



// ── Cancel Subscription ──
async function cancelSubscription() {
    if (!confirm('Are you sure you want to cancel your subscription? You will lose access at the end of your billing period.')) return;
    const res = await fetch(`${API}/api/cancel-subscription`, { method: 'POST', headers: authHeaders() });
    if (res.ok) toast('Subscription will cancel at end of billing period');
    else toast('Failed to cancel', 'error');
}

// ── Delete Account ──
function deleteAccount() {
    document.getElementById('deleteModal').classList.add('active');
}

function closeDeleteModal() {
    document.getElementById('deleteModal').classList.remove('active');
}

async function confirmDeleteAccount() {
    try {
        const res = await fetch(`${API}/api/delete-account`, {
            method: 'DELETE',
            headers: authHeaders()
        });
        if (res.ok) {
            localStorage.removeItem('gt_token');
            toast('Account deleted successfully');
            setTimeout(() => window.location.href = 'index.html', 1500);
        } else {
            toast('Failed to delete account', 'error');
        }
    } catch (e) {
        toast('Failed to delete account', 'error');
    }
    closeDeleteModal();
}

// ── Invoices ──
async function loadInvoices() {
    try {
        const res = await fetch(`${API}/api/invoices`, { headers: authHeaders() });
        const invoices = await res.json();
        const container = document.getElementById('invoicesList');
        if (!container) return;
        
        if (!invoices || invoices.length === 0) {
            container.innerHTML = '<div class="empty-state">No invoices yet</div>';
            return;
        }
        
        container.innerHTML = invoices.map(inv => `
            <div class="invoice-item">
                <span>${inv.date} - ${inv.plan} plan</span>
                <span>${inv.amount} SEK</span>
                <span class="invoice-download" onclick="downloadInvoice('${inv.id}')">Download PDF</span>
            </div>
        `).join('');
    } catch (e) {
        console.log('Failed to load invoices');
    }
}

async function downloadInvoice(invoiceId) {
    window.open(`${API}/api/invoices/${invoiceId}/download?token=${token}`, '_blank');
}

async function saveVatNumber() {
    const vat = document.getElementById('vatNumber')?.value || '';
    const res = await fetch(`${API}/api/save-vat`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ vat_number: vat })
    });
    if (res.ok) toast('✓ VAT number saved', 'success');
    else toast('Failed to save', 'error');
}
// Fetch emails from Gmail
async function fetchEmails() {
    toast('Fetching emails...', 'info');
    try {
        const res = await fetch(`${API}/api/gmail/fetch`, {
            method: 'POST',
            headers: authHeaders()
        });
        const data = await res.json();
        if (data.success) {
            toast(`✓ Fetched ${data.processed} new emails`, 'success');
            loadDashboard(); // Refresh dashboard
            if (document.getElementById('panel-emails').classList.contains('active')) {
                filterEmails(null, document.querySelector('.filter-btn.active'));
            }
        } else {
            toast('Failed to fetch emails', 'error');
        }
    } catch (e) {
        toast('Failed to fetch emails', 'error');
    }
}
async function loadVatNumber() {
    try {
        const res = await fetch(`${API}/api/get-vat`, { headers: authHeaders() });
        const data = await res.json();
        if (data.vat_number) {
            const vatInput = document.getElementById('vatNumber');
            if (vatInput) vatInput.value = data.vat_number;
        }
    } catch (e) {}
}

// ── Init ──
document.addEventListener('DOMContentLoaded', () => {
    loadDashboard();
    checkGmailStatus();
    
    // Set up document click for documents panel
    const documentsNav = document.querySelector('[onclick="showPanel(\'documents\',this)"]');
    if (documentsNav) {
        documentsNav.addEventListener('click', loadDocuments);
    }
    


    
    // Make functions globally available
    window.showPanel = showPanel;
    window.filterEmails = filterEmails;
    window.openDraftModal = openDraftModal;
    window.approveDraft = approveDraft;
    window.rejectDraft = rejectDraft;
    window.handleUpload = handleUpload;
    window.handleDrop = handleDrop;
    window.saveSettings = saveSettings;
    window.startGmailAuth = startGmailAuth;
    window.disconnectGmail = disconnectGmail;
    window.checkGmailStatus = checkGmailStatus;
    window.changePassword = changePassword;
    window.cancelSubscription = cancelSubscription;
    window.deleteAccount = deleteAccount;
    window.confirmDeleteAccount = confirmDeleteAccount;
    window.closeDeleteModal = closeDeleteModal;
    window.downloadInvoice = downloadInvoice;
    window.saveVatNumber = saveVatNumber;
    window.loadDocuments = loadDocuments;
});

// Make functions available globally for onclick handlers
window.showPanel = showPanel;
window.filterEmails = filterEmails;
window.openDraftModal = openDraftModal;
window.approveDraft = approveDraft;
window.rejectDraft = rejectDraft;
window.saveSettings = saveSettings;
window.startGmailAuth = startGmailAuth;
window.disconnectGmail = disconnectGmail;
window.changePassword = changePassword;
window.cancelSubscription = cancelSubscription;
window.deleteAccount = deleteAccount;
window.confirmDeleteAccount = confirmDeleteAccount;
window.closeDeleteModal = closeDeleteModal;
window.downloadInvoice = downloadInvoice;
window.saveVatNumber = saveVatNumber;
window.loadDocuments = loadDocuments;