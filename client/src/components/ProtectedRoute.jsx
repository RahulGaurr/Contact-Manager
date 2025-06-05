

// const ProtectedRoute = () => {
//   return (
//     <div>ProtectedRoute</div>
//   )
// }

// export default ProtectedRoute



import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

function ProtectedRoute({ children }) {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  return user ? children : null;
}

export default ProtectedRoute;