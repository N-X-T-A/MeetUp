import React, { useState, ChangeEvent } from 'react';
import "../css/pages/login.css";

const PasswordInput = () => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className='password-input-container'>
     <div className="input-value">
        <input
            type={showPassword ? "text" : ""}
            placeholder="Mật Khẩu"
            id="password"
            value={password}
            className="form-control"
            onChange={handlePasswordChange}
        />
     </div>
      <div className="btn-value">
        <button onClick={togglePasswordVisibility}>
            {showPassword ? <i className="fa-solid fa-eye"></i> : <i className="fa-solid fa-eye-slash"></i>}
        </button>
      </div>
    </div>
  );
};

export default PasswordInput;
