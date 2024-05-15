import { Join } from "../components/Join";
import { useContext, useState, useEffect } from "react";
import "../css/pages/home.css";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/common/Button";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { NameInput } from "../common/Name";
import { HistoryButton } from "../components/HistoryButton";

export const Home = () => {
  const { userName } = useContext(UserContext);
  const [currentTime, setCurrentTime] = useState("");
  const [currentDate, setCurrentDate] = useState("");
  const [slideViewImage, setSlideViewImage] = useState(
    "https://www.gstatic.com/meet/user_edu_brady_bunch_light_81fa864771e5c1dd6c75abe020c61345.svg"
  );
  const [isNextDisabled, setIsNextDisabled] = useState(false);
  const [isBackDisabled, setIsBackDisabled] = useState(true);
  const [hedCap, setHedCap] = useState("Hẹn Gặp Mọi Người Cùng Nhau");
  const [subCap, setSubCap] = useState("Gặp Gỡ Nhau Mọi Lúc Mọi Nơi");
  const navigate = useNavigate();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleLogin = () => {
    navigate("/Login");
  };

  const updateTime = () => {
    const myDate = new Date();

    const today = format(myDate, "EEEE, 'Ngày' dd MMMM", { locale: vi });

    let hours = myDate.getHours();
    const amOrPm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;

    const minutes = myDate.getMinutes().toString().padStart(2, "0");

    const currentTime = `${hours}:${minutes} ${amOrPm}`;

    setCurrentTime(currentTime);
    setCurrentDate(today);
  };

  const handleNextClick = () => {
    setSlideViewImage(
      "https://www.gstatic.com/meet/user_edu_safety_light_e04a2bbb449524ef7e49ea36d5f25b65.svg"
    );
    setIsNextDisabled(true);
    setIsBackDisabled(false);
    setHedCap("Cuộc Họp Được Bảo Mật");
    setSubCap("Không Ai Có Thể Tham Gia Khi Chưa Có Sự Chấp Nhận Từ Chủ Phòng");
  };

  const handleBackClick = () => {
    setSlideViewImage(
      "https://www.gstatic.com/meet/user_edu_brady_bunch_light_81fa864771e5c1dd6c75abe020c61345.svg"
    );
    setIsNextDisabled(false);
    setIsBackDisabled(true);
    setHedCap("Hẹn Gặp Mọi Người Cùng Nhau");
    setSubCap("Gặp Gỡ Nhau Mọi Lúc Mọi Nơi");
  };

  const toggleDialog = () => {
    setIsDialogOpen(!isDialogOpen);
  };

  return (
    <div>
      <div className="nav">
        <div className="logo">
          <h1 className="relative flex items-center text-5xl font-bold text-black-800 dark:text-black dark:opacity-90 transition-colors">
            Meet
            <span className="ml-1 rounded-xl bg-current p-2 text-[0.7em] leading-none">
              <span className="text-white dark:text-black">UP</span>
            </span>
          </h1>
        </div>
        <div className="Left">
          <div className="Date-time px-3">
            <span id="time">{currentTime}</span>
            <span id="Date">{currentDate}</span>
          </div>
          <div className="line"></div>
          <div className="history-icon px-3">
            <HistoryButton onClick={toggleDialog} />
          </div>
        </div>
        {isDialogOpen && (
          <div className="dialog-overlay-home">
            <div className="dialog-home">
              <div className="History-dialog">
                <table className="table">
                  <thead>
                    <tr>
                      <th scope="col" className="col-1">
                        Ngày-Giờ Bắt Đầu
                      </th>
                      <th scope="col" className="">
                        Mã Phòng
                      </th>
                      <th scope="col" className="">
                        Số Người Tham Gia
                      </th>
                      <th scope="col" className="">
                        Kết Thúc
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <th scope="row">1</th>
                      <td>Mark</td>
                      <td>Otto</td>
                      <td>@mdo</td>
                    </tr>
                    <tr>
                      <th scope="row">2</th>
                      <td>Jacob</td>
                      <td>Thornton</td>
                      <td>@fat</td>
                    </tr>
                    <tr>
                      <th scope="row">3</th>
                      <td colSpan={2}>Larry the Bird</td>
                      <td>@twitter</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <button className="btn-dialogg" onClick={toggleDialog}>
                Đóng
              </button>
            </div>
          </div>
        )}
      </div>
      <div className="main">
        <div className="text-area">
          <h1 className="text-style p-2 fs-1">
            Tính năng họp và gọi video dành cho tất cả mọi người
          </h1>
          <h4 className="h4 p-2 fs-4">
            Kết Nối Mọi Người Lại Với Nhau Bất Kỳ Nơi Đâu, Bất Kỳ Thời Điểm Nào
            Thông Qua <br /> MeetUp
          </h4>
          {!!userName ? (
            <Join></Join>
          ) : (
            <Button className="btn-Login mx-3" onClick={handleLogin}>
              {" "}
              Hãy Đăng Nhập Để Tham Gia Cuộc Họp{" "}
            </Button>
          )}
        </div>
        <div className="main-slider">
          <div
            className={`previous-slide btns ${isBackDisabled ? "disable" : ""}`}
            id="back"
            onClick={handleBackClick}
          >
            <span className="material-icons">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 19.5 8.25 12l7.5-7.5"
                />
              </svg>
            </span>
          </div>
          <div
            className={`next-slide btns ${isNextDisabled ? "disable" : ""}`}
            id="next"
            onClick={handleNextClick}
          >
            <span className="material-icons">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m8.25 4.5 7.5 7.5-7.5 7.5"
                />
              </svg>
            </span>
          </div>
          <div
            className="slide-view"
            id="slide-view"
            style={{ backgroundImage: `url('${slideViewImage}')` }}
          ></div>
          <div className="slide-capions">
            <div id="hed-cap" className="hed-cap">
              {hedCap}
            </div>
            <div id="sub-cap" className="sub-cap">
              {subCap}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
