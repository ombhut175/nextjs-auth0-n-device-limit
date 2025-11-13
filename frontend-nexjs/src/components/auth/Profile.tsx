import { User, Mail, CheckCircle2, Phone } from "lucide-react";

interface ProfileProps {
  user: {
    picture?: string;
    name?: string;
    email?: string;
    fullName?: string;
    phone?: string;
  };
}

export default function Profile({ user }: ProfileProps) {
  if (!user) {
    return null;
  }

  return (
    <div className="relative bg-white/90 dark:bg-[#2B2724]/90 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-[#E8E3DA] dark:border-[#4A4540] hover:border-[#D4CEC4] dark:hover:border-[#8F8A80] transition-all duration-200 hover:shadow-[rgba(43,37,32,0.15)] dark:hover:shadow-[rgba(0,0,0,0.4)] group">
      <div className="absolute inset-0 bg-gradient-to-br from-[#F5EFE7]/20 to-[#F7F3EE]/20 dark:from-[#5C4A38]/10 dark:to-[#3D3935]/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
      
      <div className="relative flex flex-col items-center space-y-6">
        <div className="relative">
          {user.picture ? (
            <div className="relative">
              <div className="absolute inset-0 bg-[#8B7355] dark:bg-[#C9B299] rounded-full blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-200" />
              <img
                src={user.picture}
                alt={user.name || 'User profile'}
                className="relative w-32 h-32 rounded-full object-cover ring-4 ring-[#E8E3DA] dark:ring-[#4A4540] shadow-xl transition-all duration-200 group-hover:scale-110 group-hover:ring-[#8B7355] dark:group-hover:ring-[#C9B299]"
              />
              <div className="absolute bottom-1 right-1 bg-[#6B7F5C] dark:bg-[#B4CCA5] w-6 h-6 rounded-full ring-4 ring-white dark:ring-[#1C1917] flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4 text-white dark:text-[#1F2B18]" />
              </div>
            </div>
          ) : (
            <div className="w-32 h-32 rounded-full bg-[#8B7355] dark:bg-[#C9B299] flex items-center justify-center ring-4 ring-[#E8E3DA] dark:ring-[#4A4540] shadow-xl transition-all duration-200 group-hover:scale-110">
              <User className="w-16 h-16 text-white dark:text-[#3D2F1F]" />
            </div>
          )}
        </div>

        <div className="text-center space-y-4 w-full">
          <div className="flex items-center justify-center gap-2">
            <h2 className="text-3xl font-bold text-[#2B2520] dark:text-[#E8E3DA]">
              {user.fullName || user.name || 'User'}
            </h2>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-center gap-2 text-[#5C5248] dark:text-[#C9C3B8] hover:text-[#8B7355] dark:hover:text-[#C9B299] transition-colors duration-200">
              <Mail className="w-4 h-4" />
              <p className="text-base">{user.email}</p>
            </div>
            
            {user.phone && (
              <div className="flex items-center justify-center gap-2 text-[#5C5248] dark:text-[#C9C3B8] hover:text-[#8B7355] dark:hover:text-[#C9B299] transition-colors duration-200">
                <Phone className="w-4 h-4" />
                <p className="text-base">{user.phone}</p>
              </div>
            )}
          </div>

          <div className="flex items-center justify-center gap-2 pt-2">
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#F5EFE7] dark:bg-[#5C4A38] text-[#3D2F1F] dark:text-[#E8DFD3] text-sm font-medium rounded-full border border-[#D4CEC4] dark:border-[#8F8A80]">
              <CheckCircle2 className="w-3 h-3" />
              Verified
            </span>
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#EDF2E9] dark:bg-[#3F5233] text-[#1F2B18] dark:text-[#D0E5C0] text-sm font-medium rounded-full border border-[#6B7F5C] dark:border-[#B4CCA5]">
              Active
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
