// src/components/Questions/Questions.js
import AdminLayout from "../../layouts/AdminLayout";
import ApiService from "../Services/ApiService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faEye, faPen } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import moment from "moment";
import Loading from "../../layouts/Loading";

function QuestionsData({ questions }) {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Questions</h1>
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="w-2/5 py-2">Question</th>
              <th className="w-1/5 py-2">Answers</th>
              <th className="w-1/5 py-2">Created</th>
              <th className="w-1/5 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {questions.map((q) => (
              <tr key={q.id} className="text-center border-b">
                <td className="py-2 max-w-[300px] truncate">{q.question}</td>
                <td className="py-2">{q.answers?.length || 0}</td>
                <td className="py-2">
                  {moment(q.createdAt).format("MMM D, YYYY h:mm A")}
                </td>
                <td className="py-2 flex justify-around">
                  <Link to={`/Admin/Questions/${q.id}`}>
                    <FontAwesomeIcon className="text-green-500" icon={faEye} />
                  </Link>
                  <Link to={`/Admin/Questions/Update/${q.id}`}>
                    <FontAwesomeIcon className="text-yellow-500" icon={faPen} />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Questions() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Loading();
    ApiService.fetchList("questions")
      .then((data) => {
        setQuestions(Array.isArray(data) ? data : data.data);
      })
      .catch(() => Swal.fire("Error", "Failed to fetch questions", "error"))
      .finally(() => {
        Swal.close();
        setLoading(false);
      });
  }, []);

  const QuestionsContent = (
    <div className="p-4">
      {loading ? (
        Loading()
      ) : (
        <>
          <div className="flex justify-between mb-4">
            {/* New Question Button */}
            <Link
              to="/Admin/Questions/New"
              className="bg-indigo-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-indigo-600"
            >
              <FontAwesomeIcon icon={faPlus} /> New Question
            </Link>
          </div>
          <QuestionsData questions={questions} />
        </>
      )}
    </div>
  );

  return <AdminLayout Content={QuestionsContent} />;
}

export default Questions;
