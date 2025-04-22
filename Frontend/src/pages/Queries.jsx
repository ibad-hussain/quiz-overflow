import React, { useEffect, useState, useContext } from 'react';
import '../styles/Queries.css';
import Loader from '../components/Loader';
import NotFound from '../components/NotFound';
import { AppContext } from '../context/AppContext';
import axios from 'axios';


const Queries = () => {

  const { backendUrl } = useContext(AppContext);
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchQueries = async () => {
    try {
      setLoading(true);
      setError(false);
      axios.defaults.withCredentials = true;
      const res = await axios.get(`${backendUrl}/api/admin/get-contact`);

      if (res.data.success) {
        setQueries(res.data.contacts.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt)));
      } else {
        setError(true);
      }

    } catch (error) {
      console.error('Error fetching contact queries :', error);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueries();
  }, []);


  if (loading) return <Loader />;
  if (error) return <NotFound text="Error fetching contact queries" />;


  return (
    <div className="queries-main">

      <div className="queries-title">All Queries</div>

      {queries.length === 0 ? (
        <p>No contact queries submitted yet.</p>
      ) : (
        queries.map((query, index) => (
          <div className="queries-container" key={index}>
            <div className="query-row">
              <span className="query-label">Contact Name</span>
              <span className="query-colon">:</span>
              <span className="query-value">{query.contactName}</span>
            </div>
            <div className="query-row">
              <span className="query-label">Contact Email</span>
              <span className="query-colon">:</span>
              <span className="query-value">{query.contactEmail}</span>
            </div>
            <div className="query-row">
              <span className="query-label">Contact Query</span>
              <span className="query-colon">:</span>
              <span className="query-value">{query.contactQuery}</span>
            </div>
            <div className="query-row">
              <span className="query-label">Submitted at</span>
              <span className="query-colon">:</span>
              <span className="query-value">{new Date(query.submittedAt).toLocaleString("en-GB", {
                day: "2-digit",
                month: "long",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: true
              })}</span>
            </div>
          </div>
        ))
      )}

    </div>
  )
}

export default Queries
