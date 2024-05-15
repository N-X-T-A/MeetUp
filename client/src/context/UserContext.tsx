import { ReactNode, createContext, useEffect, useState } from "react";
import { v4 as uuidV4 } from "uuid";
import CreateAvatar from "react-avatar";

interface UserValue {
  userId: string;
  userName: string;
  setUserName: (userName: string) => void;
  Avatar: React.FC;
}

export const UserContext = createContext<UserValue>({
  userId: "",
  userName: "",
  setUserName: (userName) => {},
  Avatar: () => null,
});

export const UserProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [userId] = useState(localStorage.getItem("userId") || uuidV4());
  const [userName, setUserName] = useState(
    localStorage.getItem("userName") || ""
  );

  useEffect(() => {
    localStorage.setItem("userName", userName);
  }, [userName]);

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
    <UserContext.Provider value={{ userId, userName, setUserName, Avatar }}>
      {children}
    </UserContext.Provider>
  );
};
