import { useTranslation } from "react-i18next";
import { FiTrendingUp, FiFilm, FiTv, FiCalendar } from "react-icons/fi";
import { useHomePage } from "../hooks/useHomePage";
import MovieCard from "../components/ui/moviecard/MovieCard";
import CarouselSection from "../components/ui/home/CarouselSection";
import "./HomePage.scss";
import HeroSection from "../components/ui/home/heroSection/HeroSection";

const renderItem = (item: any, idx: number) => {
  const isMovie = item.title !== undefined;
  return (
    <MovieCard
      key={item.id}
      id={item.id}
      title={isMovie ? item.title : item.name}
      poster_path={item.poster_path}
      vote_average={item.vote_average}
      overview={item.overview}
      genre_ids={item.genre_ids}
      index={idx}
      mediaType={isMovie ? "movie" : "tv"}
    />
  );
};

export default function HomePage() {
  const { t } = useTranslation("home");
  const { trendingAll, popularMovies, popularTv, upcomingMovies, isLoading } =
    useHomePage();

  const scrollToFirstCarousel = () => {
    document
      .querySelector(".carousel-section")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="home-page">
      <HeroSection onScrollHintClick={scrollToFirstCarousel} />

      <CarouselSection
        title={t("trending")}
        viewAllLink={{
          to: "/movies?trending=day",
          label: t("view_all"),
          icon: <FiTrendingUp />,
        }}
        items={trendingAll}
        loading={isLoading}
        renderItem={renderItem}
      />

      <CarouselSection
        title={t("popular_movies")}
        viewAllLink={{ to: "/movies", label: t("view_all"), icon: <FiFilm /> }}
        items={popularMovies}
        loading={isLoading}
        renderItem={renderItem}
      />

      <CarouselSection
        title={t("popular_tv")}
        viewAllLink={{ to: "/tv", label: t("view_all"), icon: <FiTv /> }}
        items={popularTv}
        loading={isLoading}
        renderItem={renderItem}
      />

      <CarouselSection
        title={t("upcoming")}
        viewAllLink={{
          to: "/movies?upcoming=true",
          label: t("view_all"),
          icon: <FiCalendar />,
        }}
        items={upcomingMovies}
        loading={isLoading}
        renderItem={renderItem}
      />
    </div>
  );
}
