// src/components/Questions/DetailQuestion.js
import { useParams } from "react-router-dom";
import AdminLayout from "../../layouts/AdminLayout";
import axios from "axios";
import Domain, { AuthToken } from "../../Api/Api";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import moment from "moment";

function DetailQuestion() {
  const { id } = useParams();
  const [question, setQuestion] = useState(null);

  // fetch question + answers
  const fetchQuestion = () => {
    axios
      .get(`${Domain()}/questions/${id}`, {
        headers: { Authorization: "Bearer " + AuthToken() },
      })
      .then((res) => setQuestion(res.data.data))
      .catch(() => Swal.fire("Error", "Failed to load question", "error"));
  };

  useEffect(() => {
    fetchQuestion();
  }, [id]);

  // delete handler
  const handleDeleteAnswer = (answerId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This answer will be deleted permanently",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`${Domain()}/answers/${answerId}`, {
            headers: { Authorization: "Bearer " + AuthToken() },
          })
          .then(() => {
            Swal.fire("Deleted!", "The answer has been deleted.", "success");
            // refresh answers
            setQuestion((prev) => ({
              ...prev,
              answers: prev.answers.filter((a) => a.id !== answerId),
            }));
          })
          .catch(() =>
            Swal.fire("Error", "Failed to delete the answer", "error")
          );
      }
    });
  };

  return (
    <AdminLayout
      Content={
        question && (
          <div className="p-6 bg-white rounded-lg shadow">
            {/* Question */}
            <h2 className="text-xl font-bold mb-2">{question.question}</h2>
            <p className="text-gray-500 mb-4">
              {moment(question.createdAt).format("MMM D, YYYY h:mm A")}
            </p>

            {/* Answers */}
            <h3 className="text-lg font-semibold mb-2">Answers</h3>
            {question.answers?.length > 0 ? (
              <ul>
                {question.answers.map((a) => (
                  <li
                    key={a.id}
                    className="border p-3 my-2 rounded flex justify-between items-start"
                  >
                    <div>
                      <p className="mb-1">{a.answer}</p>
                      <span className="text-sm text-gray-500">
                        {moment(a.createdAt).fromNow()}
                      </span>
                    </div>
                    <button
                      onClick={() => handleDeleteAnswer(a.id)}
                      className="text-red-500 hover:text-red-700 ml-4"
                    >
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-400">No answers yet</p>
            )}
          </div>
        )
      }
    />
  );
}

export default DetailQuestion;
