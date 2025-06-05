import React from 'react';

const routes = [
  { label: 'ساخت کلاس', path: '/class/create/' },
  { label: 'ویرایش کلاس', path: '/class/edit/1' },
  { label: 'ساخت گروه', path: '/project/1/group/create/' },
  { label: 'ویرایش گروه', path: '/group/edit/1' },
  { label: 'ساخت پروژه', path: '/class/1/project/create/' },
  { label: 'ویرایش پروژه', path: '/class/1/project/edit/1' },
  { label: 'ساخت فاز', path: '/project/1/phase/create/' },
  { label: 'ویرایش فاز', path: '/project/1/phase/edit/1' },
  { label: 'ساخت تکلیف', path: '/class/1/exercise/create/' },
  { label: 'ویرایش تکلیف', path: '/class/1/exercise/edit/1' },
  { label: 'ساخت امتحان', path: '/class/1/exam/create/' },
  { label: 'ویرایش امتحان', path: '/class/1/exam/edit/1' },
];

function TestPage() {
  return (
    <div style={{ padding: '1rem' }}>
      <h2>صفحه تست مسیرها</h2>
      <ul style={{ lineHeight: '2rem' }}>
        {routes.map((route, i) => (
          <li key={i}>
            <a href={route.path} target="_blank" rel="noopener noreferrer" style={{ color: '#007bff' }}>
              {route.label} → {route.path}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TestPage;