"use client";

import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { FORM_CONFIG } from '@/lib/constants';
import { getLeadSourceFromPathname } from '@/lib/lead-source';
import { hasSubmittedLeadPopup } from '@/lib/lead-popup-storage';

function isAdminPath(pathname: string | null): boolean {
    return pathname?.startsWith('/admin') ?? false;
}

export interface LeadPageContext {
    propertyId?: string;
    propertySlug?: string;
    propertyTitle?: string;
    blogSlug?: string;
    blogTitle?: string;
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
    const pathname = usePathname();
    const isAdminRoute = isAdminPath(pathname);
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

    useEffect(() => {
        if (isAdminRoute) {
            setIsOpen(false);
        }
    }, [isAdminRoute]);

    /** Recurring auto-open on public pages (LeadPopup remounts on route changes). */
    useEffect(() => {
        if (isAdminRoute) return;
        if (hasSubmittedLeadPopup()) return;

        const showAutoPopup = () => {
            if (isOpenRef.current) return;
            if (hasSubmittedLeadPopup()) return;
            if (isAdminPath(window.location.pathname)) return;

            // Fallback: derive slugs from route when page has not set context yet
            if (!pageContextRef.current.propertySlug) {
                const match = window.location.pathname.match(/^\/projects\/([^/]+)\/?$/);
                if (match) {
                    setPageContext((prev) => ({ ...prev, propertySlug: match[1] }));
                }
            }
            if (!pageContextRef.current.blogSlug) {
                const match = window.location.pathname.match(/^\/blogs\/([^/]+)\/?$/);
                if (match) {
                    setPageContext((prev) => ({ ...prev, blogSlug: match[1] }));
                }
            }

            const pageSource = getLeadSourceFromPathname(window.location.pathname);
            setModalSource(pageSource ?? 'lead-popup-timer');
            setIsOpen(true);
        };

        const intervalId = setInterval(showAutoPopup, FORM_CONFIG.LEAD_POPUP_DELAY);

        return () => clearInterval(intervalId);
    }, [isAdminRoute]);

    const openModal = useCallback((source: string = 'lead-popup') => {
        if (isAdminPath(pathname)) return;
        const pageSource = getLeadSourceFromPathname(pathname);
        setModalSource(pageSource ?? source);
        setIsOpen(true);
    }, [pathname]);

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
