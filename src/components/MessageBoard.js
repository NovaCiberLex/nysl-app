
import { useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import data from '../data/nysl-data.json';
import { useUserState, useMessages, signInWithGoogle } from '../firebase';

// Show only the time, in Chicago time (where the games are played)
const formatTime = (timestamp) =>
  new Date(timestamp).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    timeZone: 'America/Chicago'
  });

const formatDate = (isoDate) => {
  const [year, month, day] = isoDate.split('-');
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const MessageBoard = () => {
  const { id } = useParams();
  const [user] = useUserState();
  const [messages, loading] = useMessages(id, user);
  const bottomRef = useRef(null);
  const game = data.games[id];

  // Open the screen scrolled down to the newest message
  useEffect(() => {
    if (bottomRef.current) bottomRef.current.scrollIntoView();
  }, [messages.length, user]);

  if (!game) {
    return (
      <div className="container py-3">
        <h1 className="h4">Game not found</h1>
        <Link to="/games" className="btn btn-dark">Back to schedule</Link>
      </div>
    );
  }

  // Only signed-in users can read the messages
  if (!user) {
    return (
      <div className="container py-3">
        <Link to={`/game/${id}`} className="btn btn-link px-0 mb-2">&larr; Back to game</Link>
        <h1 className="h4">Message board</h1>
        <p>Sign in with your Google account to read and post messages for this game.</p>
        <button className="btn btn-dark" onClick={() => signInWithGoogle().catch(() => {})}>
          Sign in with Google
        </button>
      </div>
    );
  }

  return (
    <div className="container py-3">
      <Link to={`/game/${id}`} className="btn btn-link px-0 mb-2">&larr; Back to game</Link>
      <h1 className="h4 mb-1">Message board</h1>
      <p className="text-muted mb-3">
        {game.teams[0]} vs {game.teams[1]} - {formatDate(game.date)}, {game.time}
      </p>

      {loading && <p className="text-muted">Loading messages...</p>}

      {!loading && messages.length === 0 && (
        <p className="text-muted">No messages yet. Be the first to post one.</p>
      )}

      {messages.map((message) => {
        const mine = message.email === user.email;
        return (
          <div key={message.key} className={`d-flex mb-2 ${mine ? 'justify-content-end' : ''}`}>
            <div
              className={`rounded-3 px-3 py-2 ${mine ? 'bg-dark text-white' : 'bg-light border'}`}
              style={{ maxWidth: '80%' }}
            >
              <div className="d-flex justify-content-between gap-3 small">
                <strong>{mine ? 'You' : message.author}</strong>
                <span className={mine ? 'text-white-50' : 'text-muted'}>
                  {formatTime(message.timestamp)}
                </span>
              </div>
              <div>{message.text}</div>
            </div>
          </div>
        );
      })}

      <div ref={bottomRef} />
    </div>
  );
};

export default MessageBoard;