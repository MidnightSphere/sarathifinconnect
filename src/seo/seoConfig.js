import { loanServices } from "../data/loan-services-data.js";

export const SEO_ORIGIN = "https://sarathifinconnect.com";
export const SEO_IMAGE = `${SEO_ORIGIN}/og-image.png`;

const siteName = "Sarathi FinConnect";
const limitDescription = (text) => {
  if (text.length <= 160) return text;
  const excerpt = text.slice(0, 157);
  return `${excerpt.slice(0, excerpt.lastIndexOf(" ")).trimEnd()}…`;
};

const staticPages = {
  "/": {
    title: "Sarathi FinConnect | Financial Solutions & Loan Advisory",
    description:
      "Loan consultancy and financial advisory in Bhavnagar, Gujarat. We help you assess needs, prepare applications and coordinate with lenders.",
    schemaType: "WebPage",
  },
  "/about": {
    title: "About Us | Sarathi FinConnect",
    description:
      "Learn about Sarathi FinConnect, our financial advisory approach, leadership and support for individuals and businesses exploring financing options.",
    schemaType: "AboutPage",
  },
  "/support": {
    title: "Support | Sarathi FinConnect",
    description:
      "Contact Sarathi FinConnect in Bhavnagar for loan consultancy and financial guidance. Call, email or visit our office.",
    schemaType: "ContactPage",
  },
  "/services": {
    title: "Our Services | Sarathi FinConnect",
    description:
      "Explore home loans, business finance, loan against property, personal loans and other financing options with guidance from Sarathi FinConnect.",
    schemaType: "CollectionPage",
  },
  "/emi-calculator": {
    title: "EMI Calculator | Sarathi FinConnect",
    description:
      "Estimate monthly loan EMI, total interest and repayment using the Sarathi FinConnect EMI calculator. Results are indicative.",
    schemaType: "WebPage",
  },
};

export function getPageSeo(pathname, service) {
  if (service) {
    return {
      title: `${service.name} | Sarathi FinConnect`,
      description: limitDescription(
        `${service.intro || service.summary} Eligibility and final terms depend on the lender.`,
      ),
      path: `/services/${service.id}`,
      schemaType: "WebPage",
      service,
    };
  }

  const page = staticPages[pathname];
  if (page) return { ...page, path: pathname };

  if (pathname.startsWith("/services/")) {
    return {
      title: `Loan service not found | ${siteName}`,
      description: "This loan service page could not be found. Browse the available services from Sarathi FinConnect.",
      path: pathname,
      noindex: true,
    };
  }

  if (pathname.startsWith("/loans/")) {
    return {
      title: `Page moved | ${siteName}`,
      description: "This loan page has moved to the Sarathi FinConnect services section.",
      path: pathname,
      noindex: true,
    };
  }

  return {
    title: `Page not found | ${siteName}`,
    description: "The requested page could not be found. Explore Sarathi FinConnect services or contact our team.",
    path: pathname,
    noindex: true,
  };
}

function pageSchema({ title, description, path, schemaType }) {
  const url = `${SEO_ORIGIN}${path === "/" ? "/" : path}`;
  return {
    "@context": "https://schema.org",
    "@type": schemaType,
    "@id": `${url}#webpage`,
    url,
    name: title,
    description,
    inLanguage: "en-IN",
    isPartOf: { "@id": `${SEO_ORIGIN}/#website` },
    about: { "@id": `${SEO_ORIGIN}/#organization` },
  };
}

function serviceSchema(service, path) {
  const url = `${SEO_ORIGIN}${path}`;
  const description = service.intro || service.summary;
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${url}#service`,
    name: service.name,
    serviceType: `${service.name} loan consultancy`,
    description,
    url,
    provider: { "@id": `${SEO_ORIGIN}/#organization` },
    areaServed: { "@type": "City", name: "Bhavnagar" },
  };
}

function breadcrumbSchema(service, path) {
  const items = [
    { name: "Home", item: `${SEO_ORIGIN}/` },
    { name: "Services", item: `${SEO_ORIGIN}/services` },
    { name: service.name, item: `${SEO_ORIGIN}${path}` },
  ];
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map(({ name, item }, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name,
      item,
    })),
  };
}

export function getPageSchemas(page) {
  if (page.noindex) return [];
  const schemas = [pageSchema(page)];
  if (page.service) {
    schemas.push(serviceSchema(page.service, page.path));
    schemas.push(breadcrumbSchema(page.service, page.path));
  }
  return schemas;
}

export function getIndexableServiceRoutes() {
  return loanServices.map(({ id }) => `/services/${id}`);
}
