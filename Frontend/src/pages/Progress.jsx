import React, { useContext, useEffect, useState } from "react";
import '../styles/Progress.css';
import Loader from '../components/Loader';
import NotFound from '../components/NotFound';
import { AppContext } from "../context/AppContext";
import axios from "axios";


const Progress = () => {

  const { userData, getUserData, backendUrl } = useContext(AppContext);
  const [selectedLanguage, setSelectedLanguage] = useState("All");
  const [quizTemplates, setQuizTemplates] = useState([]);
  const [badgesCount, setBadgesCount] = useState([]);
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

  const quizzesTaken = userData?.quizzesTaken || [];
  const userName = userData?.name || "User";

  useEffect(() => {
    if (quizzesTaken.length > 0) {
      const languageSet = new Set(quizzesTaken.map((q) => q.title));
      const languages = ["All", ...Array.from(languageSet)];
      setQuizTemplates(languages);
      setSelectedLanguage("All");
    }
  }, [quizzesTaken]);

  useEffect(() => {
    adjustWidth();
  }, [selectedLanguage]);

  const adjustWidth = () => {
    const select = document.getElementById("language");
    const span = document.getElementById("widthCalculator");
    if (select && span) {
      span.innerText = selectedLanguage;
      select.style.width = span.offsetWidth + 30 + "px";
    }
  };

  const filteredQuizzes = selectedLanguage === "All"
    ? quizzesTaken
    : quizzesTaken.filter((quiz) => quiz.title === selectedLanguage);

  useEffect(() => {
    const fetchBadges = async () => {
      try {
        setLoading(true);
        setError(false);
        axios.defaults.withCredentials = true;
        const { data } = await axios.get(`${backendUrl}/api/user/badges`);

        if (data.success) {
          setBadgesCount(data.badgesCount);
        } else {
          setError(true);
        }

      } catch (error) {
        console.error("Error fetching badges : ", error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchBadges();
  }, []);


  if (loading) return <Loader />;
  if (error) return <NotFound text="Error fetching progress" />;


  return (
    <div className='progress-main'>

      <div className="progress-main-title">{userName}'s Progress</div>

      <div className="totalQuizzesTaken">
        <span id="colorChange1Progress">●</span>&nbsp;&nbsp;&nbsp;&nbsp;
        <span id="totalQuizzesTaken">Total Quizzes Taken : {quizzesTaken.length}</span>
        &nbsp;&nbsp;&nbsp;&nbsp;<span id="colorChange2Progress">●</span>
      </div>

      <div className="totalBadgesEarned">
        <span id="colorChange2Progress">●</span>&nbsp;&nbsp;&nbsp;&nbsp;
        <span id="totalBadgesEarned">Total Badges Earned : {badgesCount}</span>
        &nbsp;&nbsp;&nbsp;&nbsp;<span id="colorChange1Progress">●</span>
      </div>

      <div className="language-container">
        <label id="label" htmlFor="language">Select Topic:</label>
        <select
          id="language"
          value={selectedLanguage}
          onChange={(e) => setSelectedLanguage(e.target.value)}
        >
          {quizTemplates.map((lang, idx) => (
            <option key={idx} value={lang}>{lang}</option>
          ))}
        </select>
        <span id="widthCalculator">{selectedLanguage}</span>
      </div>

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
          {filteredQuizzes.length === 0 ? (
            <tr>
              <td colSpan="7">No quizzes taken yet.</td>
            </tr>
          ) : (
            filteredQuizzes.map((quiz, index) => (
              <tr key={index}>
                <td>{quiz.title}</td>
                <td>{quiz.category}</td>
                <td>{quiz.level}</td>
                <td>{quiz.mode}</td>
                <td>{quiz.questionsCount}</td>
                <td>{quiz.score}</td>
                <td>{quiz.badgeEarned ? "Yes" : "No"}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Progress
