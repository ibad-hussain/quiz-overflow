import React, { useEffect, useState, useContext } from "react";
import '../styles/Share.css';
import Loader from '../components/Loader';
import NotFound from '../components/NotFound';
import { images } from "../utils/assets"
import { useParams } from "react-router-dom";
import { AppContext } from '../context/AppContext';
import axios from "axios";


const Share = () => {

    const { backendUrl } = useContext(AppContext);
    const { developerId, name } = useParams();
    const [profile, setProfile] = useState(null);
    const [badgesList, setBadgesList] = useState([]) || [];
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setLoading(true);
                setError(false);
                axios.defaults.withCredentials = true;
                const { data } = await axios.get(`${backendUrl}/api/user/share-profile/${developerId}`);

                if (data.success) {
                    setProfile(data.userData);
                    setBadgesList(data.userData.badgesList);
                } else {
                    setError(true);
                }

            } catch (error) {
                console.error('Error fetching profile :', error);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [developerId]);

    const userAvatar = `${backendUrl}/uploads/${profile?.avatar}`;

    const getBadgeColor = (title) => {
        switch (title) {
            case "HTML":
                return "#E34F26";
            case "CSS":
                return "#1572B6";
            case "JavaScript":
                return "#F7DF1E";
            case "React JS":
                return "#61DAFB";
            case "Node JS":
                return "#339933";
            case "Express JS":
                return "#666666";
            case "MongoDB":
                return "#47A248";
            case "Python":
                return "#1E90FC";
            case "Java":
                return "#ED8B00";
            case "C":
                return "#A8B9CC";
            case "C++":
                return "#0D52BD";
            case "C#":
                return "#903da5";
            case "SQL":
                return "#B7410E";
            default:
                return "#e5e7eb";
        }
    };


    if (loading) return <Loader />;
    if (error) return <NotFound text="Profile not found" />;


    return (
        <div className="share-main">

            <div className="share-container">
                <div className="share-left">
                    <img src={userAvatar} alt="Profile" className="profile-pic" />
                    <p>{profile?.name}</p>
                    <p>{profile?.developerId}</p>
                    {profile?.linkedinLink || profile?.githubLink ? (
                        <div className="share-links">
                            {profile?.linkedinLink && (
                                <div>
                                    <img src={images.linkedinIcon} alt="" />
                                    <a href={profile?.linkedinLink} target="_blank" rel="noopener noreferrer">LinkedIn</a>
                                </div>
                            )}
                            {profile?.githubLink && (
                                <div>
                                    <img src={images.githubIcon} alt="" />
                                    <a href={profile?.githubLink} target="_blank" rel="noopener noreferrer">GitHub</a>
                                </div>
                            )}
                        </div>
                    ) : ''}
                </div>

                <div className="share-right">
                    <div className="badges-title">Earned Badges</div>
                    <div className="badges">
                        {badgesList.length > 0 ? (
                            badgesList.map((badge, index) => (
                                <div
                                    key={index}
                                    className="badge"
                                    style={{ backgroundColor: getBadgeColor(badge.title) }}
                                >
                                    <img src={images.features5} alt="" />
                                    <p className='badge-p1'>{badge.title}</p>
                                    <p className='badge-p2'>{badge.category}</p>
                                    <p className='badge-p3'>Level {badge.level}</p>
                                </div>
                            ))
                        ) : (
                            <p>No badges earned yet.</p>
                        )}
                    </div>
                </div>
            </div>

        </div>
    )
}


export default Share
