function Popup({ title, message, children }) {
  return (
    <div className="popup-overlay">
      <div className="popup" role="dialog" aria-modal="true">
        <h3>{title}</h3>
        <p>{message}</p>
        <div className="popup-actions">{children}</div>
      </div>
    </div>
  );
}

export default Popup;
