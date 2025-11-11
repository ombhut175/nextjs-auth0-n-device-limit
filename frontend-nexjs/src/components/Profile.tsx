interface ProfileProps {
  user: {
    picture?: string;
    name?: string;
    email?: string;
  };
}

export default function Profile({ user }: ProfileProps) {
  if (!user) {
    return null;
  }

  return (
    <div className="profile-card action-card">
      {user.picture && (
        <img
          src={user.picture}
          alt={user.name || 'User profile'}
          className="profile-picture"
        />
      )}
      <h2 className="profile-name">{user.name}</h2>
      <p className="profile-email">{user.email}</p>
    </div>
  );
}
