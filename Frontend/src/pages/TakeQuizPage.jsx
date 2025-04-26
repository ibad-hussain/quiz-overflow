import React, { useEffect, useState, useContext } from "react";
import '../styles/TakeQuizPage.css';
import Loader from '../components/Loader';
import NotFound from '../components/NotFound';
import { images } from "../utils/assets"
import { useParams, Link } from "react-router-dom";
import { AppContext } from '../context/AppContext';
import ReactMarkdown from "react-markdown";
import axios from "axios";
import { toast } from 'react-toastify';
import { toastOptions } from "../utils/toastConfig";


const TakeQuizPage = () => {

    const { quizId } = useParams();
    const { userData, getUserData, backendUrl } = useContext(AppContext);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

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

    const [quizCompleted, setQuizCompleted] = useState(false);
    const [startQuiz, setStartQuiz] = useState(true);

    const [quizTitle, setQuizTitle] = useState("");
    const [quizCategory, setQuizCategory] = useState("");
    const [quizLevel, setQuizLevel] = useState("");
    const [quizMode, setQuizMode] = useState("");
    const [quizQuestionsCount, setQuizQuestionsCount] = useState(0)
    const [quizScoreForBadge, setQuizScoreForBadge] = useState(0)

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedQuestions, setSelectedQuestions] = useState([]);
    const [selectedOption, setSelectedOption] = useState(null);
    const [userAnswers, setUserAnswers] = useState({});
    const [quizResults, setQuizResults] = useState(null);


    useEffect(() => {
        const fetchQuiz = async () => {
            try {
                setLoading(true);
                setError(false);
                axios.defaults.withCredentials = true;
                const { data } = await axios.get(`${backendUrl}/api/quiz/${quizId}`);

                if (data.success) {
                    const qCount = data.quiz.questionsCount
                    const allQuestions = data.quiz.questions;
                    const shuffledQuestions = allQuestions.sort(() => 0.5 - Math.random());
                    setSelectedQuestions(shuffledQuestions.slice(0, qCount));

                    setQuizTitle(data.quiz.title);
                    setQuizCategory(data.quiz.category);
                    setQuizLevel(data.quiz.level);
                    setQuizMode(data.quiz.mode);
                    setQuizQuestionsCount(data.quiz.questionsCount);
                    setQuizScoreForBadge(data.quiz.scoreForBadge);
                } else {
                    setError(true);
                }

            } catch (error) {
                console.error("Error fetching quiz :", error);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchQuiz();
    }, [quizId]);

    const currentQuestion = selectedQuestions[currentQuestionIndex] || {};

    const handleOptionSelect = (option) => {
        setSelectedOption(option);
    };

    const handleNextQuestion = () => {
        if (selectedOption !== null) {
            const updatedAnswers = {
                ...userAnswers,
                [currentQuestion._id]: selectedOption,  // Store the current answer with Question id
            };

            setUserAnswers(updatedAnswers);  // Update state

            if (currentQuestionIndex < selectedQuestions.length - 1) {
                setSelectedOption(null);
                setCurrentQuestionIndex(currentQuestionIndex + 1);
            } else {
                handleSubmitQuiz(updatedAnswers);  // Submit with the last answer
            }
        } else {
            toast.error("Please select an option before proceeding", toastOptions);
        }
    };

    const handleSubmitQuiz = async (finalAnswers) => {
        try {
            setIsSubmitting(true);
            axios.defaults.withCredentials = true;
            const { data } = await axios.post(`${backendUrl}/api/quiz/${quizId}/submit`, {
                selectedQuestions,
                userAnswers: finalAnswers,  // Ensure all answers, including the last one, are sent
            });

            if (data.success) {
                await getUserData();
                setQuizResults(data);
                setQuizCompleted(true);
            } else {
                toast.error("Error submitting quiz", toastOptions);
            }

        } catch (error) {
            console.error("Error submitting quiz :", toastOptions);
            toast.error("Error submitting quiz", toastOptions);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleStartBtn = () => {
        setStartQuiz(false);
    };


    if (loading) return <Loader />;
    if (error) return <NotFound text="Error fetching quiz" />;


    if (startQuiz) {
        return (
            <div className="takeQuizPage-main">

                <div className="takeQuizPage-container-start">
                    <div className="first-content">
                        <span>
                            <p>{quizTitle}</p>
                            <p>{quizCategory}</p>
                            <p>Quiz</p>
                            <img src={images.cursorIcon} alt="" />
                        </span>
                    </div>
                    <div className="second-content">
                        <span className="first-span">
                            <span className="first-span-1">Note :</span>
                            <span className="first-span-2">
                                <div className="first-span-2-div first-span-2-div1">
                                    <p className="first-span-2-P1">🎯</p>
                                    <p className="first-span-2-P2">{quizTitle} {quizCategory} Quiz</p>
                                </div>
                                <div className="first-span-2-div">
                                    <p className="first-span-2-P1">📝</p>
                                    <p className="first-span-2-P2">Level:{quizLevel}&nbsp;&nbsp;-&nbsp;&nbsp;Questions:{quizQuestionsCount}&nbsp;&nbsp;-&nbsp;&nbsp;Mode:{quizMode}</p>
                                </div>
                                <div className="first-span-2-div first-span-2-div3">
                                    <p className="first-span-2-P1">📌</p>
                                    <p className="first-span-2-P2">You are allowed to attempt the quiz just once</p>
                                </div>
                                <div className="first-span-2-div">
                                    <p className="first-span-2-P1">🏆</p>
                                    <p className="first-span-2-P2">You need to score {quizScoreForBadge} out of {quizQuestionsCount} to earn a badge</p>
                                </div>
                            </span>
                        </span>
                        <span className="second-span">
                            <button onClick={handleStartBtn}>Start</button>
                        </span>
                    </div>
                </div>

            </div>
        )
    }


    if (quizCompleted) {
        return (
            <div className="takeQuizPage-main">

                <div className="takeQuizPage-container-result">
                    <div className="result-gif">
                        <img src={images.animatedResult} alt="" width={"90px"} />
                    </div>
                    <div className="tqp-upper">
                        <div>{quizTitle} {quizCategory} Quiz</div>
                        <div className="details">
                            <p>Level : {quizLevel}</p>
                            <p>Questions : {quizQuestionsCount}</p>
                            <p>Mode : {quizMode}</p>
                        </div>
                    </div>

                    <div className="tqp-lower-result">
                        <div className="tqp-lower-result-1">
                            <div>You scored <span id='count'>{quizResults.score}</span> out of {quizQuestionsCount}</div>
                            <div><span id="colorChange">●</span>&nbsp;&nbsp;{quizResults.score < quizScoreForBadge ? `You need\u00A0\u00A0\u00A0${quizScoreForBadge}/${quizQuestionsCount}\u00A0\u00A0\u00A0to earn a badge` : "You earned a badge"}</div>
                        </div>
                        <div className="tqp-lower-result-2">
                            {quizResults.results.map((result, index) => (
                                <div className="tqp-lower-result-2-card">
                                    <div className="result-gif-RW">
                                        <img src={result.userAnswer === result.correctAnswer ? images.animatedRight : images.animatedWrong} alt="" width={"60px"} />
                                    </div>
                                    <div key={index}>
                                        <div className="questionText-result">
                                            <b>{index + 1}.</b>{' '}
                                            <ReactMarkdown components={{
                                                p: ({ node, ...props }) => <span {...props} />
                                            }}>
                                                {result.questionText}
                                            </ReactMarkdown>
                                        </div>
                                    </div>
                                    <div>
                                        {result.options.map((option, i) => (
                                            <p key={i} style={{ backgroundColor: option === result.correctAnswer ? "#43d685" : "", color: option === result.correctAnswer ? "white" : "", fontWeight: option === result.correctAnswer ? "600" : "" }}>
                                                <span style={{ fontSize: "13px" }}>{option === result.correctAnswer ? "🟢" : "🔴"}</span>
                                                <span><strong>{String.fromCharCode(65 + i)}.</strong></span>
                                                <span style={{ fontSize: "15px" }}>
                                                    <ReactMarkdown
                                                        components={{
                                                            p: ({ node, ...props }) => <span {...props} />
                                                        }}
                                                    >
                                                        {option}
                                                    </ReactMarkdown>
                                                </span>
                                            </p>
                                        ))}
                                    </div>
                                    <div>
                                        <span>Your Answer:</span>
                                        <span><b style={{ color: result.userAnswer === result.correctAnswer ? "green" : "red" }}>{result.userAnswer ? <ReactMarkdown>{result.userAnswer}</ReactMarkdown> : "No Answer"}</b></span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="tqp-lower-result-3">
                            <Link to={`/progress/${userData?.developerId}`}><button><span>See Your Progress</span></button></Link>
                            <Link to="/quizzes"><button><span>Explore More Quizzes</span></button></Link>
                        </div>
                    </div>
                </div>

            </div>
        )
    }


    return (
        <div className="takeQuizPage-main">

            <div className="takeQuizPage-container-quiz">
                <div className="quiz-gif">
                    <img src={images.animatedQuiz} alt="" width={"90px"} />
                </div>
                <div className="tqp-upper">
                    <div>{quizTitle} {quizCategory} Quiz</div>
                    <div>
                        <p>Level : {quizLevel}</p>
                        <p>Questions : {quizQuestionsCount}</p>
                        <p>Mode : {quizMode}</p>
                    </div>
                </div>

                <div className="tqp-lower-quiz">
                    <div className="tqp-lower-quiz-1">
                        <div className="questionText-quiz">
                            <b>{currentQuestionIndex + 1}.</b>{' '}
                            <ReactMarkdown
                                components={{
                                    p: ({ node, ...props }) => <span {...props} />
                                }}
                            >
                                {currentQuestion.questionText}
                            </ReactMarkdown>
                        </div>
                        {currentQuestion.options.map((option, i) => (
                            <label
                                key={i}
                                className={`option-label ${selectedOption === option ? "selected" : ""}`}
                            >
                                <input
                                    type="radio"
                                    name={`question-${currentQuestionIndex}`}
                                    value={option}
                                    checked={selectedOption === option}
                                    onChange={() => handleOptionSelect(option)}
                                />
                                <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                    <span><strong>{String.fromCharCode(65 + i)}.</strong></span><span><ReactMarkdown>{option}</ReactMarkdown></span>
                                </span>
                            </label>
                        ))}
                    </div>
                    <div className="tqp-lower-quiz-2">
                        <button
                            className="next-btn"
                            onClick={handleNextQuestion}
                            disabled={isSubmitting}
                            style={{ opacity: isSubmitting ? 0.6 : 1, cursor: isSubmitting ? 'not-allowed' : 'pointer' }}
                        >
                            {currentQuestionIndex === selectedQuestions.length - 1
                                ? isSubmitting ? "Submitting" : "Submit Quiz"
                                : "Next"}
                        </button>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default TakeQuizPage
