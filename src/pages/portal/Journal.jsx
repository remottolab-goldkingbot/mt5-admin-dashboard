import { useAuth } from "../../context/AuthContext";
import JournalFree from "./JournalFree";
import JournalPro from "./JournalPro";
import JournalWelcomeModal from "./JournalWelcomeModal";

function Journal() {
  const { user } = useAuth();
  const isPro = user?.membership === "pro";

  return (
    <>
      <JournalWelcomeModal />
      {isPro ? <JournalPro /> : <JournalFree />}
    </>
  );
}

export default Journal;
