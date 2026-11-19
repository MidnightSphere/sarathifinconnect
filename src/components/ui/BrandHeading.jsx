export default function BrandHeading({
  as: Tag = "span",
  children,
  highlight,
  className = "",
  highlightClassName = "",
}) {
  const text = String(children);
  const index = highlight ? text.indexOf(highlight) : -1;
  if (index < 0) return <Tag className={className}>{children}</Tag>;

  return (
    <Tag className={className}>
      {text.slice(0, index)}
      <span className={`font-crimson font-semibold italic text-brand-gold ${highlightClassName}`}>
        {text.slice(index, index + highlight.length)}
      </span>
      {text.slice(index + highlight.length)}
    </Tag>
  );
}
