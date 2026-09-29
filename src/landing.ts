export function renderLanding(origin: string): string {
	const endpoint = `${origin}/mcp`;
	const remoteConfig = JSON.stringify(
		{
			mcpServers: {
				"currency-conversion": {
					command: "npx",
					args: ["mcp-remote", endpoint],
				},
			},
		},
		null,
		2,
	);
	const nativeConfig = JSON.stringify(
		{
			mcpServers: {
				"currency-conversion": {
					url: endpoint,
				},
			},
		},
		null,
		2,
	);

	return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Currency Converter MCP</title>
<style>
	:root {
		color-scheme: light dark;
		--bg: #fafafa;
		--fg: #111;
		--muted: #666;
		--border: #e4e4e4;
		--code-bg: #f3f3f3;
		--accent: #0a6cff;
	}
	@media (prefers-color-scheme: dark) {
		:root {
			--bg: #0e0e10;
			--fg: #f1f1f1;
			--muted: #9a9a9a;
			--border: #2a2a2e;
			--code-bg: #1a1a1d;
			--accent: #6aa9ff;
		}
	}
	* { box-sizing: border-box; }
	body {
		margin: 0;
		font: 16px/1.6 ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif;
		background: var(--bg);
		color: var(--fg);
	}
	main {
		max-width: 760px;
		margin: 0 auto;
		padding: 48px 24px 96px;
	}
	h1 { font-size: 1.9rem; margin: 0 0 8px; }
	h2 { font-size: 1.2rem; margin: 32px 0 8px; }
	h3 { font-size: 1rem; margin: 20px 0 4px; }
	p { margin: 8px 0; }
	.tagline { color: var(--muted); margin-top: 0; }
	code, pre {
		font: 13px/1.5 ui-monospace, "SF Mono", Menlo, Consolas, monospace;
	}
	code { background: var(--code-bg); padding: 1px 6px; border-radius: 4px; }
	pre {
		background: var(--code-bg);
		border: 1px solid var(--border);
		border-radius: 8px;
		padding: 14px 16px;
		overflow-x: auto;
	}
	pre code { background: transparent; padding: 0; }
	a { color: var(--accent); }
	.endpoint {
		display: inline-block;
		font: 14px/1 ui-monospace, "SF Mono", Menlo, Consolas, monospace;
		background: var(--code-bg);
		border: 1px solid var(--border);
		padding: 10px 14px;
		border-radius: 8px;
		margin: 4px 0 12px;
		word-break: break-all;
	}
	ul.tools { list-style: none; padding: 0; }
	ul.tools li {
		border: 1px solid var(--border);
		border-radius: 8px;
		padding: 12px 16px;
		margin-bottom: 10px;
	}
	ul.tools code { font-weight: 600; }
	footer { margin-top: 48px; color: var(--muted); font-size: 0.9rem; }
</style>
</head>
<body>
<main>
	<h1>Currency Converter MCP</h1>
	<p class="tagline">An MCP server for real-time and historical currency conversion, powered by the <a href="https://frankfurter.dev/">Frankfurter API</a>.</p>

	<h2>Endpoint</h2>
	<div class="endpoint">${escapeHtml(endpoint)}</div>
	<p>Streamable HTTP. Send JSON-RPC <code>POST</code> requests.</p>

	<h2>Connect</h2>

	<h3>Native streamable HTTP (Claude Desktop ≥ 0.10, Cursor, etc.)</h3>
<pre><code>${escapeHtml(nativeConfig)}</code></pre>

	<h3>Older clients via <code>mcp-remote</code> proxy</h3>
<pre><code>${escapeHtml(remoteConfig)}</code></pre>

	<h2>Tools</h2>
	<ul class="tools">
		<li>
			<code>convert_currency</code> — convert an amount between two currencies.
			<br><small>params: <code>from</code>, <code>to</code>, <code>amount</code></small>
		</li>
		<li>
			<code>get_latest_rates</code> — latest exchange rates for a base currency.
			<br><small>params: <code>base?</code>, <code>symbols?</code></small>
		</li>
		<li>
			<code>get_currencies</code> — list every supported currency.
		</li>
	</ul>

	<footer>
		<a href="https://github.com/wesbos/mcp-currency">Source on GitHub</a>
	</footer>
</main>
</body>
</html>`;
}

function escapeHtml(s: string): string {
	return s
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#39;");
}
