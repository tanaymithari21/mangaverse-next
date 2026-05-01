
interface GenreFilterProps {
  selected: string;
  onChange: (genre: string) => void;
  options: string[];
}

const GenreFilter = ({ selected, onChange, options }: GenreFilterProps) => (
  <div className="flex flex-wrap gap-2">
    {options.map((genre) => (
      <button
        key={genre}
        onClick={() => onChange(genre)}
        className={`genre-chip ${selected === genre ? "genre-chip-active" : ""}`}
      >
        {genre}
      </button>
    ))}
  </div>
);

export default GenreFilter;
