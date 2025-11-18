import { useState, useEffect, useRef } from "react";

const MatrixEffect = () => {
	const [isActive, setIsActive] = useState(false);
	const canvasRef = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		// Trigger Matrix effect every 240 seconds
		const triggerInterval = setInterval(() => {
			setIsActive(true);
			setTimeout(() => setIsActive(false), 4000); // Show for 3 seconds
		}, 120000);

		// Show once on mount after 5 seconds
		setTimeout(() => {
			setIsActive(true);
			setTimeout(() => setIsActive(false), 4000);
		}, 50000);

		return () => clearInterval(triggerInterval);
	}, []);

	useEffect(() => {
		if (!isActive || !canvasRef.current) return;

		const canvas = canvasRef.current;
		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		// Set canvas size to full screen
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;

		// Matrix characters - katakana, latin letters, numbers
		const chars =
			"アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲンABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()";
		const fontSize = 16;
		const columns = canvas.width / fontSize;

		// Array to track y position of each column
		const drops: number[] = [];
		for (let i = 0; i < columns; i++) {
			drops[i] = Math.random() * -100; // Start at random positions above screen
		}

		let animationId: number;

		const draw = () => {
			// Semi-transparent black to create fade effect
			ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
			ctx.fillRect(0, 0, canvas.width, canvas.height);

			// Green text
			ctx.fillStyle = "hsl(142, 76%, 36%)"; // Terminal green
			ctx.font = `${fontSize}px monospace`;

			// Draw characters
			for (let i = 0; i < drops.length; i++) {
				const text = chars[Math.floor(Math.random() * chars.length)];
				const x = i * fontSize;
				const y = drops[i] * fontSize;

				ctx.fillText(text, x, y);

				// Reset drop to top randomly
				if (y > canvas.height && Math.random() > 0.975) {
					drops[i] = 0;
				}

				drops[i]++;
			}

			animationId = requestAnimationFrame(draw);
		};

		draw();

		const handleResize = () => {
			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight;
		};

		window.addEventListener("resize", handleResize);

		return () => {
			cancelAnimationFrame(animationId);
			window.removeEventListener("resize", handleResize);
		};
	}, [isActive]);

	if (!isActive) return null;

	return (
		<div className="fixed inset-0 z-[9999] animate-fade-in">
			<canvas ref={canvasRef} className="w-full h-full bg-background" />
			{/* Overlay text */}
			<div className="absolute inset-0 flex items-center justify-center pointer-events-none">
				<div className="text-terminal text-4xl font-bold glow animate-pulse">
					Wake up, Ben...
				</div>
			</div>
		</div>
	);
};

export default MatrixEffect;
