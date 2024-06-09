const makeHTML = (link) => {
    const encodedLink = encodeURI(link);
    return `<!DOCTYPE html><html lang="en"><head><meta http-equiv="refresh" content="0;url=${encodedLink}"></head><body><script type="text/javascript">window.location.href="${encodedLink}";</script></body></html>`;
}

export default {
    async fetch(request, env) {
        const url = new URL(request.url);
        let html;

        const sanitizeAndMakeHTML = (prefix, protocol) => {
            if (url.pathname.startsWith(prefix)) {
                const targetBase = `${protocol}:`;
                const targetParams = new URLSearchParams(url.search);
                const target = targetBase + encodeURIComponent(url.pathname.replace(prefix, '')) + (targetParams.toString() ? `?${targetParams.toString()}` : '');
                return makeHTML(target);
            }
            return null;
        }

        html = sanitizeAndMakeHTML('/mail/', 'mailto');
        if (!html) html = sanitizeAndMakeHTML('/sms/', 'sms');
        if (!html) html = sanitizeAndMakeHTML('/tel/', 'tel');

        if (!html) {
            return new Response('Not Found', { status: 404 });
        }

        return new Response(html, { headers: { 'Content-Type': 'text/html' } });
    },
}
