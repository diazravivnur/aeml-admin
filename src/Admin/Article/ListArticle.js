import AdminLayout from "../../layouts/AdminLayout";
import Domain from "../../Api/Api";
import { AuthToken } from "../../Api/Api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faSearch,
  faFilter,
  faEye,
  faPen,
} from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import Loading from "../../layouts/Loading";

const TYPES = {
  ARTICLE: "article",
  PROGRAM: "program",
  PUBLICATION: "publication",
  INSIGHT: "insight",
  "ABOUT-US": "about-us",
};

function ArticlesData({ articlesData }) {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Articles</h1>
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="w-1/5 py-2">Title</th>
              <th className="w-1/5 py-2">Type</th>
              <th className="w-1/5 py-2">Is Showed</th>
              <th className="w-1/5 py-2">Is Deleted</th>
              <th className="w-1/5 py-2">Created At</th>
              <th className="w-1/5 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {articlesData.map((article) => (
              <tr key={article.id} className="text-center border-b">
                <td className="py-2 truncate">{article.title}</td>
                <td className="py-2">{article.type}</td>
                <td className="py-2">{article.isShowed ? "Yes" : "No"}</td>
                <td className="py-2">{article.isDeleted ? "Yes" : "No"}</td>
                <td className="py-2">
                  {new Date(
                    article.created_at || article.createdAt
                  ).toLocaleString()}
                </td>
                <td className="py-2 flex justify-around">
                  <Link to={`/Admin/Articles/${article.id}`}>
                    <FontAwesomeIcon className="text-green-500" icon={faEye} />
                  </Link>
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
  const [articlesData, setArticlesData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState("");
  const [isDeletedFilter, setIsDeletedFilter] = useState("");
  const [isShowedFilter, setIsShowedFilter] = useState("");

  useEffect(() => {
    axios
      .get(`${Domain()}/admin/all-contents`, {
        headers: {
          Authorization: "Bearer " + AuthToken(),
        },
      })
      .then((response) => {
        if (response.data.statusCode === 200) {
          setArticlesData(response.data.data);
        } else {
          console.error(
            "Failed to fetch articles data:",
            response.data.message
          );
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

  const filteredArticles = articlesData.filter((article) => {
    const matchesSearch = article.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesType = selectedType
      ? article.type?.toLowerCase() === selectedType.toLowerCase()
      : true;
    const matchesIsDeleted =
      isDeletedFilter !== ""
        ? article.isDeleted === (isDeletedFilter === "true")
        : true;
    const matchesIsShowed =
      isShowedFilter !== ""
        ? article.isShowed === (isShowedFilter === "true")
        : true;

    return matchesSearch && matchesType && matchesIsDeleted && matchesIsShowed;
  });

  const ArticlesContent = (
    <div className="p-4">
      {loading ? (
        <Loading />
      ) : (
        <>
          <div className="flex justify-between mb-4">
            <Link
              to="/Admin/Articles/New"
              className="bg-indigo-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-indigo-600"
            >
              <FontAwesomeIcon icon={faPlus} /> New Article
            </Link>
            <div className="flex items-center space-x-4">
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={handleSearchChange}
                className="border px-2 py-1 rounded-md"
              />
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="border px-2 py-1 rounded-md"
              >
                <option value="">All Types</option>
                {Object.entries(TYPES).map(([key, value]) => (
                  <option key={key} value={value}>
                    {key}
                  </option>
                ))}
              </select>

              <select
                value={isDeletedFilter}
                onChange={(e) => setIsDeletedFilter(e.target.value)}
                className="border px-2 py-1 rounded-md"
              >
                <option value="">All</option>
                <option value="true">Deleted</option>
                <option value="false">Not Deleted</option>
              </select>
              <select
                value={isShowedFilter}
                onChange={(e) => setIsShowedFilter(e.target.value)}
                className="border px-2 py-1 rounded-md"
              >
                <option value="">All</option>
                <option value="true">Showed</option>
                <option value="false">Not Showed</option>
              </select>
            </div>
          </div>
          <ArticlesData articlesData={filteredArticles} />
        </>
      )}
    </div>
  );

  return <AdminLayout Content={ArticlesContent} />;
}

export default Articles;
