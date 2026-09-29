import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { Transport } from "@modelcontextprotocol/sdk/shared/transport.js";
import type { JSONRPCMessage } from "@modelcontextprotocol/sdk/types.js";

import { renderLanding } from "./landing";
import {
	convertCurrency,
	convertCurrencySchema,
} from "./tools/convert_currency";
import { getCurrencies, getCurrenciesSchema } from "./tools/get_currencies";
import { getLatestRates, getLatestRatesSchema } from "./tools/get_latest_rates";

function buildServer(): McpServer {
	const server = new McpServer({
		name: "Currency Converter",
		version: "1.0.0",
	});

	server.tool("convert_currency", convertCurrencySchema, async (input) =>
		convertCurrency(input),
	);
	server.tool("get_latest_rates", getLatestRatesSchema, async (input) =>
		getLatestRates(input),
	);
	server.tool("get_currencies", getCurrenciesSchema, async (input) =>
		getCurrencies(input),
	);

	return server;
}

class WorkerTransport implements Transport {
	onmessage?: (message: JSONRPCMessage) => void;
	onclose?: () => void;
	onerror?: (error: Error) => void;

	private resolve!: (message: JSONRPCMessage) => void;
	readonly response = new Promise<JSONRPCMessage>((r) => {
		this.resolve = r;
	});

	async start(): Promise<void> {}
	async close(): Promise<void> {
		this.onclose?.();
	}
	async send(message: JSONRPCMessage): Promise<void> {
		this.resolve(message);
	}
}

async function handleMcp(request: Request): Promise<Response> {
	if (request.method !== "POST") {
		return new Response("Method not allowed", { status: 405 });
	}

	let body: JSONRPCMessage;
	try {
		body = (await request.json()) as JSONRPCMessage;
	} catch {
		return Response.json(
			{
				jsonrpc: "2.0",
				id: null,
				error: { code: -32700, message: "Parse error" },
			},
			{ status: 400 },
		);
	}

	const isNotification = !("id" in body) || body.id === undefined;

	const server = buildServer();
	const transport = new WorkerTransport();
	await server.connect(transport);
	transport.onmessage?.(body);

	if (isNotification) {
		return new Response(null, { status: 202 });
	}

	const message = await transport.response;
	return Response.json(message);
}

export default {
	async fetch(request: Request): Promise<Response> {
		const url = new URL(request.url);

		if (url.pathname === "/mcp") {
			return handleMcp(request);
		}

		if (url.pathname === "/" && request.method === "GET") {
			return new Response(renderLanding(url.origin), {
				headers: { "content-type": "text/html; charset=utf-8" },
			});
		}

		return new Response("Not found", { status: 404 });
	},
};
