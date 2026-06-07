import ChatMessage from "../components/Chatmessage";
export default function NurseMessage({ onNavigate, currentUser }) {
  return <ChatMessage role="nurse" onNavigate={onNavigate} currentUser={currentUser} />;
}