import {
	AUTO_MODE,
	DARK_MODE,
	DEFAULT_THEME,
	LIGHT_MODE,
} from "@constants/constants.ts";
import { expressiveCodeConfig } from "@/config";
import type { LIGHT_DARK_MODE } from "@/types/config";

export function getDefaultHue(): number {
	const fallback = "250";
	const configCarrier = document.getElementById("config-carrier");
	return Number.parseInt(configCarrier?.dataset.hue || fallback, 10);
}

export function getHue(): number {
	const stored = localStorage.getItem("hue");
	return stored ? Number.parseInt(stored, 10) : getDefaultHue();
}

export function setHue(hue: number): void {
	localStorage.setItem("hue", String(hue));
	const r = document.querySelector(":root") as HTMLElement;
	if (!r) {
		return;
	}
	r.style.setProperty("--hue", String(hue));
}

export function getDefaultBackgroundEnabled(): boolean {
	const configCarrier = document.getElementById("config-carrier");
	return configCarrier?.dataset.bgEnable === '1';
}

export function getBackgroundEnabled(): boolean {
	const stored = localStorage.getItem("bg-enable");
	return stored ? stored === '1' : getDefaultBackgroundEnabled();
}

export function setBackgroundEnabled(enabled: boolean): void {
	localStorage.setItem("bg-enable", enabled ? '1' : '0');
	const r = document.querySelector(":root") as HTMLElement;
	if (!r) return;
	r.style.setProperty("--bg-enable", enabled ? '1' : '0');
    r.dataset.bgEnable = enabled ? '1' : '0';
}

export function getDefaultBackgroundBlur(): number {
	const configCarrier = document.getElementById("config-carrier");
	return Number.parseInt(configCarrier?.dataset.bgBlur || "0", 10);
}

export function getBackgroundBlur(): number {
	const stored = localStorage.getItem("bg-blur");
	return stored ? Number.parseInt(stored, 10) : getDefaultBackgroundBlur();
}

export function setBackgroundBlur(blur: number): void {
	localStorage.setItem("bg-blur", String(blur));
	const r = document.querySelector(":root") as HTMLElement;
	if (!r) return;
    if (isNaN(blur)) {
        r.style.setProperty("--bg-blur", "0px");
    } else {
        r.style.setProperty("--bg-blur", `${blur}px`);
    }
}

export function applyThemeToDocument(theme: LIGHT_DARK_MODE) {
	switch (theme) {
		case LIGHT_MODE:
			document.documentElement.classList.remove("dark");
			break;
		case DARK_MODE:
			document.documentElement.classList.add("dark");
			break;
		case AUTO_MODE:
			if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
				document.documentElement.classList.add("dark");
			} else {
				document.documentElement.classList.remove("dark");
			}
			break;
	}

	// Set the theme for Expressive Code
	document.documentElement.setAttribute(
		"data-theme",
		expressiveCodeConfig.theme,
	);
}

export function setTheme(theme: LIGHT_DARK_MODE): void {
	localStorage.setItem("theme", theme);
	applyThemeToDocument(theme);
}

export function getStoredTheme(): LIGHT_DARK_MODE {
	return (localStorage.getItem("theme") as LIGHT_DARK_MODE) || DEFAULT_THEME;
}
