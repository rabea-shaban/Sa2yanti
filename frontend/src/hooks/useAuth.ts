import { useContext } from 'react';
import { AuthContext } from '../components/context/AuthContext';
import type { AuthContextType } from '../types/auth';

export default function useAuth(): AuthContextType {
  return useContext(AuthContext);
}
