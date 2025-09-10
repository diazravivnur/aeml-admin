// src/components/Questions/UpdateQuestion.js
import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import AdminLayout from "../../layouts/AdminLayout";
import ApiService from "../Services/ApiService";
import Swal from "sweetalert2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faSave } from "@fortawesome/free-solid-svg-icons";

function UpdateQuestion() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [question, setQuestion] = useState("");

  useEffect(() => {
    ApiService.fetchItem("questions", id)
      .then((q) => {
        // pastikan sesuai dengan nama field di DB/API
        setQuestion(q.question || "");
      })
      .catch((err) => {
        console.error("Failed to fetch question:", err);
        Swal.fire("Error", "Failed to load question", "error");
      });
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("question", question);

    ApiService.updateItem("questions", id, formData)
      .then(() => {
        Swal.fire("Success", "Question updated!", "success").then(() =>
          navigate("/Admin/Questions")
        );
      })
      .catch((err) => {
        console.error("Update error:", err);
        Swal.fire("Error", "Failed to update question", "error");
      });
  };

  return (
    <AdminLayout
      Content={
        <div className="p-6 bg-white rounded shadow">
          <div className="flex justify-between mb-4">
            <h1 className="text-2xl font-bold">Edit Question</h1>
            <Link
              to="/Admin/Questions"
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              <FontAwesomeIcon icon={faArrowLeft} /> Back
            </Link>
          </div>
          <form onSubmit={handleSubmit}>
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="w-full border rounded p-2"
              rows="5"
            />
            <button
              type="submit"
              className="mt-4 bg-indigo-500 text-white px-6 py-2 rounded hover:bg-indigo-600"
            >
              <FontAwesomeIcon icon={faSave} /> Save
            </button>
          </form>
        </div>
      }
    />
  );
}

export default UpdateQuestion;
