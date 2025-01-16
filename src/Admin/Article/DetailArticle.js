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
  const [articleData, setArticleData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Make an API GET request to retrieve the article by articleId
    axios
      .get(`${Domain()}/articles/${articleId}`, {
        headers: {
          Authorization: "Bearer " + AuthToken(), // Include the token here
        },
      })
      .then((response) => {
        console.log(111, response);
        // Update the state with the received data
        setArticleData(response.data.data); // Accessing the article data from the response
        setLoading(false); // Data has been loaded
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false); // Data loading failed
      });
  }, [articleId]); // Include articleId in the dependency array

  // Conditionally render content based on loading state
  return (
    <>
      {loading ? (
        // Show a loading indicator or message
        <Loading />
      ) : (
        <div className="shadow-md flex-row px-1 items-center mt-5 pl-5 pt-2 pb-2 mb-2 justify-center rounded-lg ml-10 bg-white">
          <h1 className="mt-2 mb-2 text-2xl font-semibold">
            Title : {articleData.title}
          </h1>
          <div className="w-2/3">
            {/* Render article image */}
            {articleData.image && (
              <img
                src={articleData.image}
                alt="Article"
                className="w-full h-auto"
              />
            )}
          </div>
          <div className="mt-2 mb-2 max-w-2xl">
            <span className="text-gray-600">Created at : </span>
            {articleData.createdAt}
          </div>
          <div className="mt-2 mb-2 max-w-2xl">
            <span className="text-gray-600">Updated at : </span>
            {articleData.updatedAt}
          </div>
          <div className="mt-2 mb-2 max-w-2xl">
            <span className="text-gray-600">Type : </span> {articleData.type}
          </div>
          <div className="mt-2 mb-2 max-w-2xl">
            <span className="text-gray-600">Subtitle : </span>{" "}
            {articleData.subtitle}
          </div>
          <div className="mt-2 mb-2 max-w-2xl">{articleData.body}</div>
          <div className="mt-2 mb-2 max-w-2xl">
            <span className="text-gray-600">Link to Download : </span>
            <a
              href={articleData.linkDownload}
              className="text-blue-500"
              target="_blank"
              rel="noopener noreferrer"
            >
              {articleData.linkDownload}
            </a>
          </div>

          {/* Render delete functionality if needed */}
          {articleData.isDeleted ? (
            <div className="mt-2 mb-2 max-w-2xl text-red-500 text-lg font-bold">
              This article has been deleted
            </div>
          ) : (
            <>
              {/* Render other actions or content */}
              <div className="mt-2 mb-2 max-w-2xl">
                <FontAwesomeIcon
                  className="hover:cursor-pointer"
                  icon={faTrash}
                  onClick={() => handleDeleteArticle(articleData.id)}
                />
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}

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
      // Make an API call to delete the article
      axios
        .delete(`${Domain()}/articles/${id}`, {
          headers: {
            Authorization: "Bearer " + AuthToken(), // Include the token here
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

export default View;
