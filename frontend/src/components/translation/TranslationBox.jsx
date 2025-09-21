import React, { useState } from "react";
import { Request } from "@/request/request";

const LANG_OPTIONS = [
	{ code: "hi", name: "Hindi" },
	{ code: "bn", name: "Bengali" },
	{ code: "ta", name: "Tamil" },
	{ code: "te", name: "Telugu" },
	{ code: "mr", name: "Marathi" },
	{ code: "gu", name: "Gujarati" },
];

export default function TranslationBox({ text, label = "Translate" }) {
	const [selected, setSelected] = useState("");
	const [translated, setTranslated] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	const onTranslate = async (code) => {
		if (!code) return;
		setSelected(code);
		setLoading(true);
		setError("");
		try {
			const res = await Request.postByUrl("/translate", {
				text,
				target_language: code,
				source_language: "en",
			});
			setTranslated(res?.translated_text || "");
		} catch (e) {
			setError(e?.response?.data?.detail || e?.message || "Translation failed");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="mt-3 inline-flex items-start gap-3">
			<select
				className="bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] px-2 py-1 font-bold"
				value={selected}
				onChange={(e) => onTranslate(e.target.value)}
			>
				<option value="">{label}: Select language</option>
				{LANG_OPTIONS.map((opt) => (
					<option key={opt.code} value={opt.code}>{opt.name}</option>
				))}
			</select>
			<div className="min-w-[200px] max-w-xl">
				{loading && (
					<div className="text-xs font-bold">Translating…</div>
				)}
				{error && (
					<div className="text-xs font-bold text-red-600">{error}</div>
				)}
				{!loading && translated && (
					<div className="bg-yellow-200 border-2 border-black p-2 text-sm font-medium shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
						{translated}
					</div>
				)}
			</div>
		</div>
	);
}


