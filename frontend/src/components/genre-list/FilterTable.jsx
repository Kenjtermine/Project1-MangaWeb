import { useState } from "react";
import { getAuthors, getGenres } from "../../data/api";

const genres = getGenres();
const authors = getAuthors();

const FilterTable = ({ initialFilters = {}, onApply, onClose }) => {
    const [isSelectedMultiple, setIsSelectedMultiple] = useState(initialFilters.genreIds || []); // Lưu ID thể loại đã chọn
    const [isSelectedSingle, setIsSelectedSingle] = useState(initialFilters.authorId || null); // Lưu ID tác giả đã chọn
    const [status, setStatus] = useState(initialFilters.status || "");
    const [sort, setSort] = useState(initialFilters.sort || "latest");

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
        setStatus("");
        setSort("latest");
    }

    const handleApply = () => {
        onApply?.({
            genreIds: isSelectedMultiple,
            authorId: isSelectedSingle,
            status,
            sort,
        });
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

            <h3 className="text-lg font-bold mb-4 text-sky-400">Trạng thái</h3>
            <div className="flex flex-wrap gap-3">
                {[
                    { value: "", label: "Tất cả" },
                    { value: "ongoing", label: "Đang ra" },
                    { value: "completed", label: "Hoàn thành" },
                    { value: "hiatus", label: "Tạm ngưng" },
                ].map((option) => (
                    <button
                        type="button"
                        key={option.value}
                        onClick={() => setStatus(option.value)}
                        className={`px-3 py-1.5 text-sm rounded-full border transition-all duration-200 cursor-pointer select-none
                            ${status === option.value
                                ? 'bg-sky-600 border-sky-600 text-white shadow-[0_0_10px_rgba(2,132,199,0.5)]'
                                : 'bg-transparent border-neutral-700 hover:border-sky-400 hover:text-white'
                            }`
                        }
                    >
                        {option.label}
                    </button>
                ))}
            </div>

            <div className="h-px bg-sky-900/30 w-full my-6"></div>

            <h3 className="text-lg font-bold mb-4 text-sky-400">Sắp xếp</h3>
            <select
                value={sort}
                onChange={(event) => setSort(event.target.value)}
                className="w-full max-w-xs rounded border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-white focus:border-sky-500 focus:outline-none"
            >
                <option value="latest">Mới cập nhật</option>
                <option value="views">Lượt xem cao</option>
                <option value="rating">Đánh giá cao</option>
            </select>

            <div className="h-px bg-sky-900/30 w-full my-6"></div>

            <div className="flex items-center justify-end gap-4">
                <button onClick={handleReset} className="px-4 py-2 rounded bg-gray-700 hover:bg-gray-600 transition text-sm">Đặt lại</button>
                <button onClick={handleApply} className="px-4 py-2 rounded bg-sky-600 hover:bg-sky-700 transition text-sm text-white">Lọc kết quả <i className="fas fa-long-arrow-alt-right"></i></button>
                <button onClick={onClose} className="px-4 py-2 rounded border border-sky-600 bg-neutral-900 hover:bg-neutral-800 transition text-sm text-white">Đóng</button>
            </div>
            
        </div>
    );                          
};

export default FilterTable;
