import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import MovieCard from "./moviecard/MovieCard";
import { useMoviesList } from "../../hooks/useMovieList";

type Movie = {
  id: number;
  title?: string;
  poster_path?: string;
  vote_average?: number;
  overview?: string;
  genre_ids?: number[];
};

type Props = {
  movies: Movie[];
};

export default function MoviesList({ movies }: Props) {
  const { t } = useTranslation("common");
  const { containerVariants, itemVariants } = useMoviesList();

  return (
    <motion.div
      className="
        grid
        grid-cols-2
        sm:grid-cols-3
        md:grid-cols-4
        lg:grid-cols-5
        xl:grid-cols-6
        gap-5
        px-6
        pb-10
      "
      variants={containerVariants}
      initial="hidden"
      animate="show"
      viewport={{ once: true, amount: 0.2 }}
      aria-label={t("grid_aria")}
    >
      {movies.map((movie) => (
        <motion.div
          key={movie.id}
          variants={itemVariants}
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <MovieCard {...movie} />
        </motion.div>
      ))}
    </motion.div>
  );
}
