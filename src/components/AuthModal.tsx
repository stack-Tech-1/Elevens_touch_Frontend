'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import { useAuth } from '@/context/AuthContext';
import { loginUser, registerUser } from '@/lib/api';

const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginForm = z.infer<typeof loginSchema>;
type RegisterForm = z.infer<typeof registerSchema>;

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function AuthModal({ open, onClose }: Props) {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();

  const loginForm = useForm<LoginForm>({ resolver: zodResolver(loginSchema) });
  const registerForm = useForm<RegisterForm>({ resolver: zodResolver(registerSchema) });

  const handleLogin = async (data: LoginForm) => {
    setError('');
    try {
      const res = await loginUser(data);
      login(res.token, res.user);
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Login failed');
    }
  };

  const handleRegister = async (data: RegisterForm) => {
    setError('');
    try {
      const res = await registerUser(data);
      login(res.token, res.user);
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    }
  };

  const switchMode = () => {
    setMode(m => m === 'login' ? 'register' : 'login');
    setError('');
    loginForm.reset();
    registerForm.reset();
  };

  return (
    <Dialog open={open} onOpenChange={o => !o && onClose()}>
      <DialogContent className="sm:max-w-sm p-0 overflow-hidden rounded-2xl">
        <div className="bg-burgundy px-8 py-8 text-center">
          <p className="font-display text-white tracking-widest text-xs uppercase mb-2">Elevens Touch</p>
          <DialogTitle className="font-display text-white text-xl tracking-wide">
            {mode === 'login' ? 'Welcome Back' : 'Join Us'}
          </DialogTitle>
          <p className="font-body text-white/60 text-sm mt-2">
            {mode === 'login' ? 'Sign in to your account' : 'Create your account'}
          </p>
        </div>

        <div className="px-8 py-8">
          {error && (
            <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm font-body">
              {error}
            </div>
          )}

          {mode === 'login' ? (
            <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
              <div>
                <label className="font-body text-burgundy/70 text-xs uppercase tracking-wide block mb-1.5">Email</label>
                <input
                  {...loginForm.register('email')}
                  type="email"
                  placeholder="your@email.com"
                  className="w-full px-4 py-3 rounded-xl border border-blush-dark bg-blush/30 font-body text-burgundy placeholder-burgundy/30 focus:outline-none focus:border-mauve focus:ring-2 focus:ring-mauve/20 text-sm"
                />
                {loginForm.formState.errors.email && (
                  <p className="text-mauve text-xs mt-1 font-body">{loginForm.formState.errors.email.message}</p>
                )}
              </div>
              <div>
                <label className="font-body text-burgundy/70 text-xs uppercase tracking-wide block mb-1.5">Password</label>
                <div className="relative">
                  <input
                    {...loginForm.register('password')}
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 rounded-xl border border-blush-dark bg-blush/30 font-body text-burgundy placeholder-burgundy/30 focus:outline-none focus:border-mauve focus:ring-2 focus:ring-mauve/20 text-sm pr-12"
                  />
                  <button type="button" onClick={() => setShowPassword(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-burgundy/40">
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <button
                type="submit"
                disabled={loginForm.formState.isSubmitting}
                className="w-full py-3.5 bg-burgundy text-white rounded-xl font-body text-sm tracking-wide hover:bg-burgundy-hover transition-colors disabled:opacity-60 flex items-center justify-center gap-2 mt-2"
              >
                {loginForm.formState.isSubmitting && <Loader2 size={16} className="animate-spin" />}
                Sign In
              </button>
            </form>
          ) : (
            <form onSubmit={registerForm.handleSubmit(handleRegister)} className="space-y-4">
              <div>
                <label className="font-body text-burgundy/70 text-xs uppercase tracking-wide block mb-1.5">Full Name</label>
                <input
                  {...registerForm.register('name')}
                  placeholder="Your full name"
                  className="w-full px-4 py-3 rounded-xl border border-blush-dark bg-blush/30 font-body text-burgundy placeholder-burgundy/30 focus:outline-none focus:border-mauve focus:ring-2 focus:ring-mauve/20 text-sm"
                />
                {registerForm.formState.errors.name && (
                  <p className="text-mauve text-xs mt-1 font-body">{registerForm.formState.errors.name.message}</p>
                )}
              </div>
              <div>
                <label className="font-body text-burgundy/70 text-xs uppercase tracking-wide block mb-1.5">Email</label>
                <input
                  {...registerForm.register('email')}
                  type="email"
                  placeholder="your@email.com"
                  className="w-full px-4 py-3 rounded-xl border border-blush-dark bg-blush/30 font-body text-burgundy placeholder-burgundy/30 focus:outline-none focus:border-mauve focus:ring-2 focus:ring-mauve/20 text-sm"
                />
                {registerForm.formState.errors.email && (
                  <p className="text-mauve text-xs mt-1 font-body">{registerForm.formState.errors.email.message}</p>
                )}
              </div>
              <div>
                <label className="font-body text-burgundy/70 text-xs uppercase tracking-wide block mb-1.5">Password</label>
                <div className="relative">
                  <input
                    {...registerForm.register('password')}
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 rounded-xl border border-blush-dark bg-blush/30 font-body text-burgundy placeholder-burgundy/30 focus:outline-none focus:border-mauve focus:ring-2 focus:ring-mauve/20 text-sm pr-12"
                  />
                  <button type="button" onClick={() => setShowPassword(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-burgundy/40">
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <button
                type="submit"
                disabled={registerForm.formState.isSubmitting}
                className="w-full py-3.5 bg-burgundy text-white rounded-xl font-body text-sm tracking-wide hover:bg-burgundy-hover transition-colors disabled:opacity-60 flex items-center justify-center gap-2 mt-2"
              >
                {registerForm.formState.isSubmitting && <Loader2 size={16} className="animate-spin" />}
                Create Account
              </button>
            </form>
          )}

          <div className="mt-6 text-center">
            <p className="font-body text-burgundy/50 text-sm">
              {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
              <button onClick={switchMode} className="text-mauve hover:text-mauve-dark font-semibold transition-colors">
                {mode === 'login' ? 'Register' : 'Sign In'}
              </button>
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
