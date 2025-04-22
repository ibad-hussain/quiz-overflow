import React, { useEffect, useState, useContext } from 'react';
import '../styles/AdminUsers.css';
import Loader from '../components/Loader';
import NotFound from '../components/NotFound';
import { images } from "../utils/assets"
import { AppContext } from '../context/AppContext';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { toastOptions } from "../utils/toastConfig";


const AdminUsers = () => {

  const { backendUrl } = useContext(AppContext);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(false);
        axios.defaults.withCredentials = true;
        const { data } = await axios.get(`${backendUrl}/api/admin/dashboard-data`);

        if (data.success) {
          setUsers(data.data.users);
        } else {
          setError(true);
        }

      } catch (error) {
        console.error('Error fetching users data :', error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [backendUrl]);

  const handleDeleteUser = async () => {
    try {
      setDeleting(true);
      axios.defaults.withCredentials = true;
      const { data } = await axios.delete(`${backendUrl}/api/admin/delete-user/${selectedUserId}`);

      if (data.success) {
        setUsers(prev => prev.filter(user => user._id !== selectedUserId));
        setShowModal(false);
        setSelectedUserId(null);
        setSelectedUser(null);
        toast.success("User deleted successfully", toastOptions)
      } else {
        toast.error("Error deleting user", toastOptions);
      }

    } catch (error) {
      console.error('Error deleting user :', error);
      toast.error("Error deleting user", toastOptions);
    } finally {
      setDeleting(false);
    }
  };


  if (loading) return <Loader />;
  if (error) return <NotFound text="Error fetching users" />;
  if (!users || users.length === 0) return <NotFound text="No users found" />;


  return (
    <div className="users-main">

      <div className="users-title">All Users</div>

      <table className="users-table">
        <thead>
          <tr>
            <th style={{ width: '4%' }}>#</th>
            <th style={{ width: '15%' }}>Name</th>
            <th style={{ width: '13%' }}>Developer ID</th>
            <th style={{ width: '26%' }}>Email</th>
            <th style={{ width: '11%' }}>Quizzes Taken</th>
            <th style={{ width: '11%' }}>Badges Earned</th>
            <th style={{ width: '11%' }}>Role</th>
            <th style={{ width: '9%' }}>Delete Acc.</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => {
            const totalQuizzesTaken = user.quizzesTaken?.length || 0;
            const totalBadgesEarned = user.quizzesTaken?.filter(
              (quiz) => quiz.badgeEarned
            ).length || 0;

            return (
              <tr key={user._id}>
                <td>{index + 1}</td>
                <td>{user.name}</td>
                <td>
                  {user.developerId}
                  <Link to={`/admin-user/${user.developerId}`} title="View Details">
                    <img id='linkIconUsers' src={images.linkIcon} alt="" />
                  </Link>
                </td>
                <td>{user.email}</td>
                <td>{totalQuizzesTaken}</td>
                <td>{totalBadgesEarned}</td>
                <td>{user.role}</td>
                <td><img
                  id='deleteIcon'
                  width={"28px"}
                  src={images.deleteIcon}
                  alt=""
                  onClick={() => {
                    setSelectedUserId(user._id);
                    setSelectedUser({ name: user.name, developerId: user.developerId });
                    setShowModal(true);
                  }}
                  onMouseOver={(e) => e.currentTarget.src = images.deleteIcon2}
                  onMouseOut={(e) => e.currentTarget.src = images.deleteIcon}
                /></td>
              </tr>
            )
          })}
        </tbody>
      </table>


      {/* Delete Modal */}
      {showModal && (
        <div className="modal-overlay">

          <div className="modal-content">
            <h3>Delete User Account</h3>
            <p className='confirmation-p'>Are you sure you want to delete this user ?</p>
            <p id='confirmation-p-1'>Name: {selectedUser?.name}</p>
            <p id='confirmation-p-2'>DeveloperID: {selectedUser?.developerId}</p>
            <div className="modal-btns">
              <button
                id="P-no-btn"
                onClick={() => {
                  setShowModal(false);
                  setSelectedUserId(null);
                  setSelectedUser(null);
                  setDeleting(false);
                }}
              >
                No
              </button>
              <button
                id="P-delete-btn"
                onClick={handleDeleteUser}
                disabled={deleting}
                style={{ opacity: deleting ? 0.6 : 1, cursor: deleting ? 'not-allowed' : 'pointer' }}
              >
                {deleting ? "Deleting" : "Yes"}
              </button>
            </div>
          </div>

        </div>
      )}

    </div>
  )
}

export default AdminUsers
