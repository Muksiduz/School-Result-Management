import MarksFilter from "../../components/marks/MarksFilter";
import MarksTable from "../../components/marks/MarksTable";

import { marksData } from "../../data/marks";

function MarksPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Marks Entry</h1>

        <p className="text-gray-500 mt-2">Enter and update student marks</p>
      </div>

      <MarksFilter />

      <div className="mt-8">
        <MarksTable marks={marksData} />
      </div>

      <div className="mt-6 flex gap-4">
        <button
          className="
            bg-blue-600
            text-white
            px-6
            py-3
            rounded-xl
          ">
          Save All Marks
        </button>

        <button
          className="
            bg-green-600
            text-white
            px-6
            py-3
            rounded-xl
          ">
          Generate Results
        </button>
      </div>
    </div>
  );
}

export default MarksPage;
