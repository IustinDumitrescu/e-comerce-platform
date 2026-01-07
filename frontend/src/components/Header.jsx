export default function Header({title, metaName, metaContent}) {
    return (
        <>
          <title>{title}</title>
            <meta
                name={metaName}
                content={metaContent}
            />
        </>
    );
}