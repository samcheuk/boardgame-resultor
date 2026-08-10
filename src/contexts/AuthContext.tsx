import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import {
  onAuthStateChanged,
  signOut as firebaseSignOut,
  type User,
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db, isFirebaseConfigured } from '../firebase/firebase';
import { signInWithGoogleCredential } from '../services/googleSignIn';

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  error: string | null;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

async function isEmailWhitelisted(email: string): Promise<boolean> {
  if (!db) {
    return false;
  }

  const snapshot = await getDoc(doc(db, 'whitelist', email));
  return snapshot.exists();
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const authInstance = auth;

    if (!isFirebaseConfigured || !authInstance) {
      setUser(null);
      setLoading(false);
      setError(
        'Firebase is not configured. Copy .env.example to .env.local and fill in your Firebase keys, then restart npm run dev.',
      );
      return;
    }

    const unsubscribe = onAuthStateChanged(authInstance, async (firebaseUser) => {
      if (!firebaseUser) {
        setUser(null);
        setLoading(false);
        return;
      }

      const email = firebaseUser.email;
      if (!email || !(await isEmailWhitelisted(email))) {
        await firebaseSignOut(authInstance);
        setUser(null);
        setError('Not authorized');
        setLoading(false);
        return;
      }

      setUser(firebaseUser);
      setError(null);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  async function signInWithGoogle(): Promise<void> {
    const authInstance = auth;

    if (!authInstance) {
      setError('Firebase is not configured.');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const result = await signInWithGoogleCredential();
      const email = result.user.email;

      if (!email || !(await isEmailWhitelisted(email))) {
        await firebaseSignOut(authInstance);
        setUser(null);
        setError('Not authorized');
        return;
      }

      setUser(result.user);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to sign in with Google';
      setError(message);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  async function signOut(): Promise<void> {
    const authInstance = auth;

    if (!authInstance) {
      setUser(null);
      return;
    }

    setError(null);
    await firebaseSignOut(authInstance);
    setUser(null);
  }

  function clearError(): void {
    setError(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        signInWithGoogle,
        signOut,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
