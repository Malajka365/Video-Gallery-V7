import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAuth } from '../../lib/auth-context';
import FormInput from './FormInput';
import { useFormHandler } from '../../hooks/useFormHandler';
import SubmitButton from '../common/SubmitButton';

const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, user, loading: authLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  // Ha már be van jelentkezve, átirányítjuk
  useEffect(() => {
    if (user && !authLoading) {
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    }
  }, [user, authLoading, navigate, location]);

  // Validate function now takes values and returns errors
  const validateForm = (currentFormData: typeof initialValues) => {
    const newErrors: { [key: string]: string } = {};

    if (!currentFormData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(currentFormData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!currentFormData.password) {
      newErrors.password = 'Password is required';
    }
    // Removed setErrors(newErrors)
    return newErrors; // Return the errors object
  };

  // This is the actual submission logic
  const handleLoginSubmit = async (values: typeof initialValues) => {
    try {
      await signIn(values.email, values.password);
      // Successful navigation is handled by the useEffect listening to `user`
    } catch (error: any) {
      console.error('Login error:', error);
      let errorMessage = 'An error occurred during login';
      if (error.message?.includes('Invalid login credentials')) {
        errorMessage = 'Invalid email or password';
      } else if (error.message?.includes('Email not confirmed')) {
        errorMessage = 'Email not confirmed. Please check your inbox.';
      } else if (error.message?.includes('User not found')) {
        errorMessage = 'Invalid email or password'; // Generic message for security
      }
      throw new Error(errorMessage); // Hook will catch and set this as errors.submit
    }
  };

  const initialValues = { email: '', password: '' };

  const {
    formData,
    errors,
    isLoading,
    handleChange,
    handleSubmit, // This is the wrapper from the hook
    // setErrors, // Exposing setErrors from the hook in case direct manipulation is needed
  } = useFormHandler({
    initialValues,
    validate: validateForm,
    onSubmit: handleLoginSubmit,
  });

  if (authLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <FormInput
        label="Email"
        name="email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        error={errors.email}
        icon={<Mail className="w-5 h-5 text-gray-400" />}
        placeholder="Enter your email"
        disabled={isLoading}
      />

      <FormInput
        label="Password"
        name="password"
        type={showPassword ? 'text' : 'password'}
        value={formData.password}
        onChange={handleChange}
        error={errors.password}
        icon={<Lock className="w-5 h-5 text-gray-400" />}
        placeholder="Enter your password"
        disabled={isLoading}
        endIcon={
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="focus:outline-none"
            disabled={isLoading}
          >
            {showPassword ? (
              <EyeOff className="w-5 h-5 text-gray-400" />
            ) : (
              <Eye className="w-5 h-5 text-gray-400" />
            )}
          </button>
        }
      />

      {errors.submit && (
        <div className="text-red-500 text-sm text-center bg-red-50 p-3 rounded-md">
          {errors.submit}
        </div>
      )}

      <div className="flex items-center justify-end">
        <Link 
          to="/forgot-password" 
          className="text-sm text-blue-600 hover:text-blue-700 disabled:opacity-50"
          tabIndex={isLoading ? -1 : 0}
        >
          Forgot your password?
        </Link>
      </div>

      <SubmitButton
        isLoading={isLoading}
        loadingText="Signing In..."
        data-testid="submit-button" // Keep test-id if needed
      >
        Sign In
      </SubmitButton>

      <div className="text-center text-sm">
        <span className="text-gray-600">Don't have an account? </span>
        <Link 
          to="/register" 
          className="text-blue-600 hover:text-blue-700 font-medium disabled:opacity-50"
          tabIndex={isLoading ? -1 : 0}
        >
          Sign up
        </Link>
      </div>
    </form>
  );
};

export default LoginForm;