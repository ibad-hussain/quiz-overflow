import React, { useState, useEffect, useContext } from 'react';
import '../styles/CreateQuiz.css';
import Loader from '../components/Loader';
import NotFound from '../components/NotFound';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { toastOptions } from "../utils/toastConfig";


const CreateQuiz = () => {

  const { getUserData, backendUrl } = useContext(AppContext);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const [formData, setFormData] = useState({
    title: '',
    category: '',
    level: '',
    mode: '',
    questionsCount: '',
    scoreForBadge: '',
    questions: [{ questionText: '', options: ['', '', '', ''], correctAnswer: '' }],
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = [...formData.questions];
    if (field === 'questionText' || field === 'correctAnswer') {
      updatedQuestions[index][field] = value;
    } else {
      updatedQuestions[index].options[field] = value;
    }
    setFormData({ ...formData, questions: updatedQuestions });
  };

  const addQuestion = () => {
    setFormData({
      ...formData,
      questions: [...formData.questions, { questionText: '', options: ['', '', '', ''], correctAnswer: '' }],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    for (const [i, q] of formData.questions.entries()) {
      if (
        !q.questionText ||
        !q.options.every(opt => opt.trim() !== '') ||
        !q.correctAnswer
      ) {
        toast.error(`Please fill all fields for question ${i + 1}`, toastOptions);
        return;
      }
      
      if (!q.options.includes(q.correctAnswer)) {
        toast.error(`Correct answer must be one of the options for question ${i + 1}`, toastOptions);
        return;
      }
    }

    setIsSubmitting(true);

    try {
      const formDataToSend = {
        ...formData,
        questionsCount: Number(formData.questionsCount),
        scoreForBadge: Number(formData.scoreForBadge),
      };
      const { data } = await axios.post(`${backendUrl}/api/admin/create-quiz`, formDataToSend);

      if (data.success) {
        toast.success('Quiz created successfully', toastOptions);
        setFormData({
          title: '',
          category: '',
          level: '',
          mode: '',
          questionsCount: '',
          scoreForBadge: '',
          questions: [{ questionText: '', options: ['', '', '', ''], correctAnswer: '' }],
        });
      }

    } catch (error) {
      console.error('Error creating quiz :', error);
      toast.error('Error creating quiz', toastOptions);
    } finally {
      setIsSubmitting(false);
    }
  };


  if (loading) return <Loader />;
  if (error) return <NotFound text="Error fetching Quiz Creation page" />;


  return (
    <div className="createQuiz-main">

      <div className="createQuiz-title">Create New Quiz</div>

      <div className="createQuiz-container">
        <form onSubmit={handleSubmit}>

          <div className="formDetails">Details</div>
          <div className="details-block">
            <input type="text" name="title" placeholder="Title" value={formData.title} onChange={handleInputChange} required />
            <input type="text" name="category" placeholder="Category" value={formData.category} onChange={handleInputChange} required />
            <input type="text" name="level" placeholder="Level" value={formData.level} onChange={handleInputChange} required />
            <input type="text" name="mode" placeholder="Mode" value={formData.mode} onChange={handleInputChange} required />
            <input type="number" name="questionsCount" min="1" placeholder="Questions Count" value={formData.questionsCount} onChange={handleInputChange} required />
            <input type="number" name="scoreForBadge" min="1" placeholder="Score for Badge" value={formData.scoreForBadge} onChange={handleInputChange} required />
          </div>

          <div className="formQuestions">Questions</div>
          {formData.questions.map((q, index) => (
            <div key={index} className="questions-block">
              <input
                type="text"
                placeholder={`Question ${index + 1}`}
                value={q.questionText}
                onChange={(e) => handleQuestionChange(index, 'questionText', e.target.value)}
                id='questionText'
                required
              />
              {q.options.map((opt, i) => (
                <input
                  key={i}
                  type="text"
                  placeholder={`Option ${i + 1}`}
                  value={opt}
                  onChange={(e) => handleQuestionChange(index, i, e.target.value)}
                  required
                />
              ))}
              <input
                type="text"
                placeholder="Correct Answer"
                value={q.correctAnswer}
                onChange={(e) => handleQuestionChange(index, 'correctAnswer', e.target.value)}
                required
              />
            </div>
          ))}

          <div className="createQuiz-main-btns">
            <button type="button" id='addQuestion' onClick={addQuestion}>Add Question</button>
            <button
              type="submit"
              id='createQuiz'
              disabled={isSubmitting}
              style={{ opacity: isSubmitting ? 0.6 : 1, cursor: isSubmitting ? 'not-allowed' : 'pointer' }}
            >
              {isSubmitting ? 'Creating' : 'Create Quiz'}
            </button>
          </div>

        </form>
      </div>

    </div>
  )
}

export default CreateQuiz
