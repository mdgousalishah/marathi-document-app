'use client';

import React, { useState } from 'react';
import { ShieldCheck, Lock, Mail, Building2, Key, AlertCircle, CheckCircle2, UserPlus, Info } from 'lucide-react';
import { loginSocietyUser, registerSocietyUser, SocietyUser } from '@/utils/storage';
import { isFirebaseConfigured } from '@/lib/firebase';

interface PrivateLoginScreenProps {
  onLoginSuccess: (user: SocietyUser) => void;
  onToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export default function PrivateLoginScreen({
  onLoginSuccess,
  onToast,
}: PrivateLoginScreenProps) {
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [email, setEmail] = useState('kamelshah2003@gmail.com');
  const [password, setPassword] = useState('');
  const [adminName, setAdminName] = useState('मोहम्मद मुश्ताख अहमद (सचिव)');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      if (isRegisterMode) {
        if (password.length < 6) {
          setErrorMessage('पासवर्ड किमान ६ अक्षरांचा असणे आवश्यक आहे.');
          setIsLoading(false);
          return;
        }
        const res = await registerSocietyUser(email, password, adminName);
        if (res.success && res.user) {
          onToast('नवीन प्रशासक खाते तयार झाले! आपले स्वागत आहे.', 'success');
          onLoginSuccess(res.user);
        } else {
          setErrorMessage(res.error || 'खाते तयार करता आले नाही.');
        }
      } else {
        const res = await loginSocietyUser(email, password);
        if (res.success && res.user) {
          onToast('प्रवेश यशस्वी! कामेल एज्युकेशन सोसायटी प्रणालीमध्ये आपले स्वागत आहे.', 'success');
          onLoginSuccess(res.user);
        } else {
          setErrorMessage(res.error || 'अवैध वापरकर्ता आयडी किंवा पासवर्ड.');
        }
      }
    } catch {
      setErrorMessage('प्रवेश करताना अनपेक्षित त्रुटी आली. कृपया पुन्हा प्रयत्न करा.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-center items-center px-4 py-12 font-devanagari-sans relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-emerald-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-md w-full relative z-10 space-y-6">
        {/* Branding Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 mb-1 shadow-inner">
            <Building2 className="w-8 h-8 text-indigo-400" />
          </div>

          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>अधिकृत संस्था पोर्टल • खाजगी प्रणाली</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              कामेल एज्युकेशन सोसायटी
            </h1>
            <p className="text-xs text-indigo-300 font-medium mt-1">
              Kamel Education Society, Parbhani — अधिकृत दस्तऐवज प्रणाली
            </p>
          </div>
        </div>

        {/* Configuration notice if pending credentials */}
        {!isFirebaseConfigured && (
          <div className="p-3.5 bg-amber-950/60 border border-amber-800/60 rounded-2xl text-amber-200 text-xs flex items-start gap-2.5">
            <Info className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
            <div className="space-y-1">
              <p className="font-bold">फायरबेस कॉन्फिगरेशन तयार आहे</p>
              <p className="text-amber-300/80 text-[11px] leading-relaxed">
                नवीन फायरबेस प्रोजेक्टचे क्रेडेन्शियल्स (.env.local किंवा firebase-applet-config.json) मध्ये टाकताच क्लाउड डेटाबेस आणि स्टोरेज सक्रिय होईल. सध्या लोकल/ऑफलाईन मोड सुरू आहे.
              </p>
            </div>
          </div>
        )}

        {/* Login Card */}
        <div className="bg-slate-800/80 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-slate-700 shadow-2xl space-y-5">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Lock className="w-4 h-4 text-indigo-400" />
                <span>{isRegisterMode ? 'नवीन प्रशासक नोंदणी' : 'प्रशासकीय प्रवेश (Login)'}</span>
              </h2>
              <p className="text-xs text-slate-400">
                {isRegisterMode
                  ? 'नवीन प्रशासकीय खात्यासाठी माहिती भरा.'
                  : 'संस्थेच्या कागदपत्रांमध्ये प्रवेश करण्यासाठी ईमेल व पासवर्ड टाका.'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setIsRegisterMode(!isRegisterMode);
                setErrorMessage(null);
              }}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold underline underline-offset-4"
            >
              {isRegisterMode ? 'लॉगिन करा' : 'नवीन नोंदणी'}
            </button>
          </div>

          {errorMessage && (
            <div className="p-3 bg-red-950/50 border border-red-800/60 rounded-xl text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegisterMode && (
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  अधिकारी / कर्मचाऱ्याचे नाव:
                </label>
                <input
                  type="text"
                  value={adminName}
                  onChange={(e) => setAdminName(e.target.value)}
                  required
                  placeholder="उदा. मोहम्मद मुश्ताख अहमद"
                  className="w-full px-3.5 py-2.5 bg-slate-900/90 border border-slate-700 rounded-xl text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                ईमेल पत्ता:
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="kamelshah2003@gmail.com"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-900/90 border border-slate-700 rounded-xl text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                पासवर्ड:
              </label>
              <div className="relative">
                <Key className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-900/90 border border-slate-700 rounded-xl text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 active:scale-98 text-white font-bold rounded-xl text-sm shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-2 cursor-pointer"
            >
              {isRegisterMode ? (
                <>
                  <UserPlus className="w-4 h-4 stroke-[2.5]" />
                  <span>{isLoading ? 'नोंदणी सुरू आहे...' : 'खाते तयार करून प्रवेश करा'}</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                  <span>{isLoading ? 'पडताळणी सुरू आहे...' : 'प्रणालीमध्ये प्रवेश करा'}</span>
                </>
              )}
            </button>
          </form>

          {/* Quick society login helper */}
          {!isRegisterMode && (
            <div className="pt-2 border-t border-slate-700/60 text-[11px] text-slate-400 space-y-1.5">
              <p className="font-semibold text-slate-300">अधिकृत सचिव क्रेडेन्शियल्स मदत:</p>
              <div className="flex items-center justify-between bg-slate-900/60 p-2 rounded-lg border border-slate-700/50">
                <span className="font-mono text-indigo-300 text-[11px]">kamelshah2003@gmail.com</span>
                <button
                  type="button"
                  onClick={() => {
                    setEmail('kamelshah2003@gmail.com');
                  }}
                  className="text-xs text-indigo-400 hover:text-indigo-300 font-bold"
                >
                  निवडा
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer info note */}
        <p className="text-center text-slate-500 text-[11px] leading-relaxed max-w-xs mx-auto">
          ⚠️ ही एक सुरक्षित खाजगी प्रणाली आहे. केवळ अधिकृत प्रशासक व लिपिकांसाठी.
        </p>
      </div>
    </div>
  );
}
