import { useParams, Link } from "react-router";
import useFetch from "../../hooks/useFetch";
import { getPage } from "../../api/publicApi";
import { PageLoader } from "../../components/common/Loader";
import usePageTitle from "../../hooks/usePageTitle";

/** About, privacy, FAQ, etc. The text is written in Dashboard -> Pages. */
export default function CmsPage() {
    const { slug } = useParams();
    const { data, loading, error } = useFetch((signal) => getPage(slug, { signal }), [slug]);
    usePageTitle(data?.title);
    if (loading) return <PageLoader />;
    if (error || !data) return (
        <div className="max-w-xl mx-auto px-4 py-20 text-center">
            <h1 className="font-display text-2xl font-semibold text-forest">Page not found</h1>
            <p className="text-sm text-slate mt-2">This page does not exist or is no longer available.</p>
            <Link to="/" className="inline-block mt-5 text-sm text-leaf-dark underline">Back to home</Link>
        </div>);
    return (
        <article className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
            <h1 className="font-display text-3xl sm:text-4xl font-semibold text-forest">{data.title}</h1>
            <div className="rich text-base text-slate leading-relaxed mt-6" dangerouslySetInnerHTML={{ __html: data.content }} />
        </article>
    );
}
