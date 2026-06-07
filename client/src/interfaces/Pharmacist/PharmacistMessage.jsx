import ChatMessage from "../components/Chatmessage";
export default function PharmacistMessage({ onNavigate, currentUser }) {
  return <ChatMessage role="pharmacist" onNavigate={onNavigate} currentUser={currentUser} />;
}