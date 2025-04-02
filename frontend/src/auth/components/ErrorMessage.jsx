import React from 'react';

const ErrorMessage = ({ message, i, j }) => {
  return (
    <p className="errorInput animation" style={{ "--i": i, "--j": j }}>
      {message}
    </p>
  );
};
export default ErrorMessage;

