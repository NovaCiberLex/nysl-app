import { signInWithGoogle, signOut, useUserState } from '../firebase';

const TopBar = () => {
  const [user] = useUserState();

  const handleSignIn = () => signInWithGoogle().catch(() => {});

  return (
    <header className="navbar bg-white border-bottom sticky-top">
      <div className="container-fluid">
        <span className="navbar-brand fw-bold">NYSL</span>

        {user ? (
          <div className="d-flex align-items-center gap-2">
            <span
              className="rounded-circle bg-dark text-white d-inline-flex align-items-center justify-content-center fw-bold"
              style={{ width: '32px', height: '32px' }}
              title={user.displayName}
            >
              {user.displayName ? user.displayName[0] : '?'}
            </span>
            <button className="btn btn-outline-dark btn-sm" onClick={signOut}>
              Sign out
            </button>
          </div>
        ) : (
          <button className="btn btn-outline-dark btn-sm" onClick={handleSignIn}>
            Sign in with Google
          </button>
        )}
      </div>
    </header>
  );
};

export default TopBar;