// src/hooks/useClickOutside.js
import { useEffect, useRef } from "react";

const useClickOutside = (handler) => {
    const domNode = useRef();

    useEffect(() => {
        const maybeHandler = (event) => {
            // Nếu click chuột KHÔNG nằm trong thành phần chứa ref thì chạy hàm handler
            if (domNode.current && !domNode.current.contains(event.target)) {
                handler();
            }
        };

        document.addEventListener("mousedown", maybeHandler);

        return () => {
            document.removeEventListener("mousedown", maybeHandler);
        };
    }, [handler]); // Thêm handler vào dependency array cho chuẩn React

    return domNode;
};

export default useClickOutside;