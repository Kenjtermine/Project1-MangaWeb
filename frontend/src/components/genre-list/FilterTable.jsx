import mockData from "../../data/mockData.json";
import { useState } from "react";

const genres = mockData.genres;
const authors = mockData.authors;

const FilterTable = ({onClose}) => {
    const [isSelectedMultiple, setIsSelectedMultiple] = useState([]); // Lưu ID thể loại đã chọn (hoặc tác giả đã chọn)
    const [isSelectedSingle, setIsSelectedSingle] = useState(null); // Lưu ID thể loại hoặc tác giả đã chọn (chỉ 1)

    const toggleSelection = (id) => {
        if (isSelectedMultiple.includes(id)) {
            setIsSelectedMultiple(isSelectedMultiple.filter(selectedId => selectedId !== id));
        } else {
            setIsSelectedMultiple([...isSelectedMultiple, id]);
        }    
    }

    const handleReset = () => {
        setIsSelectedMultiple([]);
        setIsSelectedSingle(null);
    }

    return (
        // ĐÃ XÓA: absolute, top-full, left-0, z-50, shadow-...
        // THÊM VÀO: mt-3 (để cách cái nút ra một chút)
        <div className="w-full mt-3 bg-neutral-900 text-gray-300 rounded-md p-6 border border-sky-500/30">
            
            <h3 className="text-lg font-bold mb-4 text-sky-400">Thể loại</h3>
            <ul className="flex flex-wrap gap-3">
                {genres.map((genre) => (                    
                    <li 
                        key={genre.id} 
                        onClick={() => toggleSelection(genre.id)}
                            // UI UPDATE: Biến nó thành các Thẻ Tag (Pill)
                            className={`px-3 py-1.5 text-sm rounded-full border transition-all duration-200 cursor-pointer select-none
                                ${isSelectedMultiple.includes(genre.id)
                                    ? 'bg-sky-600 border-sky-600 text-white shadow-[0_0_10px_rgba(2,132,199,0.5)]' // Trạng thái Đang chọn
                                    : 'bg-transparent border-neutral-700 hover:border-sky-400 hover:text-white' // Trạng thái Bình thường
                                }`
                            }
                    >
                        {genre.name}
                    </li>
                ))}
            </ul>
            
            <div className="h-px bg-sky-900/30 w-full my-6"></div>

            <h3 className="text-lg font-bold mb-4 text-sky-400">Tác giả</h3>
            <ul className="flex flex-wrap gap-3">
                {authors.map((author) => (
                    <li 
                        key={author.id} 
                        onClick={() => setIsSelectedSingle(author.id)}
                            // UI UPDATE: Biến nó thành các Thẻ Tag (Pill)
                            className={`px-3 py-1.5 text-sm rounded-full border transition-all duration-200 cursor-pointer select-none
                                ${isSelectedSingle === author.id
                                    ? 'bg-sky-600 border-sky-600 text-white shadow-[0_0_10px_rgba(2,132,199,0.5)]' // Trạng thái Đang chọn
                                    : 'bg-transparent border-neutral-700 hover:border-sky-400 hover:text-white' // Trạng thái Bình thường
                                }`
                            }
                    >
                        {author.name}
                    </li>
                ))}
            </ul>

            <div className="h-px bg-sky-900/30 w-full my-6"></div>

            <div className="flex items-center justify-end gap-4">
                <button onClick={handleReset} className="px-4 py-2 rounded bg-gray-700 hover:bg-gray-600 transition text-sm">Đặt lại</button>
                <button className="px-4 py-2 rounded bg-sky-600 hover:bg-sky-700 transition text-sm text-white">Lọc kết quả <i className="fas fa-long-arrow-alt-right"></i></button>
                <button onClick={onClose} className="px-4 py-2 rounded border border-sky-600 bg-neutral-900 hover:bg-neutral-800 transition text-sm text-white">Đóng</button>
            </div>
            
        </div>
    );                          
};

export default FilterTable;