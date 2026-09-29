import { useParams, Link } from 'react-router-dom';
import data from '../data/nysl-data.json';
import { useUserState, signInWithGoogle } from '../firebase';

const formatDate = (isoDate) => {
  const [year, month, day] = isoDate.split('-');
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  });
};

const GameDetail = () => {
  // Read the :id part of the URL, e.g. /game/2026_09_01_1 -> "2026_09_01_1"
  const { id } = useParams();
  const [user] = useUserState();
  const game = data.games[id];

  // If someone opens a URL for a game that doesn't exist
  if (!game) {
    return (
      <div className="container py-3">
        <h1 className="h4">Game not found</h1>
        <p>This game isn't on the schedule. Go back and pick another one.</p>
        <Link to="/games" className="btn btn-dark">Back to schedule</Link>
      </div>
    );
  }

  const location = data.locations[game.location];
  const directionsUrl =
    'https://www.google.com/maps/search/?api=1&query=' +
    encodeURIComponent(location.address);

  return (
    <div className="container py-3">
      <Link to="/games" className="btn btn-link px-0 mb-2">
        &larr; Back to schedule
      </Link>

      <h1 className="h3 mb-1">{game.teams[0]} vs {game.teams[1]}</h1>
      <p className="text-muted mb-3">
        {formatDate(game.date)} at {game.time}
      </p>

      <h2 className="h5 mb-1">{location.name}</h2>
      <p className="mb-3">{location.address}</p>

      <iframe
        src={location.mapUrl}
        title={`Map of ${location.name}`}
        width="100%"
        height="300"
        style={{ border: 0 }}
        loading="lazy"
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
        className="mb-3 rounded"
      />

      <a
        href={directionsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="btn btn-dark w-100 mb-2"
      >
        Get directions
      </a>

      {user ? (
        <Link to={`/game/${id}/messages`} className="btn btn-outline-dark w-100 fw-bold">
          Message board
        </Link>
      ) : (
        <button
          className="btn btn-outline-dark w-100"
          onClick={() => signInWithGoogle().catch(() => {})}
        >
          Sign in to read and post messages
        </button>
      )}
    </div>
  );
};

export default GameDetail;
