// src/components/Questions/Questions.js
import AdminLayout from "../../layouts/AdminLayout";
import ApiService from "../Services/ApiService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faEye,
  faPen,
  faToggleOn,
  faToggleOff,
  faFileExcel,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import moment from "moment";
import Loading from "../../layouts/Loading";
import * as XLSX from "xlsx";
import axios from "axios";
import Domain, { AuthToken } from "../../Api/Api";

function QuestionsData({ questions, onToggleStatus }) {
  const handleToggleStatus = async (questionId, currentStatus) => {
    try {
      const result = await Swal.fire({
        title: "Change Status?",
        text: `Are you sure you want to ${
          currentStatus ? "deactivate" : "activate"
        } this question?`,
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Yes, change it!",
        cancelButtonText: "Cancel",
      });

      if (result.isConfirmed) {
        await onToggleStatus(questionId, !currentStatus);
        Swal.fire(
          "Success!",
          `Question has been ${!currentStatus ? "activated" : "deactivated"}.`,
          "success"
        );
      }
    } catch (error) {
      Swal.fire("Error", "Failed to update question status", "error");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Questions</h1>
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="w-2/5 py-2">Question</th>
              <th className="w-1/6 py-2">Response</th>
              <th className="w-1/6 py-2">Status</th>
              <th className="w-1/6 py-2">Created</th>
              <th className="w-1/6 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {questions.map((q) => (
              <tr key={q.id} className="text-center border-b">
                <td className="py-2 max-w-[300px] truncate">{q.question}</td>
                <td className="py-2">{q.answers?.length || 0}</td>
                <td className="py-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      q.isActive !== false // Default to active if undefined
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {q.isActive !== false ? "Active" : "Inactive"}
                  </span>
                </td>
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
                  <button
                    onClick={() =>
                      handleToggleStatus(q.id, q.isActive !== false)
                    }
                    className={`${
                      q.isActive !== false ? "text-green-500" : "text-red-500"
                    } hover:opacity-70`}
                    title={q.isActive !== false ? "Deactivate" : "Activate"}
                  >
                    <FontAwesomeIcon
                      icon={q.isActive !== false ? faToggleOn : faToggleOff}
                    />
                  </button>
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

  const handleToggleStatus = async (questionId, newStatus) => {
    try {
      // Update via your existing PUT endpoint
      await axios.put(
        `${Domain()}/questions/${questionId}`,
        { isActive: newStatus },
        {
          headers: { Authorization: "Bearer " + AuthToken() },
        }
      );

      // Update local state
      setQuestions((prev) =>
        prev.map((q) =>
          q.id === questionId ? { ...q, isActive: newStatus } : q
        )
      );
    } catch (error) {
      throw new Error("Failed to update question status");
    }
  };

  const exportToExcel = () => {
    try {
      // Prepare data for Excel
      const exportData = questions.map((q, index) => ({
        No: index + 1,
        Question: q.question,
        "Response Count": q.answers?.length || 0,
        Status: q.isActive !== false ? "Active" : "Inactive",
        "Created Date": moment(q.createdAt).format("MMM D, YYYY h:mm A"),
        "Updated Date": q.updatedAt
          ? moment(q.updatedAt).format("MMM D, YYYY h:mm A")
          : "N/A",
        Answers: q.answers?.map((a) => a.answer).join(" | ") || "No answers",
      }));

      // Create workbook and worksheet
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(exportData);

      // Set column widths
      const colWidths = [
        { wch: 5 }, // No
        { wch: 50 }, // Question
        { wch: 15 }, // Response Count
        { wch: 10 }, // Status
        { wch: 20 }, // Created Date
        { wch: 20 }, // Updated Date
        { wch: 50 }, // Answers
      ];
      ws["!cols"] = colWidths;

      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(wb, ws, "Questions");

      // Generate filename with current date
      const filename = `Questions_Export_${moment().format(
        "YYYY-MM-DD_HH-mm-ss"
      )}.xlsx`;

      // Write and download file
      XLSX.writeFile(wb, filename);

      Swal.fire({
        title: "Success!",
        text: "Questions data has been exported to Excel",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Export error:", error);
      Swal.fire("Error", "Failed to export data to Excel", "error");
    }
  };

  const QuestionsContent = (
    <div className="p-4">
      {loading ? (
        Loading()
      ) : (
        <>
          <div className="flex justify-between mb-4">
            <div className="flex gap-2">
              {/* New Question Button */}
              <Link
                to="/Admin/Questions/New"
                className="bg-indigo-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-indigo-600 flex items-center gap-2"
              >
                <FontAwesomeIcon icon={faPlus} /> New Question
              </Link>

              {/* Export to Excel Button */}
              <button
                onClick={exportToExcel}
                className="bg-green-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-600 flex items-center gap-2"
              >
                <FontAwesomeIcon icon={faFileExcel} /> Export to Excel
              </button>
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">
                Total: {questions.length} | Active:{" "}
                {questions.filter((q) => q.isActive !== false).length} |
                Inactive: {questions.filter((q) => q.isActive === false).length}
              </span>
            </div>
          </div>
          <QuestionsData
            questions={questions}
            onToggleStatus={handleToggleStatus}
          />
        </>
      )}
    </div>
  );

  return <AdminLayout Content={QuestionsContent} />;
}

export default Questions;
