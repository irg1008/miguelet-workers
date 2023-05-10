export interface Env {
	MY_BUCKET: R2Bucket;
}

export default {
	async fetch(
		request: Request,
		env: Env,
		ctx: ExecutionContext
	): Promise<Response> {
		const { method } = request;

		if (method !== "GET")
			return new Response("Method not allowed", {
				status: 405,
				headers: {
					Allow: "GET",
				},
			});

		const url = new URL(request.url);
		const key = url.pathname.slice(1);
		const name = decodeURIComponent(key);

		if (!name) return new Response("Name cannot be empty", { status: 400 });

		const bucket = env.MY_BUCKET;

		const file = await bucket.get(name);
		if (!file) return new Response("File not found", { status: 404 });

		const headers = new Headers();
		file.writeHttpMetadata(headers);
		headers.set("content-type", "audio/ogg");
		headers.set("etag", file.etag);

		return new Response(file.body, {
			headers,
		});
	},
};
