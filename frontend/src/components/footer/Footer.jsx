
import React from "react";

const Footer = () => {
	return (
		<footer className="bg-gray-800 text-white py-4 mt-8">
			<div className="container mx-auto px-4 text-center">
				&copy; {new Date().getFullYear()} MangaWeb. All rights reserved.
			</div>
		</footer>
	);
}

export default Footer;
