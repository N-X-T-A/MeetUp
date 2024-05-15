import { Button } from "./common/Button";
import "../../src/css/Button.css"

export const ShareScreenButton: React.FC<{ onClick: () => void }> = ({
    onClick,
}) => {
    return (
        <Button className="Button" onClick={onClick}>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className="Icon"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
            </svg>
        </Button>
    );
};
