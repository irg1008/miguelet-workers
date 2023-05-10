import { unstable_dev } from "wrangler";
import type { UnstableDevWorker } from "wrangler";
import {
	describe,
	expect,
	it,
	beforeAll,
	afterAll,
	assert,
	afterEach,
} from "vitest";

describe("Worker", () => {
	let worker: UnstableDevWorker;

	beforeAll(async () => {
		worker = await unstable_dev("src/index.ts", {
			experimental: { disableExperimentalWarning: true },
			local: false,
		});
	});

	afterAll(async () => {
		await worker.stop();
	});

	it("should return an audio file", async () => {
		const res = await worker.fetch("300 whatsapp.ogg");
		const type = res.headers.get("content-type");
		const isAudio = type === "audio/ogg";
		assert(isAudio, "Response is not an audio file");
	});

	it("should return 404 when no file", async () => {
		const res = await worker.fetch("no-file.ogg");
		const text = await res.text();
		expect(res.status).toBe(404);
		expect(text).toMatch("File not found");
	});

	it("should support GET method only", async () => {
		const res = await worker.fetch("wrong-method.ogg", {
			method: "POST",
		});
		const text = await res.text();
		expect(res.status).toBe(405);
		expect(text).toMatch("Method not allowed");
	});

	it("should pass a valid file name", async () => {
		const res = await worker.fetch("");
		const text = await res.text();
		expect(res.status).toBe(400);
		expect(text).toMatch("Name cannot be empty");
	});
});
