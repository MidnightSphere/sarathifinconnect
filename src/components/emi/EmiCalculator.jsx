import { useId, useRef, useState } from "react";
import { RotateCcw } from "lucide-react";
import { useLocation } from "react-router-dom";
import { EMI_AMOUNT, EMI_LOANS, EMI_RATE, calcEmi, clamp, inr, toNumber } from "../../data/emi-calculator-data.js";
import { trackAnalyticsEvent } from "../../seo/analytics.js";
import "./EmiCalculator.css";

function initialValues(loan) {
  return {
    amount: String(loan.amount),
    rate: String(loan.rate),
    tenure: String(loan.years),
  };
}

function Slider({ label, min, max, step, value, onChange, minLabel, maxLabel }) {
  const fill = max > min ? ((clamp(value, min, max) - min) / (max - min)) * 100 : 0;
  return (
    <div className="emi-calculator__slider-wrap">
      <input
        className="emi-calculator__slider"
        type="range"
        aria-label={label}
        min={min}
        max={max}
        step={step}
        value={clamp(value, min, max)}
        onChange={(event) => onChange(event.target.value)}
        style={{ "--slider-fill": `${fill}%` }}
      />
      <div className="emi-calculator__range-labels" aria-hidden="true">
        <span>{minLabel}</span><span>{maxLabel}</span>
      </div>
    </div>
  );
}

function EmiCalculatorInstance({
  defaultLoanType = EMI_LOANS[0].id,
  showLoanSelector = true,
  variant = "page",
}) {
  const id = useId();
  const location = useLocation();
  const interactionTracked = useRef(false);
  const startingLoan = EMI_LOANS.find((loan) => loan.id === defaultLoanType) || EMI_LOANS[0];
  const [loanId, setLoanId] = useState(startingLoan.id);
  const [values, setValues] = useState(() => initialValues(startingLoan));
  const loan = EMI_LOANS.find((item) => item.id === loanId) || startingLoan;

  const amount = toNumber(values.amount);
  const rate = toNumber(values.rate);
  const tenure = toNumber(values.tenure);
  const amountValid = Number.isFinite(amount) && amount >= EMI_AMOUNT.min && amount <= EMI_AMOUNT.max;
  const rateValid = Number.isFinite(rate) && rate >= EMI_RATE.min && rate <= loan.maxRate;
  const tenureValid = Number.isFinite(tenure) && tenure >= 1 && tenure <= loan.maxYears;
  const valid = amountValid && rateValid && tenureValid;
  const tenureLabel = tenure === 1 ? "year" : "years";
  const months = (Number.isFinite(tenure) ? tenure : 0) * 12;
  const monthlyEmi = valid ? calcEmi(amount, rate, months) : 0;
  const totalPayment = valid ? Math.round(monthlyEmi * months) : 0;
  const totalInterest = valid ? totalPayment - amount : 0;
  const principalPercent = valid && totalPayment > 0 ? (amount / totalPayment) * 100 : 50;
  const money = (number) => `₹ ${inr.format(Math.round(number))}`;

  const trackInteraction = () => {
    if (interactionTracked.current) return;
    interactionTracked.current = true;
    trackAnalyticsEvent("emi_calculator_interaction", {
      page_path: location.pathname,
    });
  };
  const updateValue = (key, raw) => {
    trackInteraction();
    setValues((current) => ({ ...current, [key]: raw }));
  };
  const changeLoan = (nextId) => {
    const nextLoan = EMI_LOANS.find((item) => item.id === nextId);
    if (!nextLoan) return;
    trackInteraction();
    setLoanId(nextLoan.id);
    setValues(initialValues(nextLoan));
  };
  const reset = () => {
    trackInteraction();
    setValues(initialValues(loan));
  };
  const formatAmount = () => {
    if (amountValid) updateValue("amount", String(Math.round(amount)));
  };
  const formatRate = () => {
    if (rateValid) updateValue("rate", String(Number(rate.toFixed(2))));
  };
  const formatTenure = () => {
    if (tenureValid) updateValue("tenure", String(Math.round(tenure)));
  };
  const onAmountChange = (event) => {
    const digits = event.target.value.replace(/\D/g, "");
    updateValue("amount", digits);
  };
  const onRateChange = (event) => {
    const [whole, ...decimal] = event.target.value.replace(/[^\d.]/g, "").split(".");
    updateValue("rate", decimal.length ? `${whole}.${decimal.join("").slice(0, 2)}` : whole);
  };
  const onEnterBlur = (event) => {
    if (event.key === "Enter") event.currentTarget.blur();
  };

  return (
    <section
      className={`emi-calculator emi-calculator--${variant}`}
      aria-labelledby={`${id}-heading`}
    >
      <header className="emi-calculator__heading">
        <div>
          {variant === "page" && <p className="emi-calculator__eyebrow">PLAN WITH CLARITY</p>}
      {variant === "page" ? (
        <h1 id={`${id}-heading`}>
          Estimate your <span>monthly EMI.</span>
        </h1>
      ) : (
        <h2 id={`${id}-heading`}>
        Estimate your <span>monthly EMI.</span>
        </h2>
      )}
          <p className="emi-calculator__intro">
            Adjust the details to explore an indicative repayment estimate.
          </p>
        </div>
        <button type="button" className="emi-calculator__reset" onClick={reset}>
          <RotateCcw size={15} aria-hidden="true" /> Reset
        </button>
      </header>

      <div className="emi-calculator__panel">
        {showLoanSelector && (
          <div className="emi-calculator__loan-select">
            <label htmlFor={`${id}-loan`}>Loan type</label>
            <select id={`${id}-loan`} value={loanId} onChange={(event) => changeLoan(event.target.value)}>
              {EMI_LOANS.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
            </select>
          </div>
        )}

        <div className="emi-calculator__columns">
          <div className="emi-calculator__inputs">
            <div className="emi-calculator__field-group">
              <label htmlFor={`${id}-amount`}>Loan amount</label>
              <div className="emi-calculator__input">
                <span aria-hidden="true">₹</span>
                <input
                  id={`${id}-amount`}
                  inputMode="numeric"
                  value={Number.isFinite(amount) ? inr.format(amount) : values.amount}
                  onChange={onAmountChange}
                  onBlur={formatAmount}
                  onKeyDown={onEnterBlur}
                  aria-invalid={!amountValid}
                />
              </div>
              <Slider
                label="Loan amount"
                min={EMI_AMOUNT.min}
                max={EMI_AMOUNT.max}
                step={EMI_AMOUNT.step}
                value={Number.isFinite(amount) ? amount : EMI_AMOUNT.min}
                onChange={(value) => updateValue("amount", value)}
                minLabel="₹1 Lakh"
                maxLabel="₹5 Crore"
              />
              {!amountValid && <p className="emi-calculator__error">Enter an amount from ₹1 Lakh to ₹5 Crore.</p>}
            </div>

            <div className="emi-calculator__field-group">
              <label htmlFor={`${id}-rate`}>Interest rate <span>(per annum)</span></label>
              <div className="emi-calculator__input">
                <input
                  id={`${id}-rate`}
                  inputMode="decimal"
                  value={values.rate}
                  onChange={onRateChange}
                  onBlur={formatRate}
                  onKeyDown={onEnterBlur}
                  aria-invalid={!rateValid}
                />
                <span aria-hidden="true">%</span>
              </div>
              <Slider
                label="Annual interest rate"
                min={EMI_RATE.min}
                max={loan.maxRate}
                step={EMI_RATE.step}
                value={Number.isFinite(rate) ? rate : loan.rate}
                onChange={(value) => updateValue("rate", value)}
                minLabel={`${Math.min(loan.minRate, EMI_RATE.min)}%`}
                maxLabel={`${loan.maxRate}%`}
              />
              <p className="emi-calculator__hint">Reference: {loan.rateText}. Monthly references are annualized for this estimate; lender terms vary.</p>
              {!rateValid && <p className="emi-calculator__error">Enter a rate from 0% to {loan.maxRate}% p.a.</p>}
            </div>

            <div className="emi-calculator__field-group">
              <label htmlFor={`${id}-tenure`}>Loan tenure <span>(years)</span></label>
              <div className="emi-calculator__input">
                <input
                  id={`${id}-tenure`}
                  inputMode="numeric"
                  value={values.tenure}
                  onChange={(event) => updateValue("tenure", event.target.value.replace(/\D/g, ""))}
                  onBlur={formatTenure}
                  onKeyDown={onEnterBlur}
                  aria-invalid={!tenureValid}
                />
                <span>Years</span>
              </div>
              <Slider
                label="Loan tenure in years"
                min={1}
                max={loan.maxYears}
                step={1}
                value={Number.isFinite(tenure) ? tenure : 1}
                onChange={(value) => updateValue("tenure", value)}
                minLabel="1 year"
                maxLabel={`${loan.maxYears} years`}
              />
              {!tenureValid && <p className="emi-calculator__error">Enter a tenure from 1 to {loan.maxYears} years.</p>}
            </div>
          </div>

          <aside className="emi-calculator__results" aria-live="polite">
            <p className="emi-calculator__result-context">{loan.category} · {Number.isFinite(rate) ? rate : "—"}% p.a. · {Number.isFinite(tenure) ? tenure : "—"} {tenureLabel}</p>
            <p className="emi-calculator__result-label">Estimated monthly EMI</p>
            <p className="emi-calculator__emi">{valid ? money(monthlyEmi) : "₹ —"}</p>

            <div className="emi-calculator__breakdown">
              <div
                className="emi-calculator__donut"
                role="img"
                aria-label={valid ? `Principal ${money(amount)}, total interest ${money(totalInterest)}` : "EMI breakdown unavailable until inputs are valid"}
                style={{ "--principal-share": `${principalPercent}%` }}
              >
                <span><strong>{valid ? `${Math.round(principalPercent)}%` : "—"}</strong><small>Principal</small></span>
              </div>
              <dl className="emi-calculator__totals">
                <div><dt><i className="emi-calculator__legend emi-calculator__legend--principal" />Principal</dt><dd>{valid ? money(amount) : "₹ —"}</dd></div>
                <div><dt><i className="emi-calculator__legend emi-calculator__legend--interest" />Total interest</dt><dd>{valid ? money(totalInterest) : "₹ —"}</dd></div>
              </dl>
            </div>

            <div className="emi-calculator__total">
              <span>Total payment</span>
              <strong>{valid ? money(totalPayment) : "₹ —"}</strong>
            </div>
            <p className="emi-calculator__disclaimer">
              Estimate only. Actual interest rates, eligibility, fees and repayment terms are set by the lender and depend on your profile. Working-capital facilities may use different repayment schedules.
            </p>
          </aside>
        </div>
      </div>
    </section>
  );
}

export default function EmiCalculator(props) {
  return <EmiCalculatorInstance key={`${props.defaultLoanType || "home-loan"}-${props.showLoanSelector}`} {...props} />;
}
