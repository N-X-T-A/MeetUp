import { Button } from "./common/Button";
import "../../src/css/Button.css"

export const HistoryButton: React.FC<{ onClick: () => void }> = ({ onClick }) => {
    return (
        <Button className="" onClick={onClick} testId="chat-button">
            <svg xmlns="http://www.w3.org/2000/svg" 
                fill="none" viewBox="0 0 24 24" strokeWidth={1.5} 
                stroke="currentColor" 
                className="Icon">
            <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>

        </Button>
    );
};
