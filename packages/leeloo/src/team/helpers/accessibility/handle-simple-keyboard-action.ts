import React from 'react';
export const convertOnClickWithKeyboardAction = (onClick?: () => void) => {
    return (event: React.KeyboardEvent) => {
        if (onClick && (event.key === 'Enter' || event.key === ' ')) {
            onClick();
            event.preventDefault();
        }
    };
};
