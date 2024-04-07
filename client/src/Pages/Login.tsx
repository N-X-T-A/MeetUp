import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useExternalIP } from "../common/ExternalIP";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleHalfStroke } from "@fortawesome/free-solid-svg-icons";
import "../css/pages/login.css";
import { UserContext } from "../context/UserContext";

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const [name, setName] = useState<string>("");
  const { userName, setUserName } = useContext(UserContext);

  const [password, setPassword] = useState<string>("");
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
          body: JSON.stringify({ name, password }),
        });

        if (response.ok) {
          setUserName(name);
          //navigate("/");
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
            <h2 className="logo">
              <FontAwesomeIcon icon={faCircleHalfStroke} /> MeetUp
            </h2>
            <div className="text-sci">
              <h2>
                Welcome!! <br />
                <span>To our new Website</span>
              </h2>
              <p></p>
            </div>
          </div>
          <div className="logreg-box">
            <div className="form-box login">
              <form onSubmit={handleLogin}>
                <h2>Login</h2>
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
                    type="password"
                    id="form3Example4c"
                    className="form-control"
                    placeholder="Mật Khẩu"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button type="submit" className="buton">
                    Đăng Nhập
                  </button>
                </div>
                <div className="login-register">
                  <p>
                    Don't have an account?{" "}
                    <span onClick={register}>Sign up</span>
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
