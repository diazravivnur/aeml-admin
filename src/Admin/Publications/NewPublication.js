import NewArticle from "../Article/NewArticle";
import { useLocation } from "react-router-dom";

function NewPublication() {
  const location = useLocation();
  const state = { ...(location.state || {}), initialType: "publication" };
  // Reuse NewArticle form with preselected type via location state
  return <NewArticle location={{ state }} />;
}

export default NewPublication;
