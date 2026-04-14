import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useRegister } from '../api/hooks/useAuth';
import { RegisterSchema } from '@app/shared-types';

export default function Register(): React.ReactElement {
  const navigate = useNavigate();
  const register = useRegister();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const passwordStrength = (): { label: string; color: string } => {
    if (password.length < 8) return { label: 'Too short', color: '#e74c3c' };
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasDigit = /\d/.test(password);
    const hasSpecial = /[!@#$%^&*]/.test(password);
    const score = [hasUpper, hasLower, hasDigit, hasSpecial].filter(Boolean).length;
    if (score <= 2) return { label: 'Weak', color: '#f39c12' };
    if (score === 3) return { label: 'Good', color: '#3498db' };
    return { label: 'Strong', color: '#2ecc71' };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!acceptedTerms) { setError('Please accept the terms'); return; }
    const validation = RegisterSchema.safeParse({ email, password, name });
    if (!validation.success) { setError(validation.error.errors[0].message); return; }
    try {
      await register.mutateAsync({ email, password, name });
      navigate('/login');
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Registration failed');
    }
  };

  const strength = passwordStrength();

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Create Account</h1>
        {error && <div className="auth-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            {password && <span style={{ color: strength.color, fontSize: '12px' }}>Strength: {strength.label}</span>}
          </div>
          <label className="checkbox-label">
            <input type="checkbox" checked={acceptedTerms} onChange={(e) => setAcceptedTerms(e.target.checked)} />
            I accept the Terms of Service
          </label>
          <button type="submit" className="btn btn-primary btn-full" disabled={register.isPending}>
            {register.isPending ? 'Creating...' : 'Create Account'}
          </button>
        </form>
        <div className="auth-links">
          <Link to="/login">Already have an account? Sign in</Link>
        </div>
      </div>
    </div>
  );
}
