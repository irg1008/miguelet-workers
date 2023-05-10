/**
 * Run `wrangler publish src/index.ts --name my-worker` to publish your worker
 * Learn more at https://developers.cloudflare.com/workers/
 */

export interface Env {
	// Example binding to R2. Learn more at https://developers.cloudflare.com/workers/runtime-apis/r2/
	MY_BUCKET: R2Bucket;
}

export default {
	async fetch(
		request: Request,
		env: Env,
		ctx: ExecutionContext
	): Promise<Response> {
		const { method } = request;

		const url = new URL(request.url);
		const key = url.pathname.slice(1);
		const name = decodeURIComponent(key);

		if (method !== "GET")
			return new Response("Method not allowed", {
				status: 405,
				headers: {
					Allow: "GET",
				},
			});

		const bucket = env.MY_BUCKET;

		const file = await bucket.get(name);
		if (!file) return new Response("File not found", { status: 404 });

		const headers = new Headers();
		file.writeHttpMetadata(headers);
		headers.set("Content-Type", "audio/ogg");
		headers.set("etag", file.etag);

		return new Response(file.body, {
			headers,
		});
	},
};
