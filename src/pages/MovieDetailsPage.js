import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import useSWR from "swr";
import MovieCard from "../components/movie/MovieCard";
import { fetcher, tmdbAPI } from "../config";

function MovieDetailsPage() {
    const { movieId } = useParams();
    const { data } = useSWR(tmdbAPI.getMovieDetails(movieId), fetcher);

    useEffect(() => {
        document.title = data?.title || "Simple Movies";
    }, [data?.title]);

    if (!data) return null;

    return (
        <div className="py-10">
            <div className="w-full h-[600px] relative mb-10">
                <div className="absolute inset-0 bg-black bg-opacity-70"></div>
                <div
                    className="w-full h-full bg-cover bg-no-repeat"
                    style={{
                        backgroundImage: `url(${tmdbAPI.ImageOriginal(
                            data?.backdrop_path
                        )})`,
                    }}
                ></div>
            </div>
            <div className="w-full h-[400px] max-w-[800px] mx-auto -mt-[200px] relative z-10 pb-10">
                <img
                    src={`${tmdbAPI.ImageOriginal(data?.poster_path)}`}
                    alt=""
                    className="w-full h-full object-cover rounded-lg"
                />
            </div>
            <h1 className="text-center text-4xl font-bold text-white mb-10">
                {data?.title}
            </h1>
            {data?.genres.length > 0 && (
                <div className="flex items-center justify-center gap-x-5 mb-10">
                    {data?.genres.slice(0, 2).map((item) => (
                        <span
                            key={item.id}
                            className="py-2 px-4 border border-primary text-primary rounded"
                        >
                            {item.name}
                        </span>
                    ))}
                </div>
            )}
            <p className="text-center max-w-[600px] mx-auto leading-relaxed mb-10">
                {data?.overview}
            </p>
            <MovieCredits></MovieCredits>
            <MovieVideos></MovieVideos>
            <MovieSimilar></MovieSimilar>
        </div>
    );
}

export default MovieDetailsPage;

function MovieCredits() {
    const { movieId } = useParams();
    const { data } = useSWR(tmdbAPI.getMovieMeta(movieId, "credits"), fetcher);

    if (!data) return null;
    const { cast } = data;
    if (!cast | (cast.length <= 0)) return null;

    return (
        <div className="py-10">
            <h2 className="text-center text-3xl mb-10">Casts</h2>
            <div className="grid xs:grid-cols-4 grid-cols-2 gap-5">
                {cast.slice(0, 4).map((item) => (
                    <div className="cast-item" key={item.id}>
                        <img
                            src={`${tmdbAPI.ImageOriginal(item?.profile_path)}`}
                            alt=""
                            className="w-full h-[350px] object-cover rounded-lg mb-3"
                        />
                        <h3 className="text-xl font-medium">{item.name}</h3>
                    </div>
                ))}
            </div>
        </div>
    );
}

function MovieVideos() {
    const { movieId } = useParams();
    const { data } = useSWR(tmdbAPI.getMovieMeta(movieId, "videos"), fetcher);

    if (!data) return null;
    const { results } = data;
    if (!results | (results.length <= 0)) return null;

    return (
        <div className="py-10">
            <div className="flex flex-col gap-10">
                {results.slice(0, 2).map((item) => (
                    <div key={item.id}>
                        <h3 className="text-xl font-medium mb-5 p-3 bg-secondary inline-block">
                            {item.name}
                        </h3>
                        <div className="w-full aspect-video">
                            <iframe
                                width="956"
                                height="538"
                                src={`https://www.youtube.com/embed/${item.key}`}
                                title="PUBLIC - Make You Mine (Put Your Hand in Mine) [Official Video]"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                className="w-full h-full object-fill"
                            ></iframe>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function MovieSimilar() {
    const { movieId } = useParams();
    const { data } = useSWR(tmdbAPI.getMovieMeta(movieId, "similar"), fetcher);

    if (!data) return null;
    const { results } = data;
    if (!results | (results.length <= 0)) return null;

    return (
        <div className="py-10">
            <h2 className="text-3xl font-medium mb-10 capitalize">
                Similar movies
            </h2>
            <div className="movie-list">
                <Swiper
                    grabCursor={"true"}
                    spaceBetween={40}
                    slidesPerView={"auto"}
                >
                    {results.length > 0 &&
                        results.map((item) => (
                            <SwiperSlide key={item.id}>
                                <MovieCard item={item}></MovieCard>
                            </SwiperSlide>
                        ))}
                </Swiper>
            </div>
        </div>
    );
}
