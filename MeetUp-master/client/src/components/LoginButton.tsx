import { Button } from "./common/Button";
import { useNavigate } from "react-router-dom";

export const LoginButton = () =>
{
    const navigate = useNavigate();

    const handLogin = () => {
        navigate("/Login");
      };
  
    return(
        <Button className="btn-Login mx-3" onClick={handLogin}> Hãy Đăng Nhập Để Tham Gia Cuộc Họp </Button>
        
    )
}