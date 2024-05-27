import { ReactNode, createContext, useEffect, useState } from "react";
import { v4 as uuidV4 } from "uuid";
import CreateAvatar from "react-avatar";

interface Meeting {
  meeting_id: string;
  room_id: string;
  start_time: string;
  end_time: string;
  participant_list: string;
}

interface UserValue {
  userId: string;
  userName: string;
  setUserName: (userName: string) => void;
  Avatar: React.FC<AvatarProps>;
  userLogin: string;
  setUserLogin: (userName: string) => void;
  meetings: Meeting[];
  setMeetings: (meetings: Meeting[]) => void;
  isCameraOn: boolean;
  isMicOn: boolean;
  setIsCameraOn: (isCameraOn: boolean) => void;
  setIsMicOn: (isCameraOn: boolean) => void;
  role: boolean;
  setRole: (role: boolean) => void;
}

interface AvatarProps {
  name: string;
  size?: string;
  fontSize?: string;
}

export const UserContext = createContext<UserValue>({
  userId: "",
  userName: "",
  setUserName: () => {},
  Avatar: () => null,
  userLogin: "",
  setUserLogin: () => {},
  meetings: [],
  setMeetings: () => {},
  isCameraOn: true,
  setIsCameraOn: () => {},
  isMicOn: true,
  setIsMicOn: () => {},
  role: false,
  setRole: () => {},
});

export const UserProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [userId] = useState(localStorage.getItem("userId") || uuidV4());
  const [userName, setUserName] = useState(
    localStorage.getItem("userName") || ""
  );
  const [userLogin, setUserLogin] = useState(
    localStorage.getItem("userLogin") || ""
  );
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [role, setRole] = useState(false);

  useEffect(() => {
    localStorage.setItem("userName", userName);
  }, [userName]);

  useEffect(() => {
    localStorage.setItem("userLogin", userLogin);
  }, [userLogin]);

  useEffect(() => {
    localStorage.setItem("userId", userId);
  }, [userId]);

  const Avatar: React.FC<AvatarProps> = ({ name, size, fontSize }) => {
    const initial = name.charAt(0).toUpperCase();
    return (
      <CreateAvatar
        className=""
        name={initial}
        size={size}
        round={true}
        style={{ fontSize }}
      />
    );
  };

  return (
    <UserContext.Provider
      value={{
        userId,
        userName,
        setUserName,
        Avatar,
        userLogin,
        setUserLogin,
        meetings,
        setMeetings,
        isCameraOn,
        isMicOn,
        setIsCameraOn,
        setIsMicOn,
        role,
        setRole,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
