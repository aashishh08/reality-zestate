"use client";

import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { FORM_CONFIG } from '@/lib/constants';

export interface LeadPageContext {
    propertyId?: string;
    propertySlug?: string;
    propertyTitle?: string;
}

interface LeadModalContextType {
    isOpen: boolean;
    openModal: (source?: string) => void;
    closeModal: () => void;
    modalSource: string;
    pageContext: LeadPageContext;
    setLeadPageContext: (context: LeadPageContext) => void;
}

const LeadModalContext = createContext<LeadModalContextType | undefined>(undefined);

export function LeadModalProvider({ children }: { children: React.ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);
    const [modalSource, setModalSource] = useState('lead-popup');
    const [pageContext, setPageContext] = useState<LeadPageContext>({});
    const isOpenRef = useRef(false);
    const pageContextRef = useRef<LeadPageContext>({});
    useEffect(() => {
        isOpenRef.current = isOpen;
    }, [isOpen]);
    useEffect(() => {
        pageContextRef.current = pageContext;
    }, [pageContext]);

    const setLeadPageContext = useCallback((context: LeadPageContext) => {
        setPageContext(context);
    }, []);

    /** Recurring auto-open for the whole app (LeadPopup remounts on route changes). */
    useEffect(() => {
        const showAutoPopup = () => {
            if (isOpenRef.current) return;

            // Fallback: derive project slug from route when page has not set context yet
            if (!pageContextRef.current.propertySlug && typeof window !== 'undefined') {
                const match = window.location.pathname.match(/^\/projects\/([^/]+)\/?$/);
                if (match) {
                    setPageContext((prev) => ({ ...prev, propertySlug: match[1] }));
                }
            }

            setModalSource('lead-popup-timer');
            setIsOpen(true);
        };

        const intervalId = setInterval(showAutoPopup, FORM_CONFIG.LEAD_POPUP_DELAY);

        return () => clearInterval(intervalId);
    }, []);

    const openModal = useCallback((source: string = 'lead-popup') => {
        setModalSource(source);
        setIsOpen(true);
    }, []);

    const closeModal = useCallback(() => {
        setIsOpen(false);
    }, []);

    return (
        <LeadModalContext.Provider value={{ isOpen, openModal, closeModal, modalSource, pageContext, setLeadPageContext }}>
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
