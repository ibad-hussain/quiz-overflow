import React, { useEffect, useState, useContext, useLayoutEffect } from 'react';
import '../styles/AdminQuizzes.css';
import Loader from '../components/Loader';
import NotFound from '../components/NotFound';
import { images } from '../utils/assets';
import { Link } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import axios from 'axios';


const AdminQuizzes = () => {

    const { backendUrl } = useContext(AppContext);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const [quizzes, setQuizzes] = useState([]);
    const [badgeStats, setBadgeStats] = useState([]);
    const [selectedTitle, setSelectedTitle] = useState("All");
    const [selectedCategory, setSelectedCategory] = useState("All");

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(false);
                axios.defaults.withCredentials = true;
                const { data } = await axios.get(`${backendUrl}/api/admin/dashboard-data`);

                if (data.success) {
                    setQuizzes(data.data.quizzes);
                    setBadgeStats(data.data.badgeStats);
                } else {
                    setError(true);
                }

            } catch (error) {
                console.error("Error fetching quizzes data :", error);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const allTitles = ["All", ...new Set(quizzes.map(q => q.title))];
    const allCategories = ["All", ...new Set(quizzes.map(q => q.category))];

    useEffect(() => {
        adjustSelectWidth("titleSelect", "titleWidthCalculator", selectedTitle);
    }, [selectedTitle]);

    useEffect(() => {
        adjustSelectWidth("categorySelect", "categoryWidthCalculator", selectedCategory);
    }, [selectedCategory]);

    const adjustSelectWidth = (selectId, spanId, value) => {
        const select = document.getElementById(selectId);
        const span = document.getElementById(spanId);
        if (select && span) {
            span.innerText = value;
            select.style.width = span.offsetWidth + 30 + "px";
        }
    };

    const filteredQuizzes = quizzes.filter((q) => {
        const matchesTitle = selectedTitle === "All" || q.title === selectedTitle;
        const matchesCategory = selectedCategory === "All" || q.category === selectedCategory;
        return matchesTitle && matchesCategory;
    });

    const getBadgeCount = (title, category, level) => {
        const stat = badgeStats.find(
            (s) => s._id.title === title && s._id.category === category && s._id.level === level
        );
        return stat ? stat.badgesEarned : 0;
    };


    if (loading) return <Loader />;
    if (error) return <NotFound text="Error fetching quizzes" />;
    if (!quizzes || quizzes.length === 0) return <NotFound text="No quizzes found" />;


    return (
        <div className="adminQuizzes-main">

            <div className="adminQuizzes-title">All Quizzes</div>

            <div className="filter-controls">
                <label htmlFor="titleSelect">Select Topic:</label>
                <select
                    id="titleSelect"
                    value={selectedTitle}
                    onChange={(e) => setSelectedTitle(e.target.value)}
                >
                    {allTitles.map((title, idx) => (
                        <option key={idx} value={title}>{title}</option>
                    ))}
                </select>
                <span id="titleWidthCalculator">{selectedTitle}</span>

                <label htmlFor="categorySelect" style={{ marginLeft: "30px" }}>Select Category:</label>
                <select
                    id="categorySelect"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                >
                    {allCategories.map((cat, idx) => (
                        <option key={idx} value={cat}>{cat}</option>
                    ))}
                </select>
                <span id="categoryWidthCalculator">{selectedCategory}</span>
            </div>

            <table className="adminQuizzes-table">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Title</th>
                        <th>Category</th>
                        <th>Level</th>
                        <th>Mode</th>
                        <th>Questions Count</th>
                        <th>Score for Badge</th>
                        <th>Badges Earned</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredQuizzes.map((quiz, index) => (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{quiz.title}</td>
                            <td>{quiz.category}</td>
                            <td id='level'>
                                {quiz.level}
                                <Link to={`/admin-quiz/${quiz.title}/${quiz.category}/level/${quiz.level}`} title="View Details">
                                    <img id='linkIcon' src={images.linkIcon} alt="" />
                                </Link>
                            </td>
                            <td>{quiz.mode}</td>
                            <td>{quiz.questionsCount}</td>
                            <td>{quiz.scoreForBadge}</td>
                            <td>{getBadgeCount(quiz.title, quiz.category, quiz.level)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

        </div>
    )
}

export default AdminQuizzes
