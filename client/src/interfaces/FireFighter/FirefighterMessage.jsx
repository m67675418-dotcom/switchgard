import ChatMessage from "../components/Chatmessage";
export default function FirefighterMessage({ onNavigate, currentUser }) {
  return <ChatMessage role="firefighter" onNavigate={onNavigate} currentUser={currentUser} />;
}