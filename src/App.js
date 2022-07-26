import { Fragment } from "react";
import { Route, Routes } from "react-router-dom";
import "swiper/scss";
import Banner from "./components/banner/Banner";
import ErrorPage from "./pages/ErrorPage";
import HomePage from "./pages/HomePage";
import Main from "./pages/Main";
import MovieDetailsPage from "./pages/MovieDetailsPage";
import MoviePage from "./pages/MoviePage";

function App() {
    return (
        <Fragment>
            <Routes>
                <Route element={<Main></Main>}>
                    <Route
                        path="/"
                        element={
                            <>
                                <Banner></Banner>
                                <HomePage></HomePage>
                            </>
                        }
                    ></Route>
                    <Route
                        path="/movies"
                        element={<MoviePage></MoviePage>}
                    ></Route>
                    <Route
                        path="/movies/:movieId"
                        element={<MovieDetailsPage></MovieDetailsPage>}
                    ></Route>
                    <Route path="*" element={<ErrorPage></ErrorPage>}></Route>
                </Route>
            </Routes>
        </Fragment>
    );
}

export default App;
