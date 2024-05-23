import * as React from 'react';
import colorVars from 'libs/dashlane-style/globals/color-variables.css';
export const LockIcon = () => {
    return (<svg xmlns="*****" width="8" height="10" fill="none" viewBox="0 0 8 10">
      <path fill={colorVars['--grey-00']} fillRule="evenodd" d="M0 4h8v6H0V4zm1 1h6v5H5.997L5 9H1V5z" clipRule="evenodd"/>
      <path fill={colorVars['--grey-00']} d="M3.995 1C5.147 1 6 2.023 6 3.253V4h1v-.747C7 1.613 5.832 0 3.995 0c-.862 0-1.621.29-2.166.835C1.285 1.38.994 2.141 1 3.008L2 3c-.004-.636.205-1.127.537-1.459C2.869 1.21 3.36 1 3.995 1z"/>
    </svg>);
};
