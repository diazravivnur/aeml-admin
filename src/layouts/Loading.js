import Swal from "sweetalert2";

function Loading() {
  Swal.fire({
    title: "Loading...",
    allowOutsideClick: false,
    didOpen: () => {
      Swal.showLoading();
    },
  });

  return null; // Prevents rendering anything in JSX
}

export default Loading;
