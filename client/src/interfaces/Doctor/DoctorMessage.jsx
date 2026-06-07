import ChatMessage from "../components/Chatmessage";
export default function DoctorMessage({ onNavigate, currentUser }) {
  return <ChatMessage role="doctor" onNavigate={onNavigate} currentUser={currentUser} />;
}