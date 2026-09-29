import data from '../data/nysl-data.json';

const formatDate = (isoDate) => {
  const [year, month, day] = isoDate.split('-');
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const Schedule = () => {
  const games = Object.entries(data.games);

  return (
    <div className="container py-3">
      <h1 className="h3 mb-3">Fall Schedule</h1>
      <div className="table-responsive">
        <table className="table table-striped align-middle">
          <thead>
            <tr>
              <th scope="col">Date</th>
              <th scope="col">Teams</th>
              <th scope="col">Location</th>
              <th scope="col">Time</th>
            </tr>
          </thead>
          <tbody>
            {games.map(([id, game]) => (
              <tr key={id}>
                <td className="text-nowrap">{formatDate(game.date)}</td>
                <td className="text-nowrap">{game.teams[0]} vs {game.teams[1]}</td>
                <td>{data.locations[game.location].name}</td>
                <td className="text-nowrap">{game.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Schedule;