import { useEffect, useState } from "react";
import useSWR from "swr";
import MovieCard, { MovieCardSkeleton } from "../components/movie/MovieCard";
import { fetcher, tmdbAPI } from "../config";
import useDebounce from "../hooks/useDebounce";
import ReactPaginate from "react-paginate";
import { v4 } from "uuid";

const itemsPerPage = 20;

function MoviePage() {
    const [pageCount, setPageCount] = useState(0);
    const [itemOffset, setItemOffset] = useState(0);
    const [nextPage, setNextPage] = useState(1);
    const [filter, setFilter] = useState("");
    const [url, setUrl] = useState(tmdbAPI.getMovieList("popular", nextPage));

    const { data, error } = useSWR(url, fetcher);
    const loading = !data && !error;

    const filterDebounce = useDebounce(filter, 500);
    const handleFilterChange = (e) => {
        setFilter(e.target.value);
    };

    useEffect(() => {
        document.title = "Simple Movies";
    }, []);

    useEffect(() => {
        if (filterDebounce) {
            setUrl(tmdbAPI.getMovieSearch(filterDebounce, nextPage));
        } else {
            setUrl(tmdbAPI.getMovieList("popular", nextPage));
        }
    }, [filterDebounce, nextPage]);

    const movies = data?.results || [];

    useEffect(() => {
        if (!data || !data.total_results) return;
        setPageCount(Math.ceil(data.total_results / itemsPerPage));
    }, [data, itemOffset]);

    const handlePageClick = (event) => {
        const newOffset = (event.selected * itemsPerPage) % data.total_results;
        setItemOffset(newOffset);
        setNextPage(event.selected + 1);
    };

    return (
        <div className="py-10 page-container">
            <div className="flex mb-10">
                <div className="flex-1">
                    <input
                        type="text"
                        className="w-full p-4 bg-slate-800 outline-none text-white"
                        placeholder="Search..."
                        onChange={handleFilterChange}
                    />
                </div>
                <button className="p-4 bg-primary text-white">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                    </svg>
                </button>
            </div>
            {loading && (
                <div className="grid md:grid-cols-4 sm:grid-cols-3 grid-cols-1 gap-10">
                    {new Array(20).fill(0).map(() => (
                        <MovieCardSkeleton key={v4()}></MovieCardSkeleton>
                    ))}
                </div>
            )}
            <div className="grid md:grid-cols-4 sm:grid-cols-3 grid-cols-1 gap-10">
                {movies.length > 0 &&
                    movies.map((item) => (
                        <MovieCard key={item.id} item={item}></MovieCard>
                    ))}
            </div>
            <div className="mt-10">
                <ReactPaginate
                    breakLabel="..."
                    nextLabel=">"
                    onPageChange={handlePageClick}
                    pageRangeDisplayed={3}
                    pageCount={pageCount}
                    previousLabel="<"
                    renderOnZeroPageCount={null}
                    className="pagination"
                />
            </div>
        </div>
    );
}

export default MoviePage;
