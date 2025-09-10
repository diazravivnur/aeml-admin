// src/components/Questions/NewQuestion.js
import { useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import ApiService from "../Services/ApiService";
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faSave } from "@fortawesome/free-solid-svg-icons";

function NewQuestion() {
  const [question, setQuestion] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!question)
      return Swal.fire("Error", "Question text is required", "error");

    const formData = new FormData();
    formData.append("question", question);

    // pastikan ApiService dipakai langsung dengan FormData
    ApiService.createQuestions(question)
      .then((res) => {
        if (res?.statusCode === 201 || res?.id) {
          Swal.fire("Success", "Question created!", "success").then(() =>
            navigate("/Admin/Questions")
          );
        } else {
          throw new Error("Invalid response");
        }
      })
      .catch((err) => {
        console.error("Create error:", err);
        Swal.fire("Error", "Failed to create question", "error");
      });
  };

  return (
    <AdminLayout
      Content={
        <div className="p-6 bg-white rounded shadow">
          <div className="flex justify-between mb-4">
            <h1 className="text-2xl font-bold">New Question</h1>
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
              placeholder="Enter your question"
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

export default NewQuestion;
