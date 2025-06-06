import React, { useRef } from 'react';
import Input from '../../components/Input';

export default function FileUploadInput({
  label,
  form,
  fieldName,
  accept,
  className,
  ...props
}) {
  const fileInputRef = useRef(null);

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`w-full flex justify-center items-end gap-2 ${className}`}>
      <div
        className="flex w-10 h-10 justify-center items-center bg-[#495D72] rounded-2xl cursor-pointer"
        onClick={handleButtonClick}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
          <polyline points="17 8 12 3 7 8"></polyline>
          <line x1="12" y1="3" x2="12" y2="15"></line>
        </svg>
      </div>
      <Input
        ref={fileInputRef}
        className="!max-w-88"
        type="file"
        label={label}
        dir='ltr'
        // accept="image/*"
        form={form}
        field={form.getFieldProps(fieldName)}
        onChangeFile={(event) => {
          form.setFieldValue(fieldName, event.currentTarget.files[0]);
        }}
        {...props}
      />
    </div>
  );
}
