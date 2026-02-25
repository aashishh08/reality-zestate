"use client";

import React, { createContext, useContext, useState, useCallback } from 'react';

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

    const openModal = useCallback((source: string = 'lead-popup') => {
        setModalSource(source);
        setIsOpen(true);
    }, []);

    const closeModal = useCallback(() => {
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
