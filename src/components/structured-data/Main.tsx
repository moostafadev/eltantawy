interface Props {
  data: object | object[];
}

/**
 * Renders JSON-LD structured data in an
 * `<script type="application/ld+json">` element to support rich search results.
 *
 * @example
 * <StructuredData data={buildProductStructuredData(product)} />
 */
const StructuredData = ({ data }: Props) => {
  const items = Array.isArray(data) ? data : [data];

  return (
    <>
      {items.map((item, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }}
        />
      ))}
    </>
  );
};

export default StructuredData;
