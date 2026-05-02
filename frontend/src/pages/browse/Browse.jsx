import HeroSection from "../../components/hero-carousel/HeroSection";
import { getAllMangas } from "../../data/api";

import CategorySlider from "../../components/category/CategorySlider";

const Browse = () => {
    const mangaData = getAllMangas();

    return (
        <div className="bg-white h-full min-w-screen text-black">
            
            {/* Banner Section */}
            <HeroSection />

            {/* Content Section */}
            <CategorySlider title="Truyện nổi bật" sortedData={mangaData} />
            <CategorySlider title="Truyện MangaWeb đề xuất" sortedData={mangaData} />
        </div>
    );
}

export default Browse;
