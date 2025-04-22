import React, { useContext, useEffect, useState } from 'react';
import '../styles/AdminQuiz.css';
import Loader from '../components/Loader';
import NotFound from '../components/NotFound';
import { useParams } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import axios from 'axios';


const AdminQuiz = () => {

    const { backendUrl } = useContext(AppContext);
    const { title, category, level } = useParams();
    const [quiz, setQuiz] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchQuiz = async () => {
            try {
                setLoading(true);
                setError(false);
                axios.defaults.withCredentials = true;
                const { data } = await axios.get(`${backendUrl}/api/admin/dashboard-data`);

                if (data.success) {
                    const matchedQuiz = data.data.quizzes.find((q) =>
                        q.title === title &&
                        q.category === category &&
                        q.level === level
                    );
                    setQuiz(matchedQuiz);
                } else {
                    setError(true);
                }

            } catch (error) {
                console.error("Error fetching quiz data :", error);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchQuiz();
    }, [backendUrl, title, category, level]);


    if (loading) return <Loader />;
    if (error) return <NotFound text="Error fetching quiz" />;
    if (!quiz) return <NotFound text="Quiz not found" />;


    return (
        <div className="adminQuiz-main">

            <div className="adminQuiz-container">

                <div className="adminQuiz-title">{quiz.title} {quiz.category} Quiz - Level {quiz.level}</div>

                <p id='upper-upper'>Details</p>

                <div className="adminQuiz-upper">
                    <div className="adminQuiz-upper-cont1">
                        <div>
                            <div>Title</div>
                            <div>Category</div>
                            <div>Level</div>
                            <div>Mode</div>
                            <div>Total Questions</div>
                            <div>Questions Count</div>
                            <div>Score for Badge</div>
                        </div>
                        <div>
                            <div>:</div>
                            <div>:</div>
                            <div>:</div>
                            <div>:</div>
                            <div>:</div>
                            <div>:</div>
                            <div>:</div>
                        </div>
                        <div>
                            <div>{quiz.title}</div>
                            <div>{quiz.category}</div>
                            <div>{quiz.level}</div>
                            <div>{quiz.mode}</div>
                            <div>{quiz.questions.length}</div>
                            <div>{quiz.questionsCount}</div>
                            <div>{quiz.scoreForBadge}</div>
                        </div>
                    </div>
                    <div className="adminQuiz-upper-cont2">
                        <div className="animate"></div>
                    </div>
                </div>

                <p id='upper-upper'>Questions</p>

                <div className="adminQuiz-lower">
                    {quiz.questions.map((q, idx) => (
                        <div key={idx} id='q-cont'>
                            <div className="q">{idx + 1}.&nbsp;&nbsp;{q.questionText}</div>
                            <div className="o">
                                {q.options.map((opt, i) => (
                                    <p
                                        key={i}
                                        style={{
                                            fontWeight: opt === q.correctAnswer ? 'bold' : 'normal',
                                            color: opt === q.correctAnswer ? 'green' : 'inherit',
                                        }}
                                    >
                                        <span><strong>{String.fromCharCode(65 + i)}.</strong></span>&nbsp;&nbsp;{opt}
                                    </p>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

            </div >

        </div >
    )
}

export default AdminQuiz
