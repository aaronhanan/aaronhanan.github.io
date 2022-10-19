const REACT_APP_URL = "https://app.invoicesimple.com/";

const { useState, useEffect, useCallback } = React;

const MarginCalculator = () => {
  const [laborCosts, setLaborCosts] = useState(0);
  const [materialCosts, setMaterialCosts] = useState(0);
  const [overheadExpenses, setOverheadExpenses] = useState(0);
  const [serviceFee, setServiceFee] = useState(0);
  const [results, setResults] = useState({
    profitMargin: 0,
    profit: 0,
    markup: 0,
  });

  useEffect(() => {
    if (serviceFee && (laborCosts || materialCosts || overheadExpenses)) {
      const expenses = Number(laborCosts + materialCosts + overheadExpenses);
      const profitMargin = Number(
        (((serviceFee - expenses) / serviceFee) * 100).toFixed(2)
      );
      const profit = Number((serviceFee - expenses).toFixed(2));
      const markup = Number(((profit / expenses) * 100).toFixed(2));
      setResults({ ...results, profitMargin, profit, markup });
    }
  }, [laborCosts, materialCosts, overheadExpenses, serviceFee]);

  const redirectToPrefilledInvoice = useCallback(() => {
    window.open(
      `${REACT_APP_URL}/invoices/new?labor-costs=${laborCosts}&material-costs=${materialCosts}`,
      "_blank"
    );
  }, [laborCosts, materialCosts]);

  return (
    <div className="flex justify-center items-center mt-10">
      <div className="flex flex-col w-1/2 mr-10 max-w-md">
        <form>
          <CostInput
            label="Labor costs"
            onChange={setLaborCosts}
            value={laborCosts}
          />
          <CostInput
            label="Material cost"
            onChange={setMaterialCosts}
            value={materialCosts}
          />
          <CostInput
            label="Overhead cost"
            onChange={setOverheadExpenses}
            value={overheadExpenses}
          />
          <CostInput
            label="Service fee"
            onChange={setServiceFee}
            value={serviceFee}
          />
        </form>
      </div>
      <ProfitMargin
        results={results}
        onCreateInvoice={redirectToPrefilledInvoice}
      />
    </div>
  );
};

const ProfitMargin = ({ results, onCreateInvoice }) => {
  return (
    <div className="shadow-md h-fit max-w-lg">
      <div className="px-10 py-7 bg-is-orange flex justify-between gap-12">
        <h1 className="font-semibold text-3xl font-quicksand text-white w-max">
          Profit Margin
        </h1>
        <p className="font-semibold text-3xl font-quicksand text-white">
          {results.profitMargin}%
        </p>
      </div>
      <div className="px-10 py-7">
        <div className="flex justify-between mb-2">
          <h2 className="font-quicksand text-2xl text-is-gray">Profit</h2>
          <p className="font-quicksand text-2xl text-is-gray">
            ${results.profit}
          </p>
        </div>
        <div className="flex justify-between">
          <h2 className="font-quicksand text-2xl text-is-gray">Markup</h2>
          <p className="font-quicksand text-2xl text-is-gray">
            {results.markup}%
          </p>
        </div>
        <p className="text-lg font-quicksand py-7 text-is-gray">
          Send your clients clean, professional invoices that help you get paid
          faster
        </p>
        <div className="flex justify-center mb-4">
          <input
            type="button"
            className="bg-is-orange font-semibold font-quicksand text-sm text-white uppercase py-3 px-12 text-center border hover:border-is-orange hover:bg-white hover:text-is-orange"
            value="Create invoice free"
            onClick={onCreateInvoice}
          />
        </div>
      </div>
    </div>
  );
};

const CostInput = ({ label, value, onChange }) => {
  return (
    <div className="mb-5">
      <label className="form-label inline-block mb-2 text-is-gray text-sm font-inter font-medium">
        {label}
      </label>
      <div className="relative">
        <input
          type="number"
          value={value || ""}
          onKeyPress={validateInput}
          onInput={limitDecimalPlaces}
          onChange={(e) => onChange(Number(e.target.value))}
          className="py-2.5 pl-6 pr-16 block w-full border-gray-400 border-solid border text-is-gray rounded-md font-inter text-sm z-10 focus:border-blue-500 focus:ring-blue-500"
        />
        <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none z-20 pl-4">
          <span className="text-is-gray font-inter text-sm">$</span>
        </div>
        <div className="absolute pointer-events-auto inset-y-0 right-0 flex items-center z-20 pr-4 text-is-gray">
          <div className="group relative inline-block duration-300">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
              />
            </svg>
            <span className="absolute hidden select-none group-hover:flex -left-[85px] -top-2 -translate-y-full w-48 px-2 py-1 shadow-lg bg-white rounded-lg text-center text-is-gray text-xs after:content-[''] after:absolute after:left-1/2 after:top-[100%] after:-translate-x-1/2 after:border-8 after:border-x-transparent after:border-b-transparent after:border-t-white">
              Lorem ipsum dolor sit amet, consectetur adip
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const validateInput = (e) => {
  const maxInputSize = 17;
  const charCode = e.which ?? e.keyCode;

  if (e.target.value.length > maxInputSize) {
    e.preventDefault();
  }

  // allows numbers [0-9] and "." character only
  if (!((charCode >= 48 && charCode <= 57) || charCode === 46)) {
    e.preventDefault();
  }
};

const limitDecimalPlaces = (e) => {
  let limit = 2;

  // returns if no decimal found
  if (e.target.value.indexOf(".") === -1) {
    return;
  }
  // if value already has two decimal places, prevent rounding behavior
  if (e.target.value.length > e.target.value.indexOf(".") + 3) {
    e.target.value = e.target.value.slice(0, -1);
  }
  // round value to fixed decimal places
  if (e.target.value.length - e.target.value.indexOf(".") > limit) {
    e.target.value = parseFloat(e.target.value).toFixed(limit);
  }
};

ReactDOM.render(<MarginCalculator />, document.getElementById("calculator"));
