import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useExternalIP } from "../common/ExternalIP";
import { UserContext } from "../context/UserContext";

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState<string>("");
  const { userName } = useContext(UserContext);
  const [name, setName] = useState<string>("");

  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const externalIP = useExternalIP();

  if (!!userName) {
    navigate("/");
  } else {
    const handleRegister = async () => {
      try {
        const response = await fetch(`${externalIP}` + "/api/register", {
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
    const login = () => {
      navigate("/login");
    };

    return (
      <div>
        <div className="background1"></div>
        <div className="bg">
          <div className="content">
            <h2 className="logo">MeetUp</h2>
            <div className="text-sci">
              <h2>
                Đăng Ký Tài Khoản Để Có Thể Tham Gia Cuộc Họp <br />
                <span>Thuận Tiện Nhanh Chóng Tiện Lợi</span>
              </h2>
              <p></p>
            </div>
          </div>
          <div className="logreg-box">
            <div className="form-box login">
              <form onSubmit={handleRegister}>
                <h2>Đăng Ký</h2>
                <div className="imput-box">
                  <input
                    name="yourname"
                    type="text"
                    className="form-control"
                    placeholder="Họ Và Tên"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />

                  <input
                    name="option"
                    type="text"
                    className="form-control"
                    placeholder="Tên Đăng Nhập "
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    id="form3Example4c"
                    className="form-control"
                    placeholder="Mật Khẩu"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="show-password"
                  >
                    {showPassword ? "Ẩn Mật Khẩu" : "Hiển Thị Mật Khẩu"}
                  </button>

                  <button type="submit" className="buton">
                    Đăng Ký
                  </button>
                </div>
                <div className="login-register">
                  <p>
                    Bạn Đã Có Tài Khoản{" "}
                    <span onClick={login}>Đăng Nhập Ngay</span>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
};
