import React, { useMemo } from 'react';
import { useDropzone } from 'react-dropzone';

const baseStyle = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '20px',
  borderWidth: 2,
  borderRadius: 2,
  borderColor: '#e1628d',
  borderStyle: 'dashed',
  backgroundColor: '#fafafa',
  color: '#bdbdbd',
  outline: 'none',
  transition: 'border .24s ease-in-out',
};

const activeStyle = {
  borderColor: '#e1628d',
};

const acceptStyle = {
  borderColor: '#00e676',
};

const rejectStyle = {
  borderColor: '#ff1744',
};

const divStyle = {
  display: 'flex',
  fontWeight: '400',
};

function StyledDropzone(props) {
  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
    acceptedFiles,
  } = useDropzone({ onDrop: files => props.onDrop(files), multiple: false });

  const style = useMemo(
    () => ({
      ...baseStyle,
      ...(isDragActive ? activeStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {}),
    }),
    [isDragActive, isDragReject],
  );

  const acceptedFilesItems = acceptedFiles.map(file => (
    <p key={file.path}>
      {file.path} - {file.size} bytes
    </p>
  ));

  return (
    <div className="container">
      <div {...getRootProps({ style })}>
        <input {...getInputProps()} />
        <p>{props.placeholder}</p>
      </div>
      <div style={divStyle}>
        <p>{'Accepted file:'}</p>&nbsp;
        {acceptedFilesItems}
      </div>
    </div>
  );
}

export default StyledDropzone;
