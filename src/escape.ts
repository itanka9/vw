export function esc(html:string) {
    return html.replace(/</g, '&lt;').replace(/>/g, '&gt;');
}