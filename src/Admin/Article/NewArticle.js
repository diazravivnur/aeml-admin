import AdminLayout from "../../layouts/AdminLayout";
import Domain from "../../Api/Api";
import { AuthToken } from "../../Api/Api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSave,
  faArrowLeft,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const TYPES = {
  ARTICLE: "article",
  PORTFOLIO: "portfolio",
};

function NewArticle() {
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [body, setBody] = useState("");
  const [subtitleError, setSubtitleError] = useState("");
  const [titleError, setTitleError] = useState("");
  const [images, setImages] = useState([]); // For multiple images
  const [thumbnail, setThumbnail] = useState(null);
  const [linkDownload, setLinkDownload] = useState("");
  const [type, setType] = useState("");
  const navigate = useNavigate();

  const handleImagesChange = (e) => {
    const files = Array.from(e.target.files); // Convert FileList to Array
    const newImages = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setImages((prevImages) => [...prevImages, ...newImages]); // Append new images
  };

  const handleRemoveImage = (index) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const handleSubtitleChange = (e) => {
    const value = e.target.value;
    if (value.length > 255) {
      setSubtitleError("Subtitle cannot exceed 255 characters.");
    } else {
      setSubtitleError("");
    }
    setSubtitle(value);
  };

  const handleTitleChange = (e) => {
    const value = e.target.value;
    if (value.length > 140) {
      setTitleError("Title cannot exceed 140 characters.");
    } else {
      setTitleError("");
    }
    setTitle(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title || !body || images.length === 0 || !type) {
      Swal.fire("Error", "Please fill in all required fields", "error");
      return;
    }

    if (subtitleError || titleError) {
      Swal.fire("Error", "Please fix the errors before submitting.", "error");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("subtitle", subtitle);
    formData.append("body", body.replace(/\n/g, "<br />"));
    formData.append("type", type);
    images.forEach(({ file }) => formData.append("image", file));
    if (thumbnail) formData.append("thumbnail", thumbnail);
    if (linkDownload) formData.append("linkDownload", linkDownload);

    Swal.fire({
      title: "Saving...",
      text: "Please wait while we save your content.",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    fetch(`${Domain()}/admin/contents`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${AuthToken()}`,
      },
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "Content created successfully") {
          Swal.fire("Success", "Content created successfully!", "success").then(
            () => {
              navigate("/Admin/Articles");
            }
          );
        } else {
          Swal.fire(
            "Error",
            data.message || "Failed to create content",
            "error"
          );
        }
      })
      .catch((error) => {
        console.error("Error creating content:", error);
        Swal.fire(
          "Error",
          "An error occurred while creating the content",
          "error"
        );
      });
  };

  return (
    <AdminLayout
      Content={
        <div className="container mx-auto p-4">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">New Content</h1>
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
                value={title}
                onChange={handleTitleChange}
                className={`w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-400 ${
                  titleError ? "border-red-500" : ""
                }`}
                required
              />
              {titleError && (
                <p className="text-red-500 text-sm mt-1">{titleError}</p>
              )}
            </div>
            {/* Subtitle Input */}
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">
                Subtitle
              </label>
              <input
                type="text"
                value={subtitle}
                onChange={handleSubtitleChange}
                className={`w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-400 ${
                  subtitleError ? "border-red-500" : ""
                }`}
              />
              {subtitleError && (
                <p className="text-red-500 text-sm mt-1">{subtitleError}</p>
              )}
            </div>
            {/* Body Textarea */}
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">Body</label>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-400"
                rows="18"
                required
              ></textarea>
            </div>
            {/* Type Dropdown */}
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-400"
                required
              >
                <option value="" disabled>
                  Select Type
                </option>
                {Object.keys(TYPES).map((key) => (
                  <option key={key} value={TYPES[key]}>
                    {TYPES[key]}
                  </option>
                ))}
              </select>
            </div>
            {/* Images Upload */}
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">
                Images
              </label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImagesChange}
                className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-400"
              />
              <div className="grid grid-cols-3 gap-4 mt-4">
                {images.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={image.preview}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-32 object-cover rounded-md"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-0 right-0 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
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
                accept="image/*"
                onChange={(e) => setThumbnail(e.target.files[0])}
                className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div> */}
            {/* Link Download Input */}
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">
                Link to Download
              </label>
              <input
                type="text"
                value={linkDownload}
                onChange={(e) => setLinkDownload(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>
            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-indigo-500 text-white px-6 py-2 rounded-lg shadow-md hover:bg-indigo-600"
              >
                <FontAwesomeIcon icon={faSave} /> Save
              </button>
            </div>
          </form>
        </div>
      }
    />
  );
}

export default NewArticle;
