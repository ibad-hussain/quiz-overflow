import React, { useContext, useState, useEffect } from 'react';
import '../styles/Profile.css';
import Loader from '../components/Loader';
import NotFound from '../components/NotFound';
import { images } from '../utils/assets';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { toastOptions } from '../utils/toastConfig';


const Profile = () => {

  const { userData, getUserData, backendUrl } = useContext(AppContext);
  const navigate = useNavigate();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteBtnModalOpen, setIsDeleteBtnModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [newName, setNewName] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [linkedinLink, setLinkedinLink] = useState('');
  const [githubLink, setGithubLink] = useState('');
  const [deleteDeveloperId, setDeleteDeveloperId] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(false);
        await getUserData();

      } catch (error) {
        console.error('Error fetching profile :', error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (userData) {
      setNewName(userData.name || '');
      setLinkedinLink(userData.linkedinLink || '');
      setGithubLink(userData.githubLink || '');
    }
  }, [userData]);

  const userAvatar = `${backendUrl}/uploads/${userData?.avatar}`;
  const shareableLink = userData?.developerId ? `${window.location.origin}/share-profile/${userData.developerId}` : '';

  const handleUpdateProfile = async () => {
    if (!newName.trim()) {
      toast.error('Name is required', toastOptions);
      return;
    }

    setIsUpdating(true);

    try {
      const updatedData = {
        name: newName,
        linkedinLink,
        githubLink,
      };

      if (newPassword) {
        if (newPassword.length < 8) {
          toast.error('Password must be at least 8 characters', toastOptions);
          setIsUpdating(false);
          return;
        }
        updatedData.password = newPassword;
      }

      axios.defaults.withCredentials = true;
      const { data } = await axios.put(`${backendUrl}/api/user/update-profile`, updatedData);

      if (data.success) {
        await getUserData();
        setIsEditModalOpen(false);
        setNewPassword('');
        toast.success('Profile updated successfully', toastOptions);
      } else {
        toast.error('Error updating profile', toastOptions);
      }

    } catch (error) {
      console.error("Error updating profile: ", error);
      toast.error('Error updating profile', toastOptions);
    } finally {
      setIsUpdating(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareableLink);
    toast.success("Profile link copied", toastOptions);
  };

  const handleDeleteAccount = async () => {
    if (deleteDeveloperId !== userData?.developerId) {
      toast.error("Developer ID does not match", toastOptions);
      return;
    }

    setIsUpdating(true);

    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.delete(`${backendUrl}/api/user/delete-profile`, {
        data: { developerId: deleteDeveloperId },
      });

      if (data.success) {
        toast.success("Account deleted successfully", toastOptions);
        navigate("/");
      } else {
        toast.error("Error deleting account", toastOptions);
      }

    } catch (error) {
      console.error("Error deleting account: ", error);
      toast.error("Error deleting account", toastOptions);
    }
  };


  if (loading) return <Loader />;
  if (error) return <NotFound text="Error fetching profile" />;


  return (
    <div className="profile-main">

      <div className="main1-cont">

        <div className="main1-cont-upper">
          <img src={userAvatar} alt="" />
          <div className="main1-cont-upper-right">
            <div>
              <p>{userData?.name}</p>
              <p>{userData?.developerId}</p>
            </div>
          </div>
        </div>

        <div className="main1-cont-lower">
          <div className="main1-cont-row">
            <span className="row-img"><img src={images.nameIcon} alt="" /></span>
            <span className="row-heading">Name :</span>
            <span className="row-content">{userData?.name}</span>
          </div>
          <div className="main1-cont-row">
            <span className="row-img"><img src={images.emailIcon} alt="" /></span>
            <span className="row-heading">Email :</span>
            <span className="row-content">{userData?.email}</span>
          </div>
          <div className="main1-cont-row">
            <span className="row-img"><img src={images.passwordIcon} alt="" /></span>
            <span className="row-heading">Password :</span>
            <span className="row-content">{"*".repeat(12)}</span>
          </div>
          <div className="main1-cont-row">
            <span className="row-img"><img src={images.idIcon} alt="" /></span>
            <span className="row-heading">Developer ID :</span>
            <span className="row-content">{userData?.developerId}</span>
          </div>
          <div className="main1-cont-row">
            <span className="row-img"><img src={images.linkedinIcon} alt="" /></span>
            <span className="row-heading">Linkedin Profile link :</span>
            <span className="row-content">{userData?.linkedinLink || "-"}</span>
          </div>
          <div className="main1-cont-row">
            <span className="row-img"><img src={images.githubIcon} alt="" /></span>
            <span className="row-heading">GitHub Profile link :</span>
            <span className="row-content">{userData?.githubLink || "-"}</span>
          </div>
          <div className="main1-cont-row">
            <span className="row-img"><img width={"20px"} src={images.shareIcon} alt="" /></span>
            <span className="row-heading">Share Profile :</span>
            <span className="row-content">{shareableLink}<button id='row-content-0' onClick={copyToClipboard}>Copy</button></span>
          </div>
          <div className="main1-cont-row">
            <span className="row-img"><img width={"25px"} src={images.editIcon} alt="" /></span>
            <span className="row-heading">Edit Profile :</span>
            <span className="row-content"><button id='row-content-1' onClick={() => setIsEditModalOpen(true)}>Edit</button></span>
          </div>
          <div className="main1-cont-row">
            <span className="row-img"><img src={images.deleteIcon3} alt="" /></span>
            <span className="row-heading">Delete Profile :</span>
            <span className="row-content"><button id='row-content-2' onClick={() => setIsDeleteBtnModalOpen(true)}>Delete</button></span>
          </div>
        </div>

      </div>


      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="modal-overlay">

          <div className="modal-content">
            <h3>Edit Profile Details</h3>
            <div className="inputs">
              <label>Name :</label>
              <input
                type="text"
                value={newName}
                placeholder="Enter new name"
                onChange={(e) => setNewName(e.target.value)}
                required
              />

              <label>Email :</label>
              <input type="text" id='email-input' value={userData?.email} disabled />

              <label>Password : <small>(Leave blank to keep current)</small></label>
              <input
                type="password"
                value={newPassword}
                placeholder="Enter new password"
                onChange={(e) => setNewPassword(e.target.value)}
              />

              <label>Developer ID :</label>
              <input type="text" id='dev-id-input' value={userData?.developerId} disabled />

              <label>LinkedIn :</label>
              <input
                type="text"
                value={linkedinLink}
                placeholder="Enter new Linkedin URL"
                onChange={(e) => setLinkedinLink(e.target.value)}
              />

              <label>GitHub :</label>
              <input
                type="text"
                value={githubLink}
                placeholder="Enter new GitHub URL"
                onChange={(e) => setGithubLink(e.target.value)}
              />
            </div>
            <div className="modal-btns">
              <button id='P-cancel-btn' onClick={() => setIsEditModalOpen(false)}>Cancel</button>
              <button
                id='P-save-btn'
                onClick={handleUpdateProfile}
                disabled={isUpdating}
                style={{ opacity: isUpdating ? 0.6 : 1, cursor: isUpdating ? 'not-allowed' : 'pointer' }}
              >
                {isUpdating ? 'Saving' : 'Save'}
              </button>
            </div>
          </div>

        </div>
      )}


      {/* Delete Modal */}
      {isDeleteBtnModalOpen && (
        <div className="modal-overlay">

          <div className="modal-content">
            <h3>Delete Your Account</h3>
            <p className='enterId'>Enter your Developer ID to confirm :</p>
            <input
              type="text"
              value={deleteDeveloperId}
              placeholder="Enter Developer ID"
              onChange={(e) => setDeleteDeveloperId(e.target.value)}
              id='enterId-input'
            />
            <div className="modal-btns">
              <button id='P-no-btn' onClick={() => setIsDeleteBtnModalOpen(false)}>No</button>
              <button
                id='P-delete-btn'
                onClick={handleDeleteAccount}
                disabled={isUpdating}
                style={{ opacity: isUpdating ? 0.6 : 1, cursor: isUpdating ? 'not-allowed' : 'pointer' }}
              >
                {isUpdating ? 'Deleting' : 'Delete'}
              </button>
            </div>
          </div>

        </div>
      )}

    </div>
  )
}

export default Profile
