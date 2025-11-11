import { User, Mail, CheckCircle2 } from "lucide-react";

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
    <div className="relative bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-slate-700/50 hover:border-slate-600/50 transition-all duration-500 hover:shadow-blue-500/20 group">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="relative flex flex-col items-center space-y-6">
        <div className="relative">
          {user.picture ? (
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-500" />
              <img
                src={user.picture}
                alt={user.name || 'User profile'}
                className="relative w-32 h-32 rounded-full object-cover ring-4 ring-slate-700/50 shadow-xl transition-all duration-500 group-hover:scale-110 group-hover:ring-blue-500/50"
              />
              <div className="absolute bottom-1 right-1 bg-green-500 w-6 h-6 rounded-full ring-4 ring-slate-800 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4 text-white" />
              </div>
            </div>
          ) : (
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center ring-4 ring-slate-700/50 shadow-xl transition-all duration-500 group-hover:scale-110">
              <User className="w-16 h-16 text-white" />
            </div>
          )}
        </div>

        <div className="text-center space-y-3 w-full">
          <div className="flex items-center justify-center gap-2">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              {user.name || 'User'}
            </h2>
          </div>
          
          <div className="flex items-center justify-center gap-2 text-slate-400 hover:text-slate-300 transition-colors duration-300">
            <Mail className="w-4 h-4" />
            <p className="text-base">{user.email}</p>
          </div>

          <div className="flex items-center justify-center gap-2 pt-2">
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-500/10 text-blue-400 text-sm font-medium rounded-full border border-blue-500/20">
              <CheckCircle2 className="w-3 h-3" />
              Verified
            </span>
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-500/10 text-purple-400 text-sm font-medium rounded-full border border-purple-500/20">
              Active
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
