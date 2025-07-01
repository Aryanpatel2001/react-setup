export default function Message({ type, message }) {
    if (!message) return null
  
    return (
      <div className={`message ${type === "success" ? "success-message" : "error-message"}`}>
        <span>{type === "success" ? "✅" : "❌"}</span> {message}
      </div>
    )
  }
  