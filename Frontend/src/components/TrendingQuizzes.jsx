import React, { useContext } from 'react';
import '../styles/TrendingQuizes.css';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';


const TrendingQuizzes = () => {

    const { isLoggedin } = useContext(AppContext);
    const navigate = useNavigate();

    const handleTrendingQuiz = () => {
        if (isLoggedin) {
            navigate('/quizzes');
        } else {
            navigate('/login');
        }
    };

    return (
        <div className='trendingQuizes-main'>

            <div className="trendingQuizes-title">Trending Quizes</div>

            <div className="quiz-container-1">
                <div className="quiz-container">
                    <div className="quiz-title">
                        <div className="quiz-title-1">JavaScript Intermediate Quiz</div>
                        <div className="quiz-title-2">
                            <button onClick={handleTrendingQuiz}>
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
                        </div>
                    </div>
                    <div className="quiz-ques">💬&nbsp;&nbsp;Which of the following best describes the behavior of <span id='span'>this</span> in JavaScript?</div>
                    <div className="quiz-options">
                        <p>🔴 <span id='span'>this</span> always refers to the global object</p>
                        <p>🟢 <span id='span'>this</span> refers to the object that owns the currently executing function</p>
                        <p>🔴 The value of <span id='span'>this</span> is determined when the function is defined</p>
                        <p>🔴 Arrow functions have the same <span id='span'>this</span> behavior as regular functions</p>
                    </div>
                </div>
            </div>

            <div className="quiz-container-2">
                <div className="quiz-container">
                    <div className="quiz-title">
                        <div className="quiz-title-1">C++ Beginner Quiz</div>
                        <div className="quiz-title-2">
                                <button onClick={handleTrendingQuiz}>
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
                        </div>
                    </div>
                    <div className="quiz-ques">💬&nbsp;&nbsp;Which of the following statements about multiple inheritance in C++ is true?</div>
                    <div className="quiz-options">
                        <p>🟢 It leads to the diamond problem if not handled properly</p>
                        <p>🔴 It is not allowed in C++</p>
                        <p>🔴 It can only be used with abstract classes</p>
                        <p>🔴 It is only supported in C++20 and later</p>
                    </div>
                </div>
            </div>

            <div className="quiz-container-3">
                <div className="quiz-container">
                    <div className="quiz-title">
                        <div className="quiz-title-1">Python Interview Quiz</div>
                        <div className="quiz-title-2">
                                <button onClick={handleTrendingQuiz}>
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
                        </div>
                    </div>
                    <div className="quiz-ques">💬&nbsp;&nbsp;Which of the following is the correct way to open a file for both reading and writing in Python?</div>
                    <div className="quiz-options">
                        <p>🔴 <span id='span'>open('file.txt', 'rw')</span></p>
                        <p>🔴 <span id='span'>open('file.txt', 'r+')</span></p>
                        <p>🔴 <span id='span'>open('file.txt', 'w+')</span></p>
                        <p>🟢 Both (b) and (c)</p>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default TrendingQuizzes
