import { useParams } from "react-router-dom";
import AdminLayout from "../../layouts/AdminLayout";
import Domain from "../../Api/Api";
import { AuthToken } from "../../Api/Api";
import { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import Loading from "../../layouts/Loading";

function View() {
  // Get the value of the "id" parameter from the URL
  const { id } = useParams();

  // Render the GetArticle component and pass the articleId as a prop
  return <AdminLayout Content={<GetArticle articleId={id} />} />;
}

function GetArticle({ articleId }) {
  const [articleData, setArticleData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${Domain()}/admin/content/${articleId}`, {
        headers: {
          Authorization: `Bearer ${AuthToken()}`,
        },
      })
      .then((response) => {
        if (response.data && response.data.statusCode === 200) {
          setArticleData(response.data.data);
        } else {
          Swal.fire("Error", "Content not found", "error");
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        Swal.fire("Error", "Failed to fetch content", "error");
        setLoading(false);
      });
  }, [articleId]);

  const handleDeleteArticle = (id) => {
    Swal.fire({
      title: "Delete Article",
      text: "Are you sure you want to delete this article?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`${Domain()}/admin/content/${id}`, {
            headers: {
              Authorization: `Bearer ${AuthToken()}`,
            },
          })
          .then((response) => {
            if (response.status === 200) {
              Swal.fire(
                "Article Deleted",
                "The article has been deleted.",
                "success"
              );
              // Optionally handle UI updates after deletion
            }
          })
          .catch((error) => {
            Swal.fire(
              "Error",
              "There was an error deleting the article",
              "error"
            );
          });
      }
    });
  };

  return (
    <>
      {loading ? (
        <Loading />
      ) : articleData ? (
        <div className="shadow-md flex-row px-4 py-6 mt-5 ml-10 rounded-lg bg-white">
          <h1 className="text-2xl font-semibold mb-4">
            Title: {articleData.title}
          </h1>

          {/* Render article images */}
          {articleData.images?.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
              {articleData.images.map((image, index) => (
                <div key={index} className="relative">
                  <img
                    src={image}
                    alt={`Article Image ${index + 1}`}
                    className="w-full h-auto object-cover rounded-lg border"
                  />
                </div>
              ))}
            </div>
          )}

          <div className="mt-2 mb-4">
            <span className="text-gray-600">Created at: </span>
            {new Date(articleData.createdAt).toLocaleString()}
          </div>

          <div className="mt-2 mb-4">
            <span className="text-gray-600">Updated at: </span>
            {new Date(articleData.updatedAt).toLocaleString()}
          </div>

          <div className="mt-2 mb-4">
            <span className="text-gray-600">Type: </span> {articleData.type}
          </div>

          <div className="mt-2 mb-4">
            <span className="text-gray-600">Subtitle: </span>{" "}
            {articleData.subtitle}
          </div>

          <div className="mt-2 mb-4">
            <span className="text-gray-600">body: </span>
            <span dangerouslySetInnerHTML={{ __html: articleData.body }} />
          </div>

          {articleData.linkDownload && (
            <div className="mt-2 mb-4">
              <span className="text-gray-600">Link to Download: </span>
              <a
                href={articleData.linkDownload}
                className="text-blue-500 underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                {articleData.linkDownload}
              </a>
            </div>
          )}

          {/* Render delete functionality */}
          {articleData.isDeleted ? (
            <div className="mt-2 mb-4 text-red-500 text-lg font-bold">
              This content has been deleted
            </div>
          ) : (
            <div className="mt-2 mb-4">
              <FontAwesomeIcon
                className="hover:cursor-pointer text-red-500 text-xl"
                icon={faTrash}
                onClick={() => handleDeleteArticle(articleData.id)}
              />
            </div>
          )}
        </div>
      ) : (
        <div className="text-center text-red-500">Content not found</div>
      )}
    </>
  );
}

export default View;
