import React from 'react';

const roles = [
  { id: 1, name: "استاد" },
  { id: 2, name: "دانشجو" }
];

export default function RoleSelector({ value, onChange, i, j }) {
  return (
    <div className="mt-4 flex flex-row-reverse justify-between items-center animation gap-2" style={{ '--i': i, '--j': j }}>
      <label className="text-label text-body-03">:نقش</label>
      <div className="flex flex-row-reverse gap-4">
        {roles.map(role => (
          <label key={role.id} className="flex flex-row-reverse justify-center items-center gap-1 cursor-pointer text-neutralgray-6">
            <input
              type="radio"
              name="roleId"
              value={role.id}
              checked={Number(value) === role.id}
              onChange={onChange}
              className="cursor-pointer peer w-4 h-4 rounded-full border border-big-stone-900 checked:bg-big-stone-700 checked:border-big-stone-950 focus:outline-none focus:ring-2 focus:ring-big-stone-50"
            />
            <span className="peer-checked:text-big-stone-700">{role.name}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
