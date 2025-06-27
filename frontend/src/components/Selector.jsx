import React from 'react';
import classNames from "classnames";

import {
  theme,
  getLabelClasses,
} from "./Theme";

export default function Selector({ label, radios, value, onChange, disabled }) {
  return (
    <div className="w-full flex flex-col justify-center items-end animation gap-2">
      <label className={classNames(theme.baseClasses.labelWrapper,
        {
          [getLabelClasses(theme, false, disabled, false)]: true,
        }
      )} >{label}</label>
      <div className="w-full max-w-40 justify-around flex flex-row-reverse gap-4">
        {radios.map(radio => (
          <label key={radio.id} className="peer-disabled:cursor-not-allowed flex flex-row-reverse justify-center items-center gap-1 text-neutralgray-6">
            <input
              type="radio"
              name="radioId"
              value={radio.id}
              checked={Number(value) === radio.id}
              onChange={onChange}
              className="peer cursor-pointer disabled:cursor-not-allowed peer w-4 h-4 rounded-full border border-big-stone-900 checked:bg-redp checked:border-big-stone-950 focus:outline-none focus:ring-2 focus:ring-big-stone-50"
              disabled={disabled}
              data-testid={`selector-${radio.id}`}
            />
            <span className="peer-disabled:cursor-not-allowed text-body-04 peer-checked:text-big-stone-00">{radio.name}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
