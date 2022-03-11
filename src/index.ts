import { embedAllReferences } from "./embedder";
import { esc } from "./escape";
import { fetchFile } from "./gtihub-api";
import { metadata } from "./metadata";
import { parseHash } from "./url";

function createPreview(indexHtml:string) {
  const div = document.createElement('div');
    div.innerHTML = `<iframe
      width="1100"
      height="600"
      frameBorder="0"
      src="data:text/html;base64,${btoa(indexHtml)}"
    ></iframe>`;
  
    return div;
}

const pathSpec = parseHash(window.location.hash);

fetchFile(pathSpec, 'index.html')
  .then(indexHtml => {
    metadata['index.html'] = indexHtml;
    return embedAllReferences(indexHtml, pathSpec);
  })
  .then(processedIndexHtml => {
    if (metadata['title']) {
      const h1 = document.createElement('h1');
      h1.textContent = metadata['title'];
      document.body.appendChild(h1);
      document.title = 'vw: ' + metadata['title'];
    }
    if (metadata['description']) {
      const title = document.createElement('p');
      title.textContent = metadata['description'];
      document.body.appendChild(title);
    }

    document.body.appendChild(createPreview(processedIndexHtml));

    const div = document.createElement('div');
    div.classList.add('file');
    div.innerHTML = `<label>index.html</label>
      <pre><code class="language-html">${esc(metadata['index.html'])}</code></pre>`
    document.body.appendChild(div);

    for (const scriptName in metadata['text/javascript']) {
      const scriptContent = metadata['text/javascript'][scriptName];
      const div = document.createElement('div');
      div.classList.add('file');
      div.innerHTML = `<label>${scriptName}</label>
        <pre><code class="language-javascript">${scriptContent}</code></pre>`
      document.body.appendChild(div);
    }

    (window as any).hljs.highlightAll();
  })
