import { Howl } from "howler";

export class SoundLoader {
	private static CLIPS_MAP: Map<string, Howl> = new Map<string, Howl>();

	static {
		SoundLoader.loadSounds();
	}

	private static loopedCondition(soundPath: string): boolean {
		if (soundPath.includes("_loop")) {
			return true;
		}
		return false;
	}

	public static async loadSounds(): Promise<void> {
		// Require context to get the sound file URLs
		const context = (require as any).context("../assets/sounds", true, /\.(wav|mp3|ogg)$/);

		const soundPromises: Promise<void>[] = context.keys().map((key: string) => {
			return new Promise<void>((resolve, reject) => {
				const soundName = key.replace("./", "");
				const soundUrl = context(key).default || context(key);

				const sound = new Howl({
					src: [soundUrl],
					preload: true,
					onload: () => {
						this.CLIPS_MAP.set(soundName.toLowerCase(), sound);
						resolve();
					},
					onloaderror: (error) => {
						console.error(`Error loading sound: ${error}`);
						reject(error);
					},
				});
			});
		});

		await Promise.all(soundPromises);
	}

	public static async playSound(soundPath: string): Promise<void> {
		const sound = this.CLIPS_MAP.get(soundPath.toLowerCase());
		if (!sound) {
			throw new Error(`Sound not found: ${soundPath}`);
		}

		if (this.loopedCondition(soundPath)) {
			sound.loop(true);
		}
		sound.volume(1);
		sound.play();
	}

	public static async stopSound(soundPath: string): Promise<void> {
		const sound = this.CLIPS_MAP.get(soundPath.toLowerCase());
		if (!sound) {
			throw new Error(`Sound not found: ${soundPath}`);
		}

		sound.stop();
	}
}
