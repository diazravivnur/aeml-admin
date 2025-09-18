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
  const [originalQuestion, setOriginalQuestion] = useState(""); // Tambahan untuk preview
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    setLoading(true);
    ApiService.fetchItem("questions", id)
      .then((responseData) => {
        console.log("Fetched question data:", responseData);

        // Handle different possible response structures
        const questionData = responseData.data || responseData;
        const questionText =
          questionData.question ||
          questionData.text ||
          questionData.content ||
          questionData.question_text ||
          "";

        console.log("Extracted question text:", questionText);
        setQuestion(questionText);
        setOriginalQuestion(questionText);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to fetch question:", error);
        setLoading(false);
        Swal.fire(
          "Error",
          error.message || "Failed to load question",
          "error"
        ).then(() => {
          navigate("/Admin/Questions");
        });
      });
  }, [id, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!question.trim()) {
      Swal.fire("Error", "Question cannot be empty", "error");
      return;
    }

    if (question.trim() === originalQuestion.trim()) {
      Swal.fire("Info", "No changes detected", "info");
      return;
    }

    setUpdating(true);

    try {
      console.log("Submitting question update:", question.trim());

      // Option 1: Use the specific updateQuestion method
      const response = await ApiService.updateQuestion(id, question.trim());

      // Option 2: Use generic updateItem method with object
      // const response = await ApiService.updateQuestion("questions", id, {
      //   question: question.trim(),
      // });

      console.log("Update successful:", response);

      Swal.fire("Success", "Question updated successfully!", "success").then(
        () => {
          navigate("/Admin/Questions");
        }
      );
    } catch (error) {
      console.error("Update failed:", error);
      Swal.fire("Error", error.message || "Failed to update question", "error");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout
        Content={
          <div className="p-6 bg-white rounded shadow">
            <div className="flex justify-center items-center h-64">
              <div className="text-lg">Loading question...</div>
            </div>
          </div>
        }
      />
    );
  }

  return (
    <AdminLayout
      Content={
        <div className="p-6 bg-white rounded shadow">
          <div className="flex justify-between mb-4">
            <h1 className="text-2xl font-bold">Edit Question</h1>
            <Link
              to="/Admin/Questions"
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors"
            >
              <FontAwesomeIcon icon={faArrowLeft} /> Back
            </Link>
          </div>

          {/* Preview Original Question */}
          <div className="mb-6 p-4 bg-gray-50 rounded border">
            <h2 className="text-sm font-semibold text-gray-600 mb-2">
              Original Question:
            </h2>
            <p className="text-gray-800">
              {originalQuestion || "No original question found"}
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="question"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Edit Question:
              </label>
              <textarea
                id="question"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                rows="5"
                placeholder="Enter your question here..."
                disabled={updating}
                required
              />
              <div className="mt-1 text-sm text-gray-500">
                Characters: {question.length}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={
                  updating || !question.trim() || question === originalQuestion
                }
                className="bg-indigo-500 text-white px-6 py-2 rounded-md hover:bg-indigo-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                <FontAwesomeIcon icon={faSave} />
                {updating ? " Updating..." : " Save Changes"}
              </button>

              <button
                type="button"
                onClick={() => setQuestion(originalQuestion)}
                disabled={updating || question === originalQuestion}
                className="bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                Reset
              </button>
            </div>
          </form>

          {/* Show changes indicator */}
          {question !== originalQuestion && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
              <p className="text-sm text-yellow-800">
                <FontAwesomeIcon icon={faSave} className="mr-1" />
                You have unsaved changes
              </p>
            </div>
          )}
        </div>
      }
    />
  );
}

export default UpdateQuestion;
