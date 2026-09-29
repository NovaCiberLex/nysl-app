import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import data from '../data/nysl-data.json';
import { useUserState, usePictures, postPicture, signInWithGoogle } from '../firebase';
import { uploadImage } from '../cloudinary';

const MAX_SIZE = 10 * 1024 * 1024;

const formatDate = (isoDate) => {
  const [year, month, day] = isoDate.split('-');
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const formatPosted = (timestamp) =>
  new Date(timestamp).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZone: 'America/Chicago'
  });

const PhotoBoard = () => {
  const { id } = useParams();
  const [user] = useUserState();
  const [pictures, loading] = usePictures(id, user);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [caption, setCaption] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [inputKey, setInputKey] = useState(0);
  const game = data.games[id];

  useEffect(() => {
    if (!file) {
      setPreview('');
      return;
    }
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  const handleFileChange = (event) => {
    const selected = event.target.files[0];
    if (!selected) return;

    if (selected.type && !selected.type.startsWith('image/')) {
      setError('Choose a picture file, like a JPG or PNG.');
      return;
    }
    if (selected.size > MAX_SIZE) {
      setError('This picture is larger than 10 MB. Choose a smaller one.');
      return;
    }

    setError('');
    setFile(selected);
  };

  const clearForm = () => {
    setFile(null);
    setCaption('');
    setInputKey((key) => key + 1);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!file) return;

    setUploading(true);
    setError('');
    try {
      const url = await uploadImage(file);
      await postPicture(id, user, url, caption.trim());
      clearForm();
    } catch {
      setError("Your picture wasn't posted. Check your connection and try again.");
    } finally {
      setUploading(false);
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
        <h1 className="h4">Photo board</h1>
        <p>Sign in with your Google account to see and post pictures for this game.</p>
        <button className="btn btn-dark" onClick={() => signInWithGoogle().catch(() => {})}>
          Sign in with Google
        </button>
      </div>
    );
  }

  return (
    <div className="container py-3">
      <Link to={`/game/${id}`} className="btn btn-link px-0 mb-2">&larr; Back to game</Link>
      <h1 className="h4 mb-1">Photo board</h1>
      <p className="text-muted mb-3">
        {game.teams[0]} vs {game.teams[1]} - {formatDate(game.date)}, {game.time}
      </p>

      <form onSubmit={handleSubmit} className="card card-body mb-4">
        <label htmlFor="photo-file" className="form-label fw-bold">Take or choose a picture</label>
        <input
          key={inputKey}
          id="photo-file"
          type="file"
          accept="image/*"
          className="form-control mb-2"
          onChange={handleFileChange}
        />

        {preview && (
          <img
            src={preview}
            alt="Preview of the selected picture"
            className="img-fluid rounded mb-2"
            style={{ maxHeight: '200px', objectFit: 'contain' }}
          />
        )}

        <label htmlFor="photo-caption" className="form-label">Caption (optional)</label>
        <input
          id="photo-caption"
          className="form-control mb-2"
          placeholder="Great save, Kevin!"
          value={caption}
          onChange={(event) => setCaption(event.target.value)}
          maxLength={140}
          autoComplete="off"
        />

        <button type="submit" className="btn btn-dark" disabled={!file || uploading}>
          {uploading ? 'Posting...' : 'Post'}
        </button>

        {error && <div className="small text-danger mt-2">{error}</div>}
      </form>

      {loading && <p className="text-muted">Loading pictures...</p>}

      {!loading && pictures.length === 0 && (
        <p className="text-muted">No pictures yet. Be the first to post one.</p>
      )}

      <div className="row row-cols-2 row-cols-md-3 g-2">
        {[...pictures].reverse().map((picture) => (
          <div className="col" key={picture.key}>
            <div className="card h-100">
              <img
                src={picture.url}
                alt={picture.caption || `Picture posted by ${picture.author}`}
                className="card-img-top"
                style={{ aspectRatio: '1 / 1', objectFit: 'cover' }}
                loading="lazy"
              />
              <div className="card-body p-2">
                {picture.caption && <p className="card-text small mb-1">{picture.caption}</p>}
                <p className="card-text small text-muted mb-0">
                  {picture.email === user.email ? 'You' : picture.author}
                  <br />
                  {formatPosted(picture.timestamp)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PhotoBoard;