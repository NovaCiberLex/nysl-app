import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import data from '../data/nysl-data.json';
import { useUserState, useMessages, postMessage, signInWithGoogle } from '../firebase';

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
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const bottomRef = useRef(null);
  const game = data.games[id];

  useEffect(() => {
    if (bottomRef.current) bottomRef.current.scrollIntoView();
  }, [messages.length, user]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const cleanText = text.trim();
    if (!cleanText) return;

    setSending(true);
    setError('');
    try {
      await postMessage(id, user, cleanText);
      setText('');
    } catch {
      setError("Your message wasn't posted. Check your connection and try again.");
    } finally {
      setSending(false);
    }
  };

  if (!game) {
    return (
      <div className="container py-3">
        <h1 className="h4">Game not found</h1>
        <Link to="/games" className="btn btn-dark">Back to schedule</Link>
      </div>
    );
  }

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
    <div className="container py-3" style={{ paddingBottom: '70px' }}>
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

      {/* Message box fixed above the bottom nav bar */}
      <form
        onSubmit={handleSubmit}
        className="position-fixed start-0 end-0 bg-white border-top py-2"
        style={{ bottom: '56px', zIndex: 1020 }}
      >
        <div className="container d-flex gap-2">
          <label htmlFor="new-message" className="visually-hidden">Message</label>
          <input
            id="new-message"
            className="form-control"
            placeholder="Type a message"
            value={text}
            onChange={(event) => setText(event.target.value)}
            maxLength={280}
            autoComplete="off"
            enterKeyHint="send"
          />
          <button type="submit" className="btn btn-dark" disabled={sending || !text.trim()}>
            Post
          </button>
        </div>
        {error && <div className="container small text-danger mt-1">{error}</div>}
      </form>
    </div>
  );
};

export default MessageBoard;