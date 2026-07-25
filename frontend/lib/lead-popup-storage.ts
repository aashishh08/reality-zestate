const LEAD_POPUP_SUBMITTED_KEY = 'lead_popup_submitted';

export function hasSubmittedLeadPopup(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(LEAD_POPUP_SUBMITTED_KEY) === 'true';
}

export function markLeadPopupSubmitted(): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(LEAD_POPUP_SUBMITTED_KEY, 'true');
}
