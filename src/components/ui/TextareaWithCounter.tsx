import React from 'react';

interface TextareaWithCounterProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder: string;
  maxLength: number;
  readOnly?: boolean;
}

export const TextareaWithCounter: React.FC<TextareaWithCounterProps> = ({
  value,
  onChange,
  placeholder,
  maxLength,
  readOnly = false
}) => {
  const charactersLeft = maxLength - value.length;
  
  return (
    <div className="flex flex-col h-full">
      <textarea
        className={`w-full h-64 p-3 text-gray-700 border border-gray-200 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${readOnly ? 'bg-gray-50' : 'bg-white'}`}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        maxLength={maxLength}
        readOnly={readOnly}
      />
      <div className="flex justify-end mt-2 text-sm text-gray-500">
        <span>{charactersLeft} characters left</span>
      </div>
    </div>
  );
};