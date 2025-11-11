import { useMutation } from '@apollo/client';
import { LOGIN_USER, REGISTER_USER, LOGIN_ADMIN } from '../graphql/mutations';
import { useAuthStore } from '../zustand/authStore';
import { useRouter } from 'next/navigation';

export const useAuth = () => {
  const { setAuth, logout, isAuthenticated, user, isAdmin } = useAuthStore();
  const router = useRouter();

  const [loginUserMutation] = useMutation(LOGIN_USER);
  const [registerUserMutation] = useMutation(REGISTER_USER);
  const [loginAdminMutation] = useMutation(LOGIN_ADMIN);

  const loginUser = async (email: string, password: string) => {
    const { data } = await loginUserMutation({
      variables: { email, password },
    });

    if (data.loginUser.errors.length > 0) {
      throw new Error(data.loginUser.errors.join(', '));
    }

    setAuth(data.loginUser.user, data.loginUser.token, false);
    return data.loginUser.user;
  };

  const registerUser = async (email: string, password: string, passwordConfirmation: string) => {
    const { data } = await registerUserMutation({
      variables: { email, password, passwordConfirmation },
    });

    if (data.registerUser.errors.length > 0) {
      throw new Error(data.registerUser.errors.join(', '));
    }

    setAuth(data.registerUser.user, data.registerUser.token, false);
    return data.registerUser.user;
  };

  const loginAdmin = async (email: string, password: string) => {
    const { data } = await loginAdminMutation({
      variables: { email, password },
    });

    if (data.loginAdmin.errors.length > 0) {
      throw new Error(data.loginAdmin.errors.join(', '));
    }

    setAuth(data.loginAdmin.adminUser, data.loginAdmin.token, true);
    router.push('/admin');
    return data.loginAdmin.adminUser;
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return {
    loginUser,
    registerUser,
    loginAdmin,
    logout: handleLogout,
    isAuthenticated: isAuthenticated(),
    user,
    isAdmin,
  };
};
