import { useAuth } from "../../context/AuthContext";
import JournalFree from "./JournalFree";
import JournalPro from "./JournalPro";

function Journal() {
  const { user } = useAuth();
  const isPro = user?.membership === "pro";

  return isPro ? <JournalPro /> : <JournalFree />;
}

export default Journal;
