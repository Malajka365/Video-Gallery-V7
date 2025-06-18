import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../lib/auth-context';
import FormInput from './FormInput';
import { useFormHandler } from '../../hooks/useFormHandler';
import SubmitButton from '../common/SubmitButton';

const RegistrationForm: React.FC = () => {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const initialValues = {
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  };

  const validateForm = (currentFormData: typeof initialValues) => {
    const newErrors: { [key: string]: string } = {};

    if (!currentFormData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (currentFormData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }

    if (!currentFormData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(currentFormData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!currentFormData.password) {
      newErrors.password = 'Password is required';
    } else if (currentFormData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (currentFormData.password !== currentFormData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    return newErrors; // Return errors instead of setting and returning boolean
  };

  const handleRegistrationSubmit = async (values: typeof initialValues) => {
    try {
      await signUp(values.email, values.password, values.username);
      navigate('/dashboard'); // Navigate on successful sign up
    } catch (error) {
      // The hook will catch this error and set errors.submit
      throw error instanceof Error ? error : new Error('Registration failed');
    }
  };

  const {
    formData,
    errors,
    isLoading,
    handleChange,
    handleSubmit, // This is the wrapper from the hook
  } = useFormHandler({
    initialValues,
    validate: validateForm,
    onSubmit: handleRegistrationSubmit,
  });

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <FormInput
        label="Username"
        name="username"
        type="text"
        value={formData.username}
        onChange={handleChange}
        error={errors.username}
        icon={<User className="w-5 h-5 text-gray-400" />}
        placeholder="Enter your username"
      />

      <FormInput
        label="Email"
        name="email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        error={errors.email}
        icon={<Mail className="w-5 h-5 text-gray-400" />}
        placeholder="Enter your email"
      />

      <FormInput
        label="Password"
        name="password"
        type={showPassword ? 'text' : 'password'}
        value={formData.password}
        onChange={handleChange}
        error={errors.password}
        icon={<Lock className="w-5 h-5 text-gray-400" />}
        placeholder="Create a password"
        endIcon={
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="focus:outline-none"
          >
            {showPassword ? (
              <EyeOff className="w-5 h-5 text-gray-400" />
            ) : (
              <Eye className="w-5 h-5 text-gray-400" />
            )}
          </button>
        }
      />

      <FormInput
        label="Confirm Password"
        name="confirmPassword"
        type={showConfirmPassword ? 'text' : 'password'}
        value={formData.confirmPassword}
        onChange={handleChange}
        error={errors.confirmPassword}
        icon={<Lock className="w-5 h-5 text-gray-400" />}
        placeholder="Confirm your password"
        endIcon={
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="focus:outline-none"
          >
            {showConfirmPassword ? (
              <EyeOff className="w-5 h-5 text-gray-400" />
            ) : (
              <Eye className="w-5 h-5 text-gray-400" />
            )}
          </button>
        }
      />

      {errors.submit && (
        <div className="text-red-500 text-sm text-center">{errors.submit}</div>
      )}

      <SubmitButton isLoading={isLoading} loadingText="Creating Account...">
        Create Account
      </SubmitButton>
    </form>
  );
};

export default RegistrationForm;