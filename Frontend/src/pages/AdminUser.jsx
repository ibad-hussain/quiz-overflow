import React, { useEffect, useState, useContext } from 'react';
import '../styles/AdminUser.css';
import Loader from '../components/Loader';
import NotFound from '../components/NotFound';
import { useParams } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import axios from 'axios';


const AdminUser = () => {

  const { developerId } = useParams();
  const { backendUrl } = useContext(AppContext);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        setError(false);
        axios.defaults.withCredentials = true;
        const { data } = await axios.get(`${backendUrl}/api/admin/dashboard-data`);

        if (data.success) {
          const users = data.data.users;
          const matchedUser = users.find((u) => u.developerId === developerId);
          setUser(matchedUser || null);
        } else {
          setError(true);
        }

      } catch (error) {
        console.error('Error fetching user data :', error);
        setError(true);
      } finally {
        setLoading(false);
      }

    };

    fetchUserData();
  }, [backendUrl, developerId]);


  if (loading) return <Loader />;
  if (error) return <NotFound text="Error fetching user" />;
  if (!user) return <NotFound text="User not found" />;


  return (
    <div className="adminUser-main">

      <div className="adminUser-title">{user.name}'s Profile</div>

      <div className="upper-adminUser-userDetails">User Details</div>
      <div className="adminUser-userDetails">
        <div className="adminUser-userDetails-cont1">
          <div>
            <div>Name</div>
            <div>Developer ID</div>
            <div>Email</div>
            <div>Quizzes Taken</div>
            <div>Badges Earned</div>
            <div>Role</div>
          </div>
          <div>
            <div>:</div>
            <div>:</div>
            <div>:</div>
            <div>:</div>
            <div>:</div>
            <div>:</div>
          </div>
          <div>
            <div>{user.name}</div>
            <div>{user.developerId}</div>
            <div>{user.email}</div>
            <div>{user.quizzesTaken.length}</div>
            <div>{user.quizzesTaken.filter(q => q.badgeEarned).length}</div>
            <div>{user.role}</div>
          </div>
        </div>
        <div className="adminUser-userDetails-cont2">
          <div class="animate"></div>
        </div>
      </div>

      <div className="upper-adminUser-quizzesDetails">Quizzes Details</div>
      <div className="adminUser-quizDetails">
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Level</th>
              <th>Mode</th>
              <th>Questions Count</th>
              <th>Scored</th>
              <th>Badge Earned</th>
            </tr>
          </thead>
          <tbody>
            {user.quizzesTaken.length === 0 ? (
              <tr><td colSpan="7">No quizzes taken yet.</td></tr>
            ) : (
              user.quizzesTaken.map((quiz, idx) => (
                <tr key={idx}>
                  <td>{quiz.quizId?.title || '-'}</td>
                  <td>{quiz.quizId?.category || '-'}</td>
                  <td>{quiz.quizId?.level || '-'}</td>
                  <td>{quiz.quizId?.mode || '-'}</td>
                  <td>{quiz.quizId?.questionsCount || '-'}</td>
                  <td>{quiz.score}</td>
                  <td>{quiz.badgeEarned ? 'Yes' : 'No'}</td>
                </tr>
              )
              ))}
          </tbody>
        </table>
      </div>

    </div>
  )
}

export default AdminUser
