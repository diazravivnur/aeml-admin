// src/components/Questions/DetailQuestion.js
import { useParams } from "react-router-dom";
import AdminLayout from "../../layouts/AdminLayout";
import axios from "axios";
import Domain, { AuthToken } from "../../Api/Api";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import moment from "moment";
import * as XLSX from "xlsx";

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

  // Excel download handler
  const handleDownloadExcel = () => {
    if (!question || !question.answers || question.answers.length === 0) {
      Swal.fire("No Data", "No answers available to download", "info");
      return;
    }

    // Prepare data for Excel
    const excelData = question.answers.map((answer, index) => ({
      "No.": index + 1,
      Response: answer.answer,
      "Response date": moment(answer.createdAt).format("MMM D, YYYY h:mm A"),
    }));

    // Create workbook and worksheet
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(excelData);

    // Set column widths
    const colWidths = [
      { wch: 5 }, // No.
      { wch: 50 }, // Response
      { wch: 20 }, // Response date
    ];
    worksheet["!cols"] = colWidths;

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, "Q&A Data");

    // Generate filename with question title and current date
    const questionTitle = question.question
      .substring(0, 30)
      .replace(/[^\w\s]/gi, "");
    const currentDate = moment().format("YYYY-MM-DD");
    const filename = `QA_${questionTitle}_${currentDate}.xlsx`;

    // Download the file
    XLSX.writeFile(workbook, filename);

    Swal.fire("Success", "Excel file downloaded successfully!", "success");
  };

  return (
    <AdminLayout
      Content={
        question && (
          <div className="p-6 bg-white rounded-lg shadow">
            {/* Question */}
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h2 className="text-xl font-bold mb-2">{question.question}</h2>
                <p className="text-gray-500">
                  {moment(question.createdAt).format("MMM D, YYYY h:mm A")}
                </p>
              </div>
              {/* Download Button */}
              {question.answers?.length > 0 && (
                <button
                  onClick={handleDownloadExcel}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 ml-4"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  Download Excel
                </button>
              )}
            </div>

            {/* Answers */}
            <h3 className="text-lg font-semibold mb-2">Response</h3>
            {question.answers?.length > 0 ? (
              <ul>
                {question.answers.map((a, index) => (
                  <li
                    key={a.id}
                    className="border p-3 my-2 rounded flex justify-between items-start"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-gray-600">
                          #{index + 1}
                        </span>
                      </div>
                      <p className="mb-1">{a.answer}</p>
                      <span className="text-sm text-gray-500">
                        {moment(a.createdAt).format("MMM D, YYYY h:mm A")} (
                        {moment(a.createdAt).fromNow()})
                      </span>
                    </div>
                    <button
                      onClick={() => handleDeleteAnswer(a.id)}
                      className="text-red-500 hover:text-red-700 ml-4 p-1"
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
