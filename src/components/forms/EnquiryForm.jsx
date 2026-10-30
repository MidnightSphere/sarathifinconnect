import { useMemo, useState } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import { ArrowRight, Check, Loader2 } from "lucide-react";
import { loanServices } from "../../data/loan-services-data";
import { contactInfo } from "../../data/contact";
import { submitEnquiry } from "../../lib/submitEnquiry";

const loanOptions = [
  ...loanServices.map(({ id, name }) => ({ slug: id, label: name })),
  { slug: "other", label: "Other / Not sure" },
];
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function EnquiryForm({
  variant = "general",
  defaultLoan = "",
  source,
  onSuccess,
  className = "",
}) {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const initialLoan =
    defaultLoan ||
    (variant === "general" ? searchParams.get("loan") : "") ||
    "";
  const [values, setValues] = useState({
    name: "",
    phone: "",
    loanType: initialLoan,
    email: "",
    city: "",
    amount: "",
    message: "",
    consent: false,
    company: "",
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);
  const loanLabels = useMemo(
    () =>
      Object.fromEntries(
        loanOptions.map((option) => [option.slug, option.label]),
      ),
    [],
  );
  const loanVariant = variant === "loan";

  function validate(field, current = values) {
    const problem =
      field === "name" && current.name.trim().length < 2
        ? "Enter at least 2 characters."
        : field === "phone" && !/^[6-9]\d{9}$/.test(current.phone)
          ? "Enter a valid 10-digit Indian mobile number."
          : field === "email" &&
              current.email &&
              !emailPattern.test(current.email)
            ? "Enter a valid email address."
            : field === "consent" && !current.consent
              ? "Please agree before continuing."
              : "";
    setErrors((existing) => ({ ...existing, [field]: problem }));
    return problem;
  }

  function update(field, value) {
    const next = { ...values, [field]: value };
    setValues(next);
    if (errors[field]) validate(field, next);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (busy) return;
    const fields = ["name", "phone", "email", "consent"];
    const nextErrors = Object.fromEntries(
      fields.map((field) => [
        field,
        field === "name" && values.name.trim().length < 2
          ? "Enter at least 2 characters."
          : field === "phone" && !/^[6-9]\d{9}$/.test(values.phone)
            ? "Enter a valid 10-digit Indian mobile number."
            : field === "email" &&
                values.email &&
                !emailPattern.test(values.email)
              ? "Enter a valid email address."
              : field === "consent" && !values.consent
                ? "Please agree before continuing."
                : "",
      ]),
    );
    setErrors(nextErrors);
    const invalid = fields.find((field) => nextErrors[field]);
    if (invalid) {
      document.getElementById(`enquiry-${invalid}`)?.focus();
      return;
    }
    if (values.company) {
      setSubmitted(true);
      onSuccess?.();
      return;
    }

    setBusy(true);
    setFailed(false);
    try {
      await submitEnquiry({
        name: values.name.trim(),
        phone: `+91${values.phone}`,
        email: values.email.trim(),
        loanType: values.loanType,
        loanLabel: loanLabels[values.loanType] || "",
        amount: values.amount.trim(),
        city: values.city.trim(),
        message: values.message.trim(),
        source:
          source ||
          (loanVariant
            ? `/services/${initialLoan || values.loanType}`
            : "home-contact"),
        page: location.pathname,
        submittedAt: new Date().toISOString(),
      });
      setSubmitted(true);
      onSuccess?.();
    } catch {
      setFailed(true);
    } finally {
      setBusy(false);
    }
  }

  const inputClass = (field) =>
    `h-12 w-full rounded-xl border bg-slate-50 px-4 text-base text-brand-navy outline-none transition placeholder:text-slate-400 focus:border-brand-navy focus:ring-[3px] focus:ring-brand-gold/30 ${errors[field] ? "border-red-600" : "border-border"}`;
  const fieldProps = (field) => ({
    onBlur: () => validate(field),
    "aria-invalid": !!errors[field],
    "aria-describedby": errors[field] ? `${field}-error` : undefined,
  });
  const errorText = (field) =>
    errors[field] ? (
      <span
        id={`${field}-error`}
        className="mt-1 block text-xs font-medium text-red-600"
      >
        {errors[field]}
      </span>
    ) : null;
  const labelClass = "mb-1.5 block text-sm font-semibold text-brand-navy";

  if (submitted)
    return (
      <div
        className={`flex h-full min-h-[32rem] flex-col items-center justify-center text-center ${className}`}
      >
        <span className="grid size-16 place-items-center rounded-full bg-brand-gold/15 text-brand-navy">
          <Check size={32} strokeWidth={2.5} />
        </span>
        <h3 className="mt-5 font-bricolage text-2xl font-bold text-brand-navy">
          Thank you, {values.name.trim()}.
        </h3>
        <p className="mt-2 max-w-sm text-brand-navy/70">
          We've received your enquiry. Our team will contact you soon.
        </p>
        <button
          type="button"
          onClick={() => {
            setSubmitted(false);
            setValues((v) => ({
              ...v,
              name: "",
              phone: "",
              email: "",
              city: "",
              amount: "",
              message: "",
              consent: false,
            }));
            setErrors({});
          }}
          className="mt-6 rounded-full px-4 py-2 text-sm font-semibold text-brand-navy underline underline-offset-4 focus-visible:outline-brand-gold"
        >
          Send another enquiry
        </button>
      </div>
    );

  return (
    <form
      noValidate
      onSubmit={handleSubmit}
      className={`relative flex h-full flex-col ${className}`}
    >
      <div
        className="relative mb-6 h-px w-full bg-gradient-to-r from-transparent via-brand-gold/70 to-transparent"
        aria-hidden="true"
      />
      <div className="grid gap-x-4 gap-y-4 sm:grid-cols-2">
        <div>
          <label className={labelClass} htmlFor="enquiry-name">
            Full name <span aria-hidden="true">*</span>
          </label>
          <input
            id="enquiry-name"
            name="name"
            autoComplete="name"
            placeholder="Your full name"
            className={inputClass("name")}
            value={values.name}
            onChange={(e) => update("name", e.target.value)}
            onBlur={() => validate("name")}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "name-error" : undefined}
          />
          {errorText("name")}
        </div>
        <div>
          <label className={labelClass} htmlFor="enquiry-phone">
            Mobile <span aria-hidden="true">*</span>
          </label>
          <div
            className={`flex h-12 overflow-hidden rounded-xl border bg-slate-50 focus-within:border-brand-navy focus-within:ring-[3px] focus-within:ring-brand-gold/30 ${errors.phone ? "border-red-600" : "border-border"}`}
          >
            <span className="inline-flex items-center border-r border-border px-3 text-sm font-semibold text-brand-navy/70">
              +91
            </span>
            <input
              {...fieldProps("phone")}
              id="enquiry-phone"
              name="phone"
              type="tel"
              inputMode="numeric"
              autoComplete="tel-national"
              maxLength={10}
              placeholder="10-digit mobile"
              className="min-w-0 flex-1 bg-transparent px-3 text-base text-brand-navy outline-none placeholder:text-slate-400"
              value={values.phone}
              onChange={(e) =>
                update("phone", e.target.value.replace(/\D/g, "").slice(0, 10))
              }
            />
          </div>
          {errorText("phone")}
        </div>
        <div>
          <label className={labelClass} htmlFor="enquiry-loan">
            Loan type{loanVariant ? "" : " (optional)"}
          </label>
          <select
            id="enquiry-loan"
            name="loanType"
            className={inputClass("loanType")}
            value={values.loanType}
            onChange={(e) => update("loanType", e.target.value)}
          >
            <option value="">Select a loan</option>
            {loanOptions.map((option) => (
              <option key={option.slug} value={option.slug}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass} htmlFor="enquiry-email">
            Email{" "}
            <span className="font-normal text-brand-navy/50">(optional)</span>
          </label>
          <input
            {...fieldProps("email")}
            id="enquiry-email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            className={inputClass("email")}
            value={values.email}
            onChange={(e) => update("email", e.target.value)}
          />
          {errorText("email")}
        </div>
        {loanVariant && (
          <>
            <div>
              <label className={labelClass} htmlFor="enquiry-city">
                City{" "}
                <span className="font-normal text-brand-navy/50">
                  (optional)
                </span>
              </label>
              <input
                id="enquiry-city"
                name="city"
                autoComplete="address-level2"
                placeholder="Your city"
                className={inputClass("city")}
                value={values.city}
                onChange={(e) => update("city", e.target.value)}
              />
            </div>
            <div>
              <label className={labelClass} htmlFor="enquiry-amount">
                Loan amount{" "}
                <span className="font-normal text-brand-navy/50">
                  (optional)
                </span>
              </label>
              <input
                id="enquiry-amount"
                name="amount"
                inputMode="numeric"
                placeholder="e.g. 25,00,000"
                className={inputClass("amount")}
                value={values.amount}
                onChange={(e) => update("amount", e.target.value)}
              />
            </div>
          </>
        )}
        {!loanVariant && (
          <div className="sm:col-span-2">
            <label className={labelClass} htmlFor="enquiry-message">
              Message{" "}
              <span className="font-normal text-brand-navy/50">(optional)</span>
            </label>
            <textarea
              id="enquiry-message"
              name="message"
              rows="3"
              placeholder="Tell us a little about what you need"
              className="w-full resize-y rounded-xl border border-border bg-slate-50 px-4 py-3 text-base text-brand-navy outline-none transition placeholder:text-slate-400 focus:border-brand-navy focus:ring-[3px] focus:ring-brand-gold/30"
              value={values.message}
              onChange={(e) => update("message", e.target.value)}
            />
          </div>
        )}
      </div>
      <div className="mt-5">
        <div className="sr-only" aria-hidden="true">
          <label htmlFor="enquiry-company">Company</label>
          <input
            id="enquiry-company"
            name="company"
            tabIndex={-1}
            autoComplete="off"
            value={values.company}
            onChange={(e) => update("company", e.target.value)}
          />
        </div>
        <label className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-brand-navy/80">
          <input
            type="checkbox"
            name="consent"
            checked={values.consent}
            onChange={(e) => update("consent", e.target.checked)}
            onBlur={() => validate("consent")}
            className="mt-1 size-4 shrink-0 accent-brand-navy"
            aria-invalid={!!errors.consent}
            aria-describedby={errors.consent ? "consent-error" : undefined}
          />{" "}
          <span>I agree to be contacted about my enquiry.</span>
        </label>
        {errorText("consent")}
      </div>
      {failed && (
        <p
          role="alert"
          className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          Something went wrong. Please try again
          {contactInfo.phone ? (
            <>
              {" "}
              or{" "}
              <a
                className="font-semibold underline"
                href={`tel:${contactInfo.phone.replace(/\s/g, "")}`}
              >
                call us
              </a>
            </>
          ) : (
            ""
          )}
          .
        </p>
      )}
      <button
        disabled={busy}
        type="submit"
        className="group mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-brand-navy px-6 text-base font-semibold text-white transition hover:bg-brand-navy-deep focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-gold disabled:cursor-wait disabled:opacity-75"
      >
        {busy ? (
          <>
            Sending{" "}
            <Loader2 size={18} className="animate-spin" aria-hidden="true" />
          </>
        ) : (
          <>
            Send enquiry{" "}
            <ArrowRight
              size={18}
              className="transition-transform group-hover:translate-x-1"
              aria-hidden="true"
            />
          </>
        )}
      </button>
      <p className="mb-0 mt-3 text-center text-xs text-text-secondary">
        Your details are used only to respond to your enquiry.
      </p>
    </form>
  );
}
