import AdminLayout from "../../layouts/AdminLayout";
import axios from "axios";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";
import Domain from "../../Api/Api";
import { AuthToken } from "../../Api/Api";
import Loading from "../../layouts/Loading";

function GetArticle() {
  // Get the value of the "id" parameter from the URL
  const { id } = useParams();
  const articleId = id;
  const [articleData, setArticleData] = useState({});
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: "",
    picture: "",
    content: "",
    category: "",
    linkDownload: "",
  });

  useEffect(() => {
    // Fetch the article data based on articleId
    axios
      .get(`${Domain()}/articles/${articleId}`, {
        headers: {
          Authorization: "Bearer " + AuthToken(), // Include the token here
        },
      })
      .then((response) => {
        const article = response.data.data; // Access the first article from the array

        setArticleData(article);

        // Set initial form data after receiving the response
        setFormData({
          title: article.title,
          picture: article.image || "", // Use image field for picture
          content: article.body,
          category: article.type, // Assuming 'type' is for the category
          linkDownload: article.linkDownload, // Add the download link
        });

        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching article data:", error);
        setLoading(false);
      });
  }, [articleId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    Swal.fire({
      icon: "question",
      title: "Are you sure you want to update this article?",
      html: `
        New Title: ${formData.title}<br>
        New Picture: ${formData.picture}<br>
        New Content: ${formData.content}<br>
        New Category: ${formData.category}<br>
        New Download Link: ${formData.linkDownload}
      `,
      showDenyButton: false,
      showCancelButton: true,
      confirmButtonText: "Yes, Update",
      confirmButtonColor: "#F53D65",
      denyButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .put(`${Domain()}/articles/${articleId}`, formData, {
            headers: {
              Authorization: "Bearer " + AuthToken(),
            },
          })
          .then((updateResponse) => {
            Swal.fire("Update!", "", "success");
          })
          .catch((error) => {
            console.error("Error updating article:", error);
            Swal.fire(
              "Error",
              "An error occurred while updating the article, try again",
              "error"
            );
          });
      } else if (result.isDenied) {
        Swal.fire("Cancelled", "", "info");
      }
    });
  };

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <div className="shadow-md flex-row px-5 items-center mt-5 pl-8 pt-4 pb-4 mb-4 justify-center rounded-lg ml-10 bg-white space-y-6">
          <form onSubmit={handleUpdate}>
            <div className="space-y-4">
              <h1 className="text-2xl font-semibold mb-4">
                Title:{" "}
                <input
                  type="text"
                  name="title"
                  className="border-current w-full px-3 py-2 rounded-md"
                  value={formData.title}
                  onChange={handleChange}
                />
              </h1>

              <div className="space-y-2">
                <label className="block text-gray-700">Picture URL: </label>
                <input
                  type="text"
                  name="picture"
                  className="border-current w-full px-3 py-2 rounded-md"
                  value={formData.picture}
                  onChange={handleChange}
                />
                {articleData && articleData.image ? (
                  <img
                    src={articleData.image}
                    alt="Article"
                    className="w-full h-auto mt-2"
                  />
                ) : (
                  <p className="text-gray-500 mt-2">No image available</p>
                )}
              </div>

              <div className="space-y-2">
                <div>
                  <label className="block text-gray-700">Created at: </label>
                  <span>
                    {articleData.createdAt ? articleData.createdAt : "N/A"}
                  </span>
                </div>
                <div>
                  <label className="block text-gray-700">Updated at: </label>
                  <span>
                    {articleData.updatedAt ? articleData.updatedAt : "N/A"}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <div>
                  <label className="block text-gray-700">Category: </label>
                  <input
                    type="text"
                    name="category"
                    className="border-current w-full px-3 py-2 rounded-md"
                    value={formData.category}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div>
                  <label className="block text-gray-700">Content: </label>
                  <textarea
                    value={formData.content}
                    name="content"
                    className="border-current w-full px-3 py-2 rounded-md"
                    cols={60}
                    rows={10}
                    onChange={handleChange}
                  ></textarea>
                </div>
              </div>

              <div className="space-y-2">
                <div>
                  <label className="block text-gray-700">Download Link: </label>
                  <input
                    type="text"
                    name="linkDownload"
                    className="border-current w-full px-3 py-2 rounded-md"
                    value={formData.linkDownload}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="bg-indigo-500 text-white py-2 px-4 rounded-lg hover:bg-indigo-600 transition duration-300 mt-4"
            >
              Update
            </button>
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
