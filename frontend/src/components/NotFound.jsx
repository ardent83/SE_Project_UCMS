import React from 'react';
import NotFoundGif from '/animated-3D-404-not-found-page-error.gif';
import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div className="min-h-screen w-full flex flex-col justify-center items-center gap-2">
      <img
        src={NotFoundGif}
        alt="404 Not Found Animation"
        className="w-full max-w-lg"
      />
      <div className="flex flex-col justify-start items-center gap-2">
        <h1 className="text-heading-h4 font-bold text-gray-800">
          صفحه مورد نظر یافت نشد
        </h1>
        <p className="text-body-04 text-gray-600">
          .متاسفانه آدرسی که به دنبال آن بودید در سایت ما وجود ندارد
        </p>
      </div>

      <Link
        to="/dashboard"
        className="px-6 py-3 bg-redp text-white font-semibold rounded-lg shadow-md hover:bg-big-stone-700 transition-colors duration-300"
      >
        بازگشت به داشبورد
      </Link>

    </div>
  );
}

export default NotFound;