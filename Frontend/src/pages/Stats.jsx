import React, { useEffect, useState, useContext } from 'react';
import '../styles/Stats.css';
import Loader from '../components/Loader';
import NotFound from '../components/NotFound';
import { AppContext } from '../context/AppContext';
import axios from 'axios';


const Stats = () => {

    const { backendUrl } = useContext(AppContext);
    const [topicStats, setTopicStats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchTopicStats = async () => {
            try {
                setLoading(true);
                setError(false);
                axios.defaults.withCredentials = true;
                const { data } = await axios.get(`${backendUrl}/api/admin/dashboard-data`);

                if (data.success) {
                    const quizzes = data.data.quizzes;  // All quizzes created
                    const quizAttempts = data.data.quizAttempts;  // Array with quizId, title, count

                    // Group quizzes by title
                    const quizTitleMap = {};
                    quizzes.forEach((quiz) => {
                        if (!quizTitleMap[quiz.title]) {
                            quizTitleMap[quiz.title] = { total: 0, taken: 0 };
                        }
                        quizTitleMap[quiz.title].total += 1;
                    });

                    // Sum attempt counts by title
                    quizAttempts.forEach((attempt) => {
                        if (quizTitleMap[attempt.title]) {
                            quizTitleMap[attempt.title].taken += attempt.count;
                        }
                    });

                    const finalStats = Object.entries(quizTitleMap).map(([title, stats]) => ({
                        title,
                        total: stats.total,
                        taken: stats.taken,
                    }));
                    setTopicStats(finalStats);
                } else {
                    setError(true);
                }

            } catch (error) {
                console.error('Error fetching topic stats :', error);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchTopicStats();
    }, [backendUrl]);

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
    if (error) return <NotFound text="Error fetching stats" />;


    return (
        <div className="stats-main">

            <div className="stats-title">Quizzes Stats</div>

            <table className="stats-table">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Quiz Title</th>
                        <th>Total Quizzes</th>
                        <th>Quizzes Taken</th>
                    </tr>
                </thead>
                <tbody>
                    {topicStats.map((topic, index) => (
                        <tr key={index}>
                            <td style={{ backgroundColor: getBadgeColor(topic.title) }}>{index + 1}</td>
                            <td>{topic.title}</td>
                            <td>{topic.total}</td>
                            <td>{topic.taken}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

        </div>
    )
}

export default Stats
