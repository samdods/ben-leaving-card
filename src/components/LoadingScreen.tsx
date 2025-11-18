import { useEffect, useState } from "react";
import terminatorImage from "./../assets/terminator-future.png";
import { terminalSounds } from "./../utils/terminalSounds";

interface LoadingScreenProps {
	onLoadingComplete: () => void;
}

const LoadingScreen = ({ onLoadingComplete }: LoadingScreenProps) => {
	const [dots, setDots] = useState(".");
	const [progress, setProgress] = useState(0);

	useEffect(() => {
		// Play startup sound
		terminalSounds.playStartupBeep();

		// Dots animation
		const dotsInterval = setInterval(() => {
			setDots((prev) => (prev.length >= 3 ? "." : prev + "."));
		}, 500);

		// Progress animation with sound effects
		const progressInterval = setInterval(() => {
			setProgress((prev) => {
				if (prev >= 100) {
					return 100;
				}
				// Play tick sound at certain progress points
				if (prev % 20 === 0) {
					terminalSounds.playProgressTick();
				}
				return prev + 2;
			});
		}, 200);

		// Minimum loading time of 10 seconds
		const timer = setTimeout(() => {
			terminalSounds.playSuccessBeep();
			setTimeout(() => {
				onLoadingComplete();
			}, 300); // Small delay after success beep
		}, 10000);

		// Random glitch sounds during loading
		const glitchInterval = setInterval(() => {
			if (Math.random() > 0.7) {
				terminalSounds.playGlitchSound();
			}
		}, 800);

		return () => {
			clearInterval(dotsInterval);
			clearInterval(progressInterval);
			clearInterval(glitchInterval);
			clearTimeout(timer);
		};
	}, []);

	return (
		<div className="fixed inset-0 bg-background flex flex-col items-center justify-center z-50 overflow-hidden">
			{/* Scanline effect */}
			<div className="absolute inset-0 pointer-events-none opacity-10">
				<div className="absolute inset-0 bg-gradient-to-b from-transparent via-terminal to-transparent animate-[scan_8s_linear_infinite]" />
			</div>

			<div className="relative flex flex-col items-center gap-8 px-4">
				{/* Terminator Image with glitch effect */}
				<div className="relative">
					<img
						src={terminatorImage}
						alt="Here's to the future"
						className="w-full max-w-md h-auto glitch-intenseDISABLED rounded-lg shadow-[0_0_40px_rgba(74,222,128,0.3)]"
					/>
					{/* Additional glitch layers for more effect */}
					<img
						src={terminatorImage}
						alt=""
						className="absolute inset-0 w-full max-w-md h-auto opacity-30 mix-blend-screen"
						style={{
							transform: "translate(-2px, 0)",
							filter: "hue-rotate(90deg)",
						}}
					/>
				</div>

				{/* Loading text */}
				<div className="text-center space-y-4">
					<p className="text-terminal text-2xl font-bold glow">
						<span className="text-code-blue">{">"}</span>{" "}
						Initializing farewell protocol{dots}
					</p>

					{/* Terminal-style loading messages */}
					<div className="text-terminal/80 text-sm font-mono space-y-1">
						<p
							className={
								progress > 20 ? "text-terminal" : "text-comment"
							}
						>
							[✓] Loading nostalgia.db
						</p>
						<p
							className={
								progress > 40 ? "text-terminal" : "text-comment"
							}
						>
							[✓] Parsing developer_memories.json
						</p>
						<p
							className={
								progress > 60 ? "text-terminal" : "text-comment"
							}
						>
							[✓] Compiling goodbye_message.tsx
						</p>
						<p
							className={
								progress > 80 ? "text-terminal" : "text-comment"
							}
						>
							[✓] Deprecating human_developer.exe
						</p>
					</div>

					{/* Progress bar */}
					<div className="w-80 max-w-full bg-muted rounded-full h-2 overflow-hidden border border-border">
						<div
							className="h-full bg-gradient-to-r from-terminal via-code-blue to-terminal transition-all duration-300 ease-out shadow-[0_0_10px_currentColor]"
							style={{ width: `${progress}%` }}
						/>
					</div>

					<p className="text-warning text-xs">
						{progress}% //{" "}
						<span className="text-comment">
							Warning: Emotions may be deprecated
						</span>
					</p>
				</div>
			</div>
		</div>
	);
};

export default LoadingScreen;
