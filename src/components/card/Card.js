import React from 'react';
import "./card.css"
const Card = ({ id, title, tag, userId, users }) => {
  const user = users.find(user => user.id === userId);

  return (
    <div className="ticket-card">
      <div className="ticket-card-header">
      <div className="ticket-id">{id}</div>
        <div className="user-status">
          {user && user.available ? <div className="green-dot"></div> : null}
        </div>
     
      </div>
      <div className="ticket-title">{title}</div>
      <div className="ticket-tag">{tag}</div>
    </div>
  );
};

export default Card;
