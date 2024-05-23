import * as React from 'react';
import Dropzone from 'react-dropzone';
import classNames from 'classnames';
import styleVars from '../globals/color-variables.css';
import styles from './styles.css';
interface Props extends React.PropsWithChildren<{}> {
    accept: string[];
    passClicksThrough?: boolean;
    onChange: (files: (string | ArrayBuffer)[]) => void;
    onError: (error: Error) => void;
    style?: React.CSSProperties;
    className?: string;
}
const activeStyles = {
    outline: '2px solid ' + styleVars['--mid-green-00'],
};
const readFile = function (file: Blob): Promise<string | ArrayBuffer> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onerror = reject;
        reader.onload = () => {
            if (reader.result) {
                resolve(reader.result);
            }
            else {
                reject();
            }
        };
        reader.readAsText(file);
    });
};
export default class FileDropZone extends React.Component<Props> {
    private handle = (files: Blob[]) => {
        Promise.all(files.map((f) => readFile(f)))
            .then((fs) => this.props.onChange(fs))
            .catch(this.props.onError);
    };
    public render() {
        return (<Dropzone accept={this.props.accept.join(',')} onDrop={this.handle} noClick={this.props.passClicksThrough}>
        {({ getRootProps, getInputProps, isDragActive }) => (<div {...getRootProps({
                style: isDragActive ? activeStyles : undefined,
            })} className={classNames(styles.dropZone, this.props.className)}>
            <input {...getInputProps()}/>
            {this.props.children}
          </div>)}
      </Dropzone>);
    }
}
