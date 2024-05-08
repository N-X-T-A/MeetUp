import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useExternalIP } from "../common/ExternalIP";
import "../css/pages/login.css";
import { UserContext } from "../context/UserContext";

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const [name, setName] = useState<string>("");
  const { userName, setUserName } = useContext(UserContext); // Thêm userAvatar vào context

  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const externalIP = useExternalIP();

  const storedURL: string | null = localStorage.getItem("currentURL");

  if (!!userName) {
    navigate("/");
  } else {
    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      try {
        const response = await fetch(`${externalIP}` + "/api/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username: name, password }),
        });

        if (response.ok) {
          const data = await response.json();
          setUserName(data.name);
          //setUserAvatar(data.avatar);
          if (storedURL && storedURL !== "") {
            window.location.href = storedURL;
          } else {
            window.location.href = "/";
          }
        } else {
          alert("Đăng nhập thất bại. Vui lòng thử lại.");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    const register = () => {
      navigate("/register");
    };

    return (
      <div>
        <div className="background1"></div>
        <div className="bg">
          <div className="content">
            <div className="logo">
              <h1 className="relative flex items-center text-5xl font-bold text-black-800 dark:text-black dark:opacity-90 transition-colors">
                Meet
                <span className="ml-1 rounded-xl bg-current p-2 text-[0.7em] leading-none">
                  <span className="text-white dark:text-black">UP</span>
                </span>
              </h1>
            </div>
            <div className="text-sci">
              <h2>
                Chào Mừng Bạn Đã Đến Với MeetUp <br />
                <span>
                  Nơi Mọi Cuộc Gặp Gỡ Trở Nên Dễ Dàng Và Linh Hoạt Hơn Bao Giờ
                  Hết
                </span>
              </h2>
              <p></p>
            </div>
          </div>
          <div className="logreg-box">
            <div className="form-box login">
              <form onSubmit={handleLogin}>
                <h2>Đăng Nhập</h2>
                <div className="imput-box">
                  <input
                    name="option"
                    type="text"
                    id="form3Example3c"
                    className="form-control"
                    placeholder="Tên Đăng Nhập "
                    value={name}
                    onChange={(e) => setName(e.target.value)}
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
                    Đăng Nhập
                  </button>
                </div>
                <div className="login-register">
                  <p>
                    Bạn Chưa Có Tài Khoản{" "}
                    <span onClick={register}>Đăng Ký Ngay</span>
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
