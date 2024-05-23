import * as React from 'react';
import colorVars from 'libs/dashlane-style/globals/color-variables.css';
export const SharedStatusIcon = () => {
    return (<svg xmlns="*****" width="10" height="9" fill="none" viewBox="0 0 10 9">
      <path fill={colorVars['--grey-00']} fillRule="evenodd" d="M9.763 8C9.417 7.127 8.57 6 6.5 6S3.583 7.127 3.237 8C3.018 8.55 3 9 3 9h7s-.019-.45-.237-1zM8.65 8c-.284-.46-.844-1-2.15-1s-1.866.54-2.15 1h4.3z" clipRule="evenodd"/>
      <path fill={colorVars['--grey-00']} d="M2.908 6.033C1.264 6.226.548 7.216.237 8 .019 8.55 0 9 0 9h1.57l.006-.046A5.256 5.256 0 011.783 8H1.35c.142-.23.353-.48.693-.673a4.781 4.781 0 01.866-1.294zM3.333 3.99a1.5 1.5 0 010-2.98C3.5.651 3.726.328 4 .05a2.5 2.5 0 100 4.9 3.508 3.508 0 01-.667-.96z"/>
      <path fill={colorVars['--grey-00']} d="M7.642 3.472a1.5 1.5 0 10-.842.497l.784.784a2.5 2.5 0 11.767-.573l-.709-.708z"/>
    </svg>);
};
