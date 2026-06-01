import ResultFilters from "../../components/results/ResultFilters";
import ResultStats from "../../components/results/ResultStats";
import ResultTable from "../../components/results/ResultTable";

import { results } from "../../data/results";

function ResultsPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Results</h1>

        <p className="text-gray-500 mt-2">
          Generate and view examination results
        </p>
      </div>

      <ResultFilters />

      <div className="mt-8">
        <ResultStats />
      </div>

      <div className="mt-8">
        <ResultTable results={results} />
      </div>

      <div className="mt-8 flex gap-4">
        <button
          className="
            bg-blue-600
            text-white
            px-5
            py-3
            rounded-xl
          ">
          Generate Marksheet
        </button>

        <button
          className="
            bg-green-600
            text-white
            px-5
            py-3
            rounded-xl
          ">
          Merit List
        </button>

        <button
          className="
            bg-red-600
            text-white
            px-5
            py-3
            rounded-xl
          ">
          Failed List
        </button>
      </div>
    </div>
  );
}

export default ResultsPage;
