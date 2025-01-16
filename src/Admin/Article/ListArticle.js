import AdminLayout from "../../layouts/AdminLayout";
import Domain from "../../Api/Api";
import { AuthToken } from "../../Api/Api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faSearch,
  faFilter,
  faEye,
  faHeart,
  faComments,
  faTrash,
  faPen,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import Loading from "../../layouts/Loading";

function ArticlesData({
  articlesData,
  currentPage,
  itemsPerPage,
  setArticlesData,
}) {
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const articlesToDisplay = articlesData.slice(startIndex, endIndex);

  const handleDelete = (articleId) => {
    axios
      .get(`${Domain()}/article/${articleId}`, {
        headers: {
          Authorization: "Bearer " + AuthToken(),
        },
      })
      .then((response) => {
        const articleData = response.data;
        Swal.fire({
          icon: "warning",
          title: "Are you sure you want to delete this article?",
          html: `
            <div>ID: ${articleData.id}</div>
            <div>Picture: <img style="width:200px;height:100px" src="${articleData.picture}" alt="Article Image" /></div>
            <div>Title: ${articleData.title}</div>
            <div>Created At: ${articleData.created_at}</div>
          `,
          showCancelButton: true,
          confirmButtonText: "Delete",
          confirmButtonColor: "#d33",
          cancelButtonText: "Cancel",
        }).then((result) => {
          if (result.isConfirmed) {
            axios
              .delete(`${Domain()}/Articles/${articleId}`, {
                headers: {
                  Authorization: "Bearer " + AuthToken(),
                },
              })
              .then(() => {
                const updatedArticlesData = articlesData.filter(
                  (article) => article.id !== articleId
                );
                setArticlesData(updatedArticlesData);
                Swal.fire(
                  "Deleted!",
                  "Your article has been deleted.",
                  "success"
                );
              })
              .catch((error) => {
                console.error("Error deleting article:", error);
                Swal.fire(
                  "Error",
                  "An error occurred while deleting the article",
                  "error"
                );
              });
          }
        });
      })
      .catch((error) => {
        console.error("Error fetching article details:", error);
        Swal.fire(
          "Error",
          "An error occurred while fetching article details",
          "error"
        );
      });
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Articles</h1>
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="w-1/5 py-2">Title</th>
              <th className="w-1/5 py-2">Type</th>
              <th className="w-1/5 py-2">Created At</th>
              <th className="w-1/5 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {articlesToDisplay.map((article) => (
              <tr key={article.id} className="text-center border-b">
                <td className="py-2 truncate">{article.title}</td>
                <td className="py-2">{article.type}</td>
                <td className="py-2">
                  {new Date(article.createdAt).toLocaleString()}
                </td>
                <td className="py-2 flex justify-around">
                  <Link to={`/Admin/Articles/${article.id}`}>
                    <FontAwesomeIcon className="text-green-500" icon={faEye} />
                  </Link>
                  <FontAwesomeIcon
                    onClick={() => handleDelete(article.id)}
                    className="text-red-500 cursor-pointer"
                    icon={faTrash}
                  />
                  <Link to={`/Admin/Articles/Update/${article.id}`}>
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

function Articles() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [articlesData, setArticlesData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedSort, setSelectedSort] = useState("default");

  useEffect(() => {
    axios
      .get(`${Domain()}/articles`, {
        headers: {
          Authorization: "Bearer " + AuthToken(),
        },
      })
      .then((response) => {
        if (response.data.status === "Articles retrieved successfully") {
          setArticlesData(response.data.data); // Adjusted to handle new API response structure
        } else {
          console.error("Failed to fetch articles data:", response.data.status);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, []);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredArticles = articlesData.filter((article) =>
    article.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleFilter = () => {
    let sortedArticles = [...articlesData];
    switch (selectedSort) {
      case "newest":
        sortedArticles.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        break;
      case "oldest":
        sortedArticles.sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        );
        break;
      default:
        break;
    }
    setArticlesData(sortedArticles);
  };

  const totalPages = Math.ceil(filteredArticles.length / itemsPerPage);

  const ArticlesContent = (
    <div className="p-4">
      {loading ? (
        <Loading />
      ) : (
        <>
          <div className="flex justify-between mb-4">
            <Link
              to="/Admin/Article/New"
              className="bg-indigo-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-indigo-600"
            >
              <FontAwesomeIcon icon={faPlus} /> New Article
            </Link>
            <div className="flex items-center bg-white border rounded-lg shadow-md px-4 py-2">
              <FontAwesomeIcon
                icon={faSearch}
                className="text-indigo-500 mr-2"
              />
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={handleSearchChange}
                className="outline-none bg-transparent"
              />
              {searchQuery && (
                <FontAwesomeIcon
                  icon={faTimes}
                  onClick={() => setSearchQuery("")}
                  className="text-gray-400 ml-2 cursor-pointer"
                />
              )}
            </div>
            <div className="flex items-center bg-white border rounded-lg shadow-md px-4 py-2">
              <FontAwesomeIcon
                icon={faFilter}
                className="text-indigo-500 mr-2"
              />
              <select
                value={selectedSort}
                onChange={(e) => setSelectedSort(e.target.value)}
                className="outline-none bg-transparent"
              >
                <option value="default">Default</option>
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
              </select>
              <button
                onClick={handleFilter}
                className="ml-2 bg-indigo-500 text-white px-4 py-1 rounded-lg hover:bg-indigo-600"
              >
                Filter
              </button>
            </div>
          </div>
          <ArticlesData
            articlesData={filteredArticles}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            setArticlesData={setArticlesData}
          />
          <div className="flex justify-center mt-4">
            {totalPages > 1 && currentPage > 1 && (
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                className="mr-2 bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400"
              >
                Previous
              </button>
            )}
            <span>
              Page {currentPage} of {totalPages}
            </span>
            {totalPages > 1 && currentPage < totalPages && (
              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                className="ml-2 bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400"
              >
                Next
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );

  return <AdminLayout Content={ArticlesContent} />;
}

export default Articles;
