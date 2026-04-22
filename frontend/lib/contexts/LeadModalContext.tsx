"use client";

import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { FORM_CONFIG } from '@/lib/constants';

/** Once set, we do not show the delayed auto popup again in this tab session. */
const LEAD_AUTO_POPUP_SESSION_KEY = 'leadPopup_auto_handled';

function markLeadAutoPopupHandled() {
    try {
        if (typeof sessionStorage !== 'undefined') {
            sessionStorage.setItem(LEAD_AUTO_POPUP_SESSION_KEY, '1');
        }
    } catch {
        // ignore
    }
}

function isLeadAutoPopupHandled() {
    try {
        if (typeof sessionStorage === 'undefined') return true;
        return sessionStorage.getItem(LEAD_AUTO_POPUP_SESSION_KEY) === '1';
    } catch {
        return true;
    }
}

interface LeadModalContextType {
    isOpen: boolean;
    openModal: (source?: string) => void;
    closeModal: () => void;
    modalSource: string;
}

const LeadModalContext = createContext<LeadModalContextType | undefined>(undefined);

export function LeadModalProvider({ children }: { children: React.ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);
    const [modalSource, setModalSource] = useState('lead-popup');
    const isOpenRef = useRef(false);
    useEffect(() => {
        isOpenRef.current = isOpen;
    }, [isOpen]);

    /** One delayed auto-open for the whole app (LeadPopup remounts on route changes). */
    useEffect(() => {
        if (isLeadAutoPopupHandled()) return;

        const t = setTimeout(() => {
            if (isLeadAutoPopupHandled()) return;
            if (isOpenRef.current) return;
            setModalSource('lead-popup-timer');
            setIsOpen(true);
            markLeadAutoPopupHandled();
        }, FORM_CONFIG.LEAD_POPUP_DELAY);

        return () => clearTimeout(t);
    }, []);

    const openModal = useCallback((source: string = 'lead-popup') => {
        setModalSource(source);
        setIsOpen(true);
    }, []);

    const closeModal = useCallback(() => {
        markLeadAutoPopupHandled();
        setIsOpen(false);
    }, []);

    return (
        <LeadModalContext.Provider value={{ isOpen, openModal, closeModal, modalSource }}>
            {children}
        </LeadModalContext.Provider>
    );
}

export function useLeadModal() {
    const context = useContext(LeadModalContext);
    if (context === undefined) {
        throw new Error('useLeadModal must be used within a LeadModalProvider');
    }
    return context;
}
