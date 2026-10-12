import React, { useState, useEffect } from 'react';
import { Shield, KeyRound, Mail, Lock, CheckCircle2, AlertCircle, X, ShieldAlert } from 'lucide-react';

interface FounderAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (token: string, user: { email: string; role: string }) => void;
}

export const FounderAuthModal: React.FC<FounderAuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [mode, setMode] = useState<'login' | 'force-change-password' | 'reset-request' | 'reset-confirm'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [tempToken, setTempToken] = useState<string | null>(null);
  const [tempUser, setTempUser] = useState<{ email: string; role: string } | null>(null);

  // Forced password change fields
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Password recovery fields
  const [resetCode, setResetCode] = useState('');
  const [recoveryEmail, setRecoveryEmail] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Reset state when modal is opened
  useEffect(() => {
    if (isOpen) {
      setMode('login');
      setEmail('');
      setPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setResetCode('');
      setRecoveryEmail('');
      setErrorMsg('');
      setSuccessMsg('');
      setTempToken(null);
      setTempUser(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // 1. Handle Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      });
      const data = await res.json();

      if (!res.ok) {
        // Uniform error message without revealing whether email or password is incorrect
        setErrorMsg(data.error || 'Invalid email or password.');
        return;
      }

      // Check if security policy requires changing the initial password
      if (data.mustChangePassword) {
        setTempToken(data.token);
        setTempUser(data.user);
        setMode('force-change-password');
        setSuccessMsg('Initial login verified. Security policy requires changing the initial password.');
        return;
      }

      // Standard authenticated entry
      setSuccessMsg('Authentication verified. Launching Founder Dashboard...');
      localStorage.setItem('founder_token', data.token);
      setTimeout(() => {
        onSuccess(data.token, data.user);
      }, 500);
    } catch {
      setErrorMsg('Network error connecting to authorization server.');
    } finally {
      setIsLoading(false);
    }
  };

  // 2. Handle Mandatory Initial Password Change
  const handleForceChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      setErrorMsg('New password must be at least 8 characters in length.');
      return;
    }
    if (newPassword === 'Vamsi@2009') {
      setErrorMsg('You must choose a new password different from the initial default password.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');
    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${tempToken}`,
        },
        body: JSON.stringify({ newPassword, confirmPassword }),
      });
      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error || 'Failed to update password.');
        return;
      }

      setSuccessMsg('Master password secured. Launching Founder Dashboard...');
      if (tempToken && tempUser) {
        localStorage.setItem('founder_token', tempToken);
        setTimeout(() => {
          onSuccess(tempToken, tempUser);
        }, 600);
      }
    } catch {
      setErrorMsg('Network error updating master password.');
    } finally {
      setIsLoading(false);
    }
  };

  // 3. Handle Password Reset Request
  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');
    try {
      const res = await fetch('/api/auth/request-reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: recoveryEmail.trim() }),
      });
      const data = await res.json();
      setSuccessMsg(data.message || 'If registered, a verification token has been issued.');
      if (data.verificationCode) {
        setResetCode(data.verificationCode);
      }
      setMode('reset-confirm');
    } catch {
      setErrorMsg('Error submitting reset request.');
    } finally {
      setIsLoading(false);
    }
  };

  // 4. Handle Password Reset Confirmation
  const handleConfirmReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      setErrorMsg('New password must be at least 8 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resetCode: resetCode.trim(), newPassword, confirmPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || 'Failed to reset password.');
        return;
      }
      setSuccessMsg('Password updated successfully. You may now sign in with your new credentials.');
      setMode('login');
      setPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch {
      setErrorMsg('Error confirming reset.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#080B18]/85 backdrop-blur-xl">
      <div className="relative w-full max-w-md cosmic-surface border border-[#7767D8]/40 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-[#A9B1C7] hover:text-white rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
          title="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 rounded-2xl bg-[#101C3C] border border-[#B8D8FF]/30 text-[#B8D8FF] shadow-[0_0_20px_rgba(119,103,216,0.3)]">
            <Shield className="w-6 h-6 text-[#7767D8]" />
          </div>
          <h2 className="font-heading text-2xl font-bold text-[#F4F5FA] tracking-tight">
            Founder Access Portal
          </h2>
          <p className="text-xs font-mono text-[#A9B1C7]">
            Sanapathi Vamsi Mohan · Protected Management Station
          </p>
        </div>

        {/* Feedback Messages */}
        {errorMsg && (
          <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/40 text-xs text-red-200 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-xs text-emerald-200 flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* ====================================================
            MODE 1: LOGIN (Discreet, secure credentials entry)
           ==================================================== */}
        {mode === 'login' && (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-[#A9B1C7] uppercase mb-1">
                Founder Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-4 h-4 text-[#A9B1C7]" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter authorized founder email"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-[#080B18]/70 border border-white/10 text-sm text-[#F4F5FA] placeholder-white/20 focus:outline-none focus:border-[#7767D8]"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-mono text-[#A9B1C7] uppercase">Master Password</label>
                <button
                  type="button"
                  onClick={() => {
                    setMode('reset-request');
                    setErrorMsg('');
                    setSuccessMsg('');
                  }}
                  className="text-[11px] font-mono text-[#B8D8FF] hover:underline cursor-pointer"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-4 h-4 text-[#A9B1C7]" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter master password"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-[#080B18]/70 border border-white/10 text-sm text-[#F4F5FA] placeholder-white/20 focus:outline-none focus:border-[#7767D8]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-[#7767D8] text-white hover:bg-[#6857cc] transition-all font-mono text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <KeyRound className="w-4 h-4" />
              <span>{isLoading ? 'Verifying...' : 'Authorize Session'}</span>
            </button>
          </form>
        )}

        {/* ====================================================
            MODE 2: MANDATORY INITIAL PASSWORD CHANGE
            (Required immediately after first successful login)
           ==================================================== */}
        {mode === 'force-change-password' && (
          <form onSubmit={handleForceChangePassword} className="space-y-4">
            <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-500/40 text-xs text-amber-200 flex items-start gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>
                <strong>Mandatory Security Policy:</strong> Initial login detected. You must change your master
                password before accessing the dashboard.
              </span>
            </div>

            <div>
              <label className="block text-xs font-mono text-[#A9B1C7] uppercase mb-1">
                New Master Password (min 8 chars) *
              </label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Choose strong private password"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#080B18]/70 border border-white/10 text-sm text-[#F4F5FA] placeholder-white/20 focus:outline-none focus:border-[#7767D8]"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-[#A9B1C7] uppercase mb-1">
                Confirm New Master Password *
              </label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter new password"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#080B18]/70 border border-white/10 text-sm text-[#F4F5FA] placeholder-white/20 focus:outline-none focus:border-[#7767D8]"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-[#7767D8] text-white hover:bg-[#6857cc] transition-all font-mono text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <span>{isLoading ? 'Securing...' : 'Set New Password & Enter Dashboard'}</span>
            </button>
          </form>
        )}

        {/* ====================================================
            MODE 3: REQUEST PASSWORD RESET
           ==================================================== */}
        {mode === 'reset-request' && (
          <form onSubmit={handleRequestReset} className="space-y-4">
            <p className="text-xs text-[#A9B1C7]">
              Enter the authorized founder email address to generate an authenticated recovery token.
            </p>

            <div>
              <label className="block text-xs font-mono text-[#A9B1C7] uppercase mb-1">
                Founder Recovery Email
              </label>
              <input
                type="email"
                required
                value={recoveryEmail}
                onChange={(e) => setRecoveryEmail(e.target.value)}
                placeholder="Enter founder email"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#080B18]/70 border border-white/10 text-sm text-[#F4F5FA] placeholder-white/20 focus:outline-none focus:border-[#7767D8]"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-[#7767D8] text-white hover:bg-[#6857cc] transition-all font-mono text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <span>{isLoading ? 'Dispatching...' : 'Request Verification Token'}</span>
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setErrorMsg('');
                  setSuccessMsg('');
                }}
                className="text-xs font-mono text-[#A9B1C7] hover:text-white cursor-pointer"
              >
                Back to Sign In
              </button>
            </div>
          </form>
        )}

        {/* ====================================================
            MODE 4: CONFIRM RESET
           ==================================================== */}
        {mode === 'reset-confirm' && (
          <form onSubmit={handleConfirmReset} className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-[#A9B1C7] uppercase mb-1">
                Verification Token / Code
              </label>
              <input
                type="text"
                required
                value={resetCode}
                onChange={(e) => setResetCode(e.target.value.toUpperCase())}
                placeholder="e.g. A9B2X1"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#080B18]/70 border border-white/10 text-sm font-mono text-[#B8D8FF] tracking-wider focus:outline-none focus:border-[#7767D8]"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-[#A9B1C7] uppercase mb-1">
                New Master Password (min 8 chars)
              </label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="At least 8 characters"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#080B18]/70 border border-white/10 text-sm text-[#F4F5FA] placeholder-white/20 focus:outline-none focus:border-[#7767D8]"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-[#A9B1C7] uppercase mb-1">
                Confirm New Password
              </label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat new password"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#080B18]/70 border border-white/10 text-sm text-[#F4F5FA] placeholder-white/20 focus:outline-none focus:border-[#7767D8]"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-[#7767D8] text-white hover:bg-[#6857cc] transition-all font-mono text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <span>{isLoading ? 'Updating...' : 'Update Password & Return to Login'}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
