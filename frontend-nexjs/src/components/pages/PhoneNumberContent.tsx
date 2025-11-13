"use client";

import { useState } from 'react';
import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';
import { Phone, CheckCircle2, AlertCircle, ArrowLeft, User } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { PageRoutes, ApiRoutes } from '@/helpers/string_const';
import { swrFetcher, apiRequest } from '@/helpers/request';

const updatePhoneMutator = async (url: string, { arg }: { arg: { phoneNumber: string; countryCode: string; fullName: string } }) => {
  return apiRequest.post(url, arg, {
    showSuccess: true,
    successMessage: 'Profile updated successfully!',
    successDescription: 'Your information has been saved securely.',
    showError: true,
    errorMessage: 'Update failed',
  });
};

export default function PhoneNumberContent() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState('+1');
  const [validationError, setValidationError] = useState('');

  const { error: fetchError, isLoading } = useSWR(ApiRoutes.USER_PHONE, swrFetcher, {
    revalidateOnFocus: false,
    onSuccess: (data: any) => {
      if (data?.fullName) {
        setFullName(data.fullName);
      }
      if (data?.phone) {
        const match = data.phone.match(/^(\+\d+)(\d+)$/);
        if (match) {
          setCountryCode(match[1]);
          setPhoneNumber(match[2]);
        }
      }
    },
    onError: () => {
      // Error toast will be shown by the component
    }
  });

  const { trigger, isMutating, error: mutationError, data: mutationData } = useSWRMutation(
    ApiRoutes.USER_PHONE,
    updatePhoneMutator,
    {
      onSuccess: () => {
        setValidationError('');
        // Navigate to private page after successful phone number addition
        setTimeout(() => {
          router.push(PageRoutes.PRIVATE);
        }, 1500);
      }
    }
  );

  const validatePhoneNumber = (phone: string): boolean => {
    const cleaned = phone.replace(/\D/g, '');
    return cleaned.length >= 10 && cleaned.length <= 15;
  };

  const formatPhoneNumber = (value: string): string => {
    const cleaned = value.replace(/\D/g, '');
    
    if (cleaned.length <= 3) return cleaned;
    if (cleaned.length <= 6) return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3)}`;
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 10) {
      setPhoneNumber(value);
      setValidationError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const trimmedName = fullName.trim();
    if (!trimmedName || trimmedName.length < 2) {
      setValidationError('Please enter your full name (at least 2 characters)');
      return;
    }

    if (!validatePhoneNumber(phoneNumber)) {
      setValidationError('Please enter a valid phone number');
      return;
    }

    setValidationError('');
    
    try {
      await trigger({ phoneNumber, countryCode, fullName: trimmedName });
    } catch (error) {
      // Error is handled by SWR mutation error state
    }
  };

  // Derive state from SWR states
  const isSuccess = !!mutationData && !mutationError;
  const displayError = validationError || (mutationError ? String(mutationError.message || mutationError) : '');
  const hasError = !!displayError;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FDFCFA] dark:bg-[#1C1917] flex items-center justify-center">
        <div className="flex items-center gap-3">
          <svg className="animate-spin h-8 w-8 text-[#7A5D42] dark:text-[#D4BFA8]" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span className="text-[#5C5248] dark:text-[#CFC7BD]">Loading...</span>
        </div>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="min-h-screen bg-[#FDFCFA] dark:bg-[#1C1917] flex items-center justify-center p-4">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-[#BA3B2E] dark:text-[#F2B8B5] mx-auto mb-4" />
          <h2 className="text-xl font-bold text-[#1F1B17] dark:text-[#EDE5DB] mb-2">Failed to Load</h2>
          <p className="text-[#5C5248] dark:text-[#CFC7BD]">Unable to fetch phone number data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFCFA] dark:bg-[#1C1917] flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden">
      {/* Background grid */}
      <div 
        className="absolute inset-0 bg-[linear-gradient(to_right,#D4CEC4_1px,transparent_1px),linear-gradient(to_bottom,#D4CEC4_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#4A4540_1px,transparent_1px),linear-gradient(to_bottom,#4A4540_1px,transparent_1px)] bg-[size:24px_24px]"
        style={{ opacity: 0.03 }}
      />
      
      <div className="relative w-full max-w-[600px] space-y-6">
        {/* Back Link */}
        <Link
          href={PageRoutes.PUBLIC}
          className="inline-flex items-center gap-2 text-[#7A5D42] dark:text-[#D4BFA8] hover:text-[#2D1F10] dark:hover:text-[#EDE5DB] transition-colors duration-200"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Back to Dashboard</span>
        </Link>

        {/* Main Card */}
        <div className="bg-white/90 dark:bg-[#2B2724]/90 backdrop-blur-xl rounded-3xl p-8 sm:p-10 lg:p-12 border border-[#E8E3DA] dark:border-[#4A4540] shadow-[0_4px_8px_rgba(31,27,23,0.08),0_2px_4px_rgba(31,27,23,0.06)] dark:shadow-[0_4px_8px_rgba(0,0,0,0.3),0_2px_4px_rgba(0,0,0,0.2)]">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-[#7A5D42] dark:bg-[#D4BFA8] rounded-2xl mb-4">
              <Phone className="w-8 h-8 text-white dark:text-[#2D1F10]" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-[#1F1B17] dark:text-[#EDE5DB] mb-3">
              Complete Your Profile
            </h1>
            <p className="text-base sm:text-lg text-[#5C5248] dark:text-[#CFC7BD]">
              We need a few details to keep your account secure
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Full Name Input */}
            <div className="space-y-2">
              <label htmlFor="fullName" className="block text-sm font-semibold text-[#2D1F10] dark:text-[#EDE5DB]">
                Full Name <span className="text-[#BA3B2E] dark:text-[#F2B8B5]">*</span>
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <User className="w-5 h-5 text-[#9C8B7A] dark:text-[#8F8A80]" />
                </div>
                <input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => {
                    setFullName(e.target.value);
                    setValidationError('');
                  }}
                  placeholder="John Doe"
                  className={`w-full pl-12 pr-4 py-3 bg-[#F7F5F2] dark:bg-[#3D3935] border rounded-xl text-[#1F1B17] dark:text-[#EDE5DB] placeholder:text-[#9C8B7A] dark:placeholder:text-[#8F8A80] focus:outline-none focus:ring-2 transition-all duration-200 ${
                    hasError
                      ? 'border-[#BA3B2E] dark:border-[#F2B8B5] focus:ring-[#BA3B2E] dark:focus:ring-[#F2B8B5]'
                      : 'border-[#E8E3DA] dark:border-[#4A4540] focus:ring-[#7A5D42] dark:focus:ring-[#D4BFA8] focus:border-transparent'
                  }`}
                  disabled={isMutating || isSuccess}
                  maxLength={255}
                />
              </div>
            </div>

            {/* Country Code & Phone Input */}
            <div className="space-y-2">
              <label htmlFor="phone" className="block text-sm font-semibold text-[#2D1F10] dark:text-[#EDE5DB]">
                Phone Number <span className="text-[#BA3B2E] dark:text-[#F2B8B5]">*</span>
              </label>
              <div className="flex gap-3">
                <div className="relative">
                  <select
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    className="w-24 px-3 py-3 pr-8 bg-[#F7F5F2] dark:bg-[#3D3935] border border-[#E8E3DA] dark:border-[#4A4540] rounded-xl text-[#1F1B17] dark:text-[#EDE5DB] focus:outline-none focus:ring-2 focus:ring-[#7A5D42] dark:focus:ring-[#D4BFA8] focus:border-transparent transition-all duration-200 appearance-none cursor-pointer"
                  >
                    <option value="+1">+1</option>
                    <option value="+44">+44</option>
                    <option value="+91">+91</option>
                    <option value="+86">+86</option>
                    <option value="+81">+81</option>
                  </select>
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg className="w-4 h-4 text-[#5C5248] dark:text-[#CFC7BD]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                
                <div className="flex-1 relative">
                  <input
                    id="phone"
                    type="tel"
                    value={formatPhoneNumber(phoneNumber)}
                    onChange={handlePhoneChange}
                    placeholder="(555) 123-4567"
                    className={`w-full px-4 py-3 bg-[#F7F5F2] dark:bg-[#3D3935] border rounded-xl text-[#1F1B17] dark:text-[#EDE5DB] placeholder:text-[#9C8B7A] dark:placeholder:text-[#8F8A80] focus:outline-none focus:ring-2 transition-all duration-200 ${
                      hasError
                        ? 'border-[#BA3B2E] dark:border-[#F2B8B5] focus:ring-[#BA3B2E] dark:focus:ring-[#F2B8B5]'
                        : 'border-[#E8E3DA] dark:border-[#4A4540] focus:ring-[#7A5D42] dark:focus:ring-[#D4BFA8] focus:border-transparent'
                    }`}
                    disabled={isMutating || isSuccess}
                  />
                  {isSuccess && (
                    <CheckCircle2 className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B7F5C] dark:text-[#B4CCA5]" />
                  )}
                  {hasError && (
                    <AlertCircle className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#BA3B2E] dark:text-[#F2B8B5]" />
                  )}
                </div>
              </div>
              {displayError && (
                <p className="text-sm text-[#BA3B2E] dark:text-[#F2B8B5] flex items-center gap-1 mt-2">
                  <AlertCircle className="w-4 h-4" />
                  {displayError}
                </p>
              )}
            </div>

            {/* Info Box */}
            <div className="p-4 bg-[#F5EFE7] dark:bg-[#5C4A38] rounded-xl border border-[#D4CEC4] dark:border-[#8F8A80]">
              <p className="text-sm text-[#5C5248] dark:text-[#CFC7BD]">
                <span className="font-semibold text-[#2D1F10] dark:text-[#EDE5DB]">Privacy note:</span> Your phone number will be encrypted and used only for account security purposes. We'll never share it with third parties.
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isMutating || isSuccess || !phoneNumber || !fullName.trim()}
              className={`w-full py-4 px-6 rounded-xl font-semibold text-base transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#FDFCFA] dark:focus:ring-offset-[#1C1917] ${
                isSuccess
                  ? 'bg-[#6B7F5C] dark:bg-[#B4CCA5] text-white dark:text-[#1F2B18] cursor-not-allowed'
                  : isMutating || !phoneNumber || !fullName.trim()
                  ? 'bg-[#E8E3DA] dark:bg-[#4A4540] text-[#9C8B7A] dark:text-[#8F8A80] cursor-not-allowed'
                  : 'bg-[#7A5D42] dark:bg-[#D4BFA8] text-white dark:text-[#2D1F10] hover:bg-[#5C4A38] dark:hover:bg-[#C9B299] hover:shadow-lg hover:-translate-y-0.5 focus:ring-[#7A5D42] dark:focus:ring-[#D4BFA8]'
              }`}
            >
              {isMutating ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Saving...
                </span>
              ) : isSuccess ? (
                <span className="flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-5 h-5" />
                  Profile Completed!
                </span>
              ) : (
                'Continue'
              )}
            </button>
          </form>

          {/* Footer Note */}
          <p className="text-xs text-center text-[#9C8B7A] dark:text-[#8F8A80] mt-6">
            By continuing, you agree to receive SMS notifications for security alerts
          </p>
        </div>
      </div>
    </div>
  );
}
