import { Mail, MapPin, Phone } from "lucide-react";
import { contactInfo } from "../../data/contact";

export default function ContactMap() {
  const directionsUrl = contactInfo.mapQuery
    ? `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(contactInfo.mapQuery)}`
    : "";
  return (
    <div className="relative isolate h-full min-h-[28rem] overflow-hidden rounded-[2rem] border border-brand-navy/15 bg-brand-navy shadow-[0_1px_2px_rgba(11,31,77,0.06),0_24px_60px_rgba(11,31,77,0.10)] sm:min-h-[30rem] lg:min-h-[34rem]">
      {contactInfo.mapQuery ? (
        <iframe
          src={`https://www.google.com/maps?q=${encodeURIComponent(contactInfo.mapQuery)}&output=embed`}
          title="Sarathi FinConnect office location"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="absolute inset-0 h-full w-full border-0 [filter:saturate(0.9)_contrast(1.02)]"
          allowFullScreen
        />
      ) : (
        <div className="absolute inset-0 grid place-items-center bg-gradient-to-br from-brand-navy via-[#102b62] to-brand-navy-deep text-center text-white">
          <div>
            <MapPin
              size={40}
              className="mx-auto text-brand-gold-light"
              aria-hidden="true"
            />
            <p className="mb-0 mt-3 font-bricolage text-xl font-semibold">
              Location coming soon
            </p>
          </div>
        </div>
      )}
      {contactInfo.mapQuery && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-br from-brand-navy/5 via-transparent to-brand-navy/10"
        />
      )}
      <div className="pointer-events-auto absolute bottom-3 left-3 right-3 rounded-xl border border-white/70 bg-white/85 p-3 shadow-[0_12px_36px_rgba(11,31,77,0.16)] backdrop-blur-md sm:bottom-4 sm:left-4 sm:right-auto sm:max-w-xs sm:p-4">
        <div className="grid gap-1.5 leading-snug text-xs text-brand-navy/80 sm:text-sm">
          {contactInfo.address && (
            <div className="flex gap-1.5">
              <MapPin
                size={14}
                className="mt-0.5 shrink-0 text-brand-gold"
                aria-hidden="true"
              />
              <span>{contactInfo.address}</span>
            </div>
          )}
          {contactInfo.phone && (
            <a
              href={`tel:${contactInfo.phone.replace(/\s/g, "")}`}
              className="flex items-center gap-1.5 text-inherit no-underline hover:text-brand-navy"
            >
              <Phone
                size={14}
                className="shrink-0 text-brand-gold"
                aria-hidden="true"
              />
              <span>{contactInfo.phone}</span>
            </a>
          )}
          {contactInfo.email && (
            <a
              href={`mailto:${contactInfo.email}`}
              className="flex min-w-0 items-center gap-1.5 text-inherit no-underline hover:text-brand-navy"
            >
              <Mail
                size={14}
                className="shrink-0 text-brand-gold"
                aria-hidden="true"
              />
              <span className="break-all">{contactInfo.email}</span>
            </a>
          )}
          {contactInfo.hours && <p className="m-0 hidden sm:block">{contactInfo.hours}</p>}
        </div>
        {directionsUrl && (
          <a
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="relative after:absolute after:-inset-1.5 mt-2 inline-flex min-h-9 items-center rounded-full bg-brand-navy px-4 text-xs font-semibold text-white no-underline transition hover:bg-brand-navy-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-gold sm:text-sm"
          >
            Get directions
          </a>
        )}
      </div>
    </div>
  );
}
