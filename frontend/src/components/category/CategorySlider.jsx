import MangaCard from "../manga/MangaCard";

const CategorySlider = ({ title, sortedData }) => {
  return (
    <div className="mb-10 w-full max-w-6xl mx-auto space-y-6 overflow-hidden">
      <h2 className="text-2xl font-bold mb-4">{title}</h2>

      <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {sortedData.map((item) => (
          <MangaCard key={item.id} manga={item} className="snap-start shrink-0 w-44 md:w-60" />
        ))}
      </div>
    </div>
  );
};

export default CategorySlider;
