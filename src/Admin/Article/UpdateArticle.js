import AdminLayout from "../../layouts/AdminLayout";
import axios from "axios";
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Swal from "sweetalert2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faSave } from "@fortawesome/free-solid-svg-icons";
import Domain from "../../Api/Api";
import { AuthToken } from "../../Api/Api";
import Loading from "../../layouts/Loading";

function GetArticle() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    content: "",
    type: "",
    pictures: [],
    thumbnail: null,
    linkDownload: "",
  });

  useEffect(() => {
    axios
      .get(`${Domain()}/admin/content/${id}`, {
        headers: { Authorization: "Bearer " + AuthToken() },
      })
      .then((response) => {
        const article = response.data.data;
        setFormData({
          title: article.title,
          subtitle: article.subtitle || "",
          content: article.body,
          type: article.type,
          pictures: article.images || [],
          thumbnail: article.thumbnail || null,
          linkDownload: article.linkDownload || "",
        });
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching article data:", error);
        setLoading(false);
      });
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const { name } = e.target;
    const files =
      name === "pictures" ? Array.from(e.target.files) : e.target.files[0];
    setFormData({ ...formData, [name]: files });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    Swal.fire({
      icon: "question",
      title: "Are you sure you want to update this article?",
      confirmButtonText: "Yes, Update",
      showCancelButton: true,
      preConfirm: () => {
        const payload = new FormData();
        Object.keys(formData).forEach((key) => {
          if (key === "pictures" && formData.pictures.length > 0) {
            formData.pictures.forEach((file) =>
              payload.append("pictures", file)
            );
          } else if (key === "thumbnail" && formData.thumbnail) {
            payload.append("thumbnail", formData.thumbnail);
          } else {
            payload.append(key, formData[key]);
          }
        });

        return axios.put(`${Domain()}/admin/content/${id}`, payload, {
          headers: {
            Authorization: "Bearer " + AuthToken(),
            "Content-Type": "multipart/form-data",
          },
        });
      },
    })
      .then(() =>
        Swal.fire("Updated!", "The article has been updated.", "success")
      )
      .catch((error) => {
        console.error("Error updating article:", error);
        Swal.fire(
          "Error",
          "An error occurred while updating the article.",
          "error"
        );
      });
  };

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <div className="container mx-auto p-4">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">Edit Article</h1>
            <Link
              to="/Admin/Articles"
              className="bg-gray-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-gray-600"
            >
              <FontAwesomeIcon icon={faArrowLeft} /> Back
            </Link>
          </div>
          <form
            onSubmit={handleSubmit}
            className="bg-white shadow-md rounded-lg p-6"
          >
            {/* Title Input */}
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">
                Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-400"
                required
              />
            </div>
            {/* Subtitle Input */}
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">
                Subtitle
              </label>
              <input
                type="text"
                name="subtitle"
                value={formData.subtitle}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>
            {/* Content Textarea */}
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">
                Content
              </label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-400"
                rows="6"
                required
              ></textarea>
            </div>
            {/* type Input */}
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">type</label>
              <input
                type="text"
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>
            {/* Pictures Upload */}
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">
                Pictures
              </label>
              <input
                type="file"
                name="pictures"
                onChange={handleFileChange}
                multiple
                className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-400"
              />
              <div className="grid grid-cols-3 gap-4 mt-4">
                {formData.pictures.map((image, index) => (
                  <img
                    key={index}
                    src={
                      typeof image === "string"
                        ? image
                        : URL.createObjectURL(image)
                    }
                    alt={`Preview ${index + 1}`}
                    className="w-full h-32 object-cover rounded-md"
                  />
                ))}
              </div>
            </div>
            {/* Thumbnail Upload */}
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">
                Thumbnail
              </label>
              <input
                type="file"
                name="thumbnail"
                onChange={handleFileChange}
                className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>
            {/* Download Link */}
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">
                Download Link
              </label>
              <input
                type="text"
                name="linkDownload"
                value={formData.linkDownload}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>
            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-indigo-500 text-white px-6 py-2 rounded-lg shadow-md hover:bg-indigo-600"
              >
                <FontAwesomeIcon icon={faSave} /> Update
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}

function UpdateArticle() {
  return <AdminLayout Content={<GetArticle />} />;
}

export default UpdateArticle;
