import React, { useRef, useEffect, useState } from 'react';

export default function TabSwitcher({ mode, setMode }) {
  const containerRef = useRef(null);
  const bulkRef = useRef(null);
  const individualRef = useRef(null);
  const [underlineStyle, setUnderlineStyle] = useState({ left: '0px', width: '0px' });

  useEffect(() => {
    const selectedRef = mode === 'bulk' ? bulkRef : individualRef;
    if (selectedRef.current && containerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const selectedRect = selectedRef.current.getBoundingClientRect();

      setUnderlineStyle({
        left: `${selectedRect.left - containerRect.left}px`,
        width: `${selectedRect.width}px`,
      });
    }
  }, [mode]);

  useEffect(() => {
    const handleResize = () => {
        const selectedRef = mode === 'bulk' ? bulkRef : individualRef;
        if (selectedRef.current && containerRef.current) {
            const containerRect = containerRef.current.getBoundingClientRect();
            const selectedRect = selectedRef.current.getBoundingClientRect();

            setUnderlineStyle({
              left: `${selectedRect.left - containerRect.left}px`,
              width: `${selectedRect.width}px`,
            });
          }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [mode]);

  return (
    <div ref={containerRef} className="w-full max-w-60 flex justify-between items-center gap-4 border-b border-b-neutralgray-3 relative">
      <div
        className="absolute bottom-0 h-[2px] bg-redp transition-all duration-300 ease-in-out"
        style={underlineStyle}
      ></div>

      <label
        ref={bulkRef}
        className={`flex items-center cursor-pointer pb-1 px-4 ${mode === 'bulk' ? 'text-redp' : 'text-neutralgray-10'}`}
      >
        <input
          type="radio"
          name="mode"
          value="bulk"
          checked={mode === 'bulk'}
          onChange={() => setMode('bulk')}
          className="sr-only"
        />
        <span className="text-body-04">به صورت کلی</span>
      </label>

      <label
        ref={individualRef}
        className={`flex items-center cursor-pointer pb-1 px-4 ${mode === 'individual' ? 'text-redp' : 'text-neutralgray-10'}`}
      >
        <input
          type="radio"
          name="mode"
          value="individual"
          checked={mode === 'individual'}
          onChange={() => setMode('individual')}
          className="sr-only"
        />
        <span className="text-body-04">به صورت تکی</span>
      </label>
    </div>
  );
}
