interface Props {
  data: object | object[];
}

/**
 * بيحقن JSON-LD structured data داخل `<script type="application/ld+json">`
 * لدعم Rich Snippets في نتائج بحث جوجل
 *
 * @example
 * <StructuredData data={buildProductStructuredData({...})} />
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
