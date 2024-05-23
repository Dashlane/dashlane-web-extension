import * as React from 'react';
interface Props {
    className?: string;
}
const DeleteIcon = (props: Props) => (<svg className={props.className} width="16" height="16" viewBox="0 0 16 16" xmlns="*****" fill="none">
    <path d="M13.5 2.5V15.5H2.5V2.5M10.5 2.5V0.5H5.5V2.5M1 2.5H15M5.5 6V11M8 6V11M10.5 6V11" stroke="#0E6476" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>);
export default DeleteIcon;
