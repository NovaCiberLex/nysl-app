import { useNavigate } from 'react-router-dom';
import data from '../data/nysl-data.json';

const formatDate = (isoDate) => {
  const [year, month, day] = isoDate.split('-');
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const Schedule = () => {
  const navigate = useNavigate();
  const games = Object.entries(data.games);

  const openGame = (id) => navigate(`/game/${id}`);

  return (
    <div className="container py-3">
      <h1 className="h3 mb-1">Fall Schedule</h1>
      <p className="text-muted small mb-3">Tap a game to see where it is.</p>
      <div className="table-responsive">
        <table className="table table-striped table-hover align-middle">
          <thead>
            <tr>
              <th scope="col">Date</th>
              <th scope="col">Teams</th>
              <th scope="col">Location</th>
              <th scope="col">Time</th>
              <th scope="col"><span className="visually-hidden">Details</span></th>
            </tr>
          </thead>
          <tbody>
            {games.map(([id, game]) => (
              <tr
                key={id}
                onClick={() => openGame(id)}
                onKeyDown={(e) => { if (e.key === 'Enter') openGame(id); }}
                tabIndex={0}
                role="link"
                style={{ cursor: 'pointer' }}
              >
                <td className="text-nowrap">{formatDate(game.date)}</td>
                <td className="text-nowrap">{game.teams[0]} vs {game.teams[1]}</td>
                <td>{data.locations[game.location].name}</td>
                <td className="text-nowrap">{game.time}</td>
                <td className="text-end text-muted" aria-hidden="true">&rsaquo;</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Schedule;