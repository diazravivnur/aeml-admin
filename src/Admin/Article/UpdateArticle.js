import AdminLayout from "../../layouts/AdminLayout";
import axios from "axios";
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Swal from "sweetalert2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faSave,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import Domain from "../../Api/Api";
import { AuthToken } from "../../Api/Api";
import Loading from "../../layouts/Loading";

function GetArticle() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [removedImages, setRemovedImages] = useState([]);

  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    body: "",
    type: "",
    image: [],
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
          body: article.body,
          type: article.type,
          image: article.images || [],
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
    const files = Array.from(e.target.files);
    setFormData((prev) => ({
      ...prev,
      image: [...prev.image, ...files],
    }));
  };

  const handleRemoveImage = (index) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This image will be removed.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, remove it!",
    }).then((result) => {
      if (result.isConfirmed) {
        const removedImage = formData.image[index];

        // If it's an existing URL, track it for deletion
        if (typeof removedImage === "string") {
          setRemovedImages((prev) => [...prev, removedImage]);
        }

        // Update state to remove the image
        const updatedPictures = formData.image.filter((_, i) => i !== index);
        setFormData({ ...formData, image: updatedPictures });

        Swal.fire("Removed!", "The image has been removed.", "success");
      }
    });
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
          if (key === "image") {
            formData.image.forEach((file) => {
              if (typeof file !== "string") {
                payload.append("image", file);
              }
            });
          } else if (key === "thumbnail" && formData.thumbnail) {
            payload.append("thumbnail", formData.thumbnail);
          } else {
            payload.append(key, formData[key]);
          }
        });

        // Attach removed images as a JSON string
        if (removedImages.length > 0) {
          payload.append("removedImages", JSON.stringify(removedImages));
        }

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
            {/* Body Textarea */}
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">Body</label>
              <textarea
                name="body"
                value={formData.body}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-400"
                rows="6"
                required
              ></textarea>
            </div>
            {/* Type Display */}
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">Type</label>
              <input
                type="text"
                name="type"
                value={formData.type}
                readOnly
                className="w-full px-3 py-2 border rounded-lg bg-gray-100"
              />
            </div>
            {/* Pictures Upload */}
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">
                Images
              </label>
              <input
                type="file"
                name="image"
                onChange={handleFileChange}
                multiple
                className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-400"
              />
              <div className="grid grid-cols-3 gap-4 mt-4">
                {formData.image.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={
                        typeof image === "string"
                          ? image
                          : URL.createObjectURL(image)
                      }
                      alt={`Preview ${index + 1}`}
                      className="w-full h-32 object-cover rounded-md"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-0 right-0 bg-red-600 text-white p-1 rounded-full"
                    >
                      <FontAwesomeIcon icon={faTimes} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
            {/* Thumbnail Upload */}
            {/* <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">
                Thumbnail
              </label>
              <input
                type="file"
                name="thumbnail"
                onChange={handleFileChange}
                className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div> */}
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
