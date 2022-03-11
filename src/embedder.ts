import { fetchFile } from "./gtihub-api";
import { metadata } from "./metadata";
import { PathSpec } from "./types";
import { isAbsoluteUrl } from "./url";

function embedResource(el: HTMLElement, mime: string, src: string, pathSpec: PathSpec) {
    const parts = src.split(/\//g);
    const path = parts.slice(0, -1);
    const fileName = parts.slice(-1)[0];

    return fetchFile(
      {
        ...pathSpec,
        path: [pathSpec.path].concat(path).join('/')
      }, 
      fileName
    )
      .then(file => {
        if (!metadata['scripts']) {
            metadata['scripts'] = {}
        }
        if (path.filter(p => p !== '.').length === 0) {
            if (!metadata[mime]) {
                metadata[mime] = {}
            }
            metadata[mime][fileName] = file; 
        }
        el.setAttribute('src', `data:${mime};base64,${btoa(file)}`);
      })
}
  
export function embedAllReferences(htmlText: string, pathSpec: PathSpec) {
    const parser = new DOMParser();
    const htmlDoc = parser.parseFromString(htmlText, 'text/html');
    const promises = [];
    
    const titleEl = htmlDoc.querySelector('title');
    metadata['title'] = titleEl ? titleEl.textContent : '';

    const descriptionMeta = htmlDoc.querySelector('meta[name="description"]');
    metadata['description'] = descriptionMeta ? descriptionMeta.getAttribute('content') : '';

    htmlDoc.querySelectorAll('script').forEach(el => {
      const src = el.getAttribute('src');
      if (src && !isAbsoluteUrl(src)) {
        promises.push(embedResource(el, 'text/javascript', src, pathSpec))
      }
    })
    return Promise.all(promises)
      .then(() => htmlDoc.documentElement.outerHTML)
  }