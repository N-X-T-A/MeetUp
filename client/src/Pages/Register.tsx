import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useExternalIP } from "../common/ExternalIP";
import { UserContext } from "../context/UserContext";

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState<string>("");
  const { userName } = useContext(UserContext);
  const [password, setPassword] = useState<string>("");
  const [name, setName] = useState<string>("");
  const externalIP = useExternalIP();

  if (!!userName) {
    navigate("/");
  } else {
    const handleRegister = async () => {
      try {
        const response = await fetch(`${externalIP}` + "/api/auth/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password, name }),
        });

        if (response.ok) {
          navigate("/login");
        } else {
          alert("Đăng ký thất bại. Vui lòng thử lại.");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    return (
      <div>
        <h2>Đăng ký</h2>
        <form onSubmit={(e) => e.preventDefault()}>
          <div>
            <label>Tên đăng nhập:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div>
            <label>Mật khẩu:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div>
            <label>Họ tên:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <button onClick={handleRegister}>Đăng ký</button>
        </form>
      </div>
    );
  }
};
