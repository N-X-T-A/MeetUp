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
  Avatar: React.FC;
  userLogin: string;
  setUserLogin: (userName: string) => void;
  meetings: Meeting[];
  setMeetings: (meetings: Meeting[]) => void;
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
  useEffect(() => {
    localStorage.setItem("userName", userName);
  }, [userName]);

  useEffect(() => {
    localStorage.setItem("userLogin", userLogin);
  }, [userLogin]);

  useEffect(() => {
    localStorage.setItem("userId", userId);
  }, [userId]);

  const Avatar: React.FC = () => {
    const initial = userName.charAt(0).toUpperCase();
    return (
      <CreateAvatar
        className=""
        name={initial}
        size="200"
        round={true}
        style={{ fontSize: "30px" }}
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
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
