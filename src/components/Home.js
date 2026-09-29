import logo from '../assets/nysl_logo.png';

const announcements = [
  { date: "August 4", description: "NYSL Fundraiser" },
  { date: "August 16", description: "Season Kick-off: Meet the Teams" },
  { date: "September 1", description: "First Game of the Season (Check Game Schedule for details)" }
];

const Home = () => (
  <div className="container py-3">
    <header className="text-center mb-4">
      <img
        src={logo}
        alt="Northside Youth Soccer League logo"
        className="img-fluid mb-2"
        style={{ maxWidth: "120px" }}
      />
      <h1 className="h3">Northside Youth Soccer League</h1>
    </header>

    <section className="mb-4">
      <h2 className="h5">Upcoming Events</h2>
      <table className="table table-striped">
        <thead>
          <tr>
            <th scope="col">Date</th>
            <th scope="col">Event</th>
          </tr>
        </thead>
        <tbody>
          {announcements.map(announcement => (
            <tr key={announcement.date}>
              <td className="text-nowrap">{announcement.date}</td>
              <td>{announcement.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>

    <section className="card">
      <div className="card-body">
        <h2 className="h5 card-title">Contact Us</h2>
        <p className="card-text">
          Please email us at <a href="mailto:nysl@chisoccer.org">nysl@chisoccer.org</a>.
          We will reply as soon as we can.
        </p>
        <p className="card-text mb-0">
          <strong>League Coordinator:</strong> Michael Randall<br />
          Phone: <a href="tel:6306908132">(630) 690-8132</a><br />
          Email: <a href="mailto:michael.randall@chisoccer.org">michael.randall@chisoccer.org</a>
        </p>
      </div>
    </section>
  </div>
);

export default Home;