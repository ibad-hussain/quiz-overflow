import React, { useEffect, useState, useContext } from "react";
import "../styles/Quiz.css";
import Loader from '../components/Loader';
import NotFound from '../components/NotFound';
import { useParams, Link } from "react-router-dom";
import { AppContext } from '../context/AppContext';
import axios from "axios";


const Quiz = () => {

    const { userData, getUserData, backendUrl } = useContext(AppContext);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const { title } = useParams();
    const [quizzes, setQuizzes] = useState([]);

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

    const checkIfAttempted = (quizId) => {
        return userData?.quizzesTaken.some(
            (entry) => entry.quizId === quizId
        );
    };

    useEffect(() => {
        const fetchQuizzes = async () => {
            try {
                setLoading(true);
                setError(false);
                axios.defaults.withCredentials = true;
                const res = await axios.get(`${backendUrl}/api/quiz/topic/${title}`);

                if (res.data.success) {
                    setQuizzes(res.data.quizzes);
                } else {
                    setError(true);
                }

            } catch (error) {
                console.error("Error fetching quizzes :", error);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchQuizzes();
    }, [title]);


    if (loading) return <Loader />;
    if (error) return <NotFound text="Error fetching quizzes" />;


    return (
        <div className="quiz-main">

            <div className="main-title">{title} Quizzes</div>

            <div className="quizzes-container">
                {quizzes.length === 0 ? (
                    <p>No quizzes found for {title}</p>
                ) : (
                    quizzes.map((quiz) => (
                        <div key={quiz._id} className="quizes-card quizes-card-quizPage">
                            <div className="card-title-1">
                                <p>{quiz.title} {quiz.category}</p>
                                <p>{quiz.mode}</p>
                            </div>
                            <div className="card-title-2">
                                <p>Level {quiz.level}</p>
                                <p>{quiz.questionsCount} Questions</p>
                            </div>
                            {checkIfAttempted(quiz._id) ? (
                                <button className="card-btn" disabled>
                                    <span id="card-btn-disabled">Attempted</span>
                                </button>
                            ) : (
                                <Link to={`/quiz/${quiz._id}`}>
                                    <button className="card-btn">
                                        <svg
                                            height="24"
                                            width="24"
                                            viewBox="0 0 24 24"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path d="M0 0h24v24H0z" fill="none"></path>
                                            <path
                                                d="M5 13c0-5.088 2.903-9.436 7-11.182C16.097 3.564 19 7.912 19 13c0 .823-.076 1.626-.22 2.403l1.94 1.832a.5.5 0 0 1 .095.603l-2.495 4.575a.5.5 0 0 1-.793.114l-2.234-2.234a1 1 0 0 0-.707-.293H9.414a1 1 0 0 0-.707.293l-2.234 2.234a.5.5 0 0 1-.793-.114l-2.495-4.575a.5.5 0 0 1 .095-.603l1.94-1.832C5.077 14.626 5 13.823 5 13zm1.476 6.696l.817-.817A3 3 0 0 1 9.414 18h5.172a3 3 0 0 1 2.121.879l.817.817.982-1.8-1.1-1.04a2 2 0 0 1-.593-1.82c.124-.664.187-1.345.187-2.036 0-3.87-1.995-7.3-5-8.96C8.995 5.7 7 9.13 7 13c0 .691.063 1.372.187 2.037a2 2 0 0 1-.593 1.82l-1.1 1.039.982 1.8zM12 13a2 2 0 1 1 0-4 2 2 0 0 1 0 4z"
                                                fill="currentColor"
                                            ></path>
                                        </svg>
                                        <span>Start Quiz</span>
                                    </button>
                                </Link>
                            )}
                        </div>
                    ))
                )}
            </div>

        </div>
    )
}

export default Quiz
