import { useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";
import { loanServices } from "../data/loan-services-data.js";
import { getPageSchemas, getPageSeo, SEO_IMAGE, SEO_ORIGIN } from "./seoConfig.js";

function setMeta(selector, attributes, content) {
  let element = document.head.querySelector(selector);
  if (!element) {
    element = document.createElement("meta");
    Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, value));
    document.head.append(element);
  }
  element.setAttribute("content", content);
}

export default function SEOHead() {
  const { pathname } = useLocation();
  const service = pathname.startsWith("/services/")
    ? loanServices.find((item) => `/services/${item.id}` === pathname.replace(/\/$/, ""))
    : undefined;
  const page = getPageSeo(pathname.replace(/\/$/, "") || "/", service);
  const schemas = getPageSchemas(page);

  useLayoutEffect(() => {
    document.title = page.title;
    setMeta('meta[name="description"]', { name: "description" }, page.description);
    setMeta(
      'meta[name="robots"]',
      { name: "robots" },
      page.noindex ? "noindex, nofollow" : "index, follow",
    );
    setMeta('meta[property="og:title"]', { property: "og:title" }, page.title);
    setMeta('meta[property="og:description"]', { property: "og:description" }, page.description);
    if (page.noindex) {
      document.head.querySelector('meta[property="og:url"]')?.remove();
    } else {
      setMeta(
        'meta[property="og:url"]',
        { property: "og:url" },
        `${SEO_ORIGIN}${page.path}`,
      );
    }
    setMeta('meta[property="og:image"]', { property: "og:image" }, SEO_IMAGE);
    setMeta('meta[property="og:image:alt"]', { property: "og:image:alt" }, "Sarathi FinConnect");
    setMeta('meta[name="twitter:card"]', { name: "twitter:card" }, "summary_large_image");
    setMeta('meta[name="twitter:title"]', { name: "twitter:title" }, page.title);
    setMeta('meta[name="twitter:description"]', { name: "twitter:description" }, page.description);
    setMeta('meta[name="twitter:image"]', { name: "twitter:image" }, SEO_IMAGE);

    let canonical = document.head.querySelector('link[rel="canonical"]');
    if (page.noindex) {
      canonical?.remove();
    } else {
      if (!canonical) {
        canonical = document.createElement("link");
        canonical.rel = "canonical";
        document.head.append(canonical);
      }
      canonical.href = `${SEO_ORIGIN}${page.path}`;
    }

    let schemaScript = document.getElementById("route-jsonld");
    if (schemas.length > 0) {
      if (!schemaScript) {
        schemaScript = document.createElement("script");
        schemaScript.id = "route-jsonld";
        schemaScript.type = "application/ld+json";
        document.head.append(schemaScript);
      }
      schemaScript.textContent = JSON.stringify(schemas);
    } else {
      schemaScript?.remove();
    }
  }, [page.title, page.description, page.path, page.noindex, schemas]);

  return null;
}
