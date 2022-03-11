import { PathSpec } from "./types";

export function fetchFile(pathSpec: PathSpec, fileName:string) {
    return fetch(
      `https://api.github.com/repos/${pathSpec.user}/${pathSpec.repo}/contents/${pathSpec.path}/${fileName}`,
      {
        headers: {
          'Accept': 'application/vnd.github.v3+json'
        }
      }
    )
      .then(r => r.json())
      .then(r => atob(r.content))
  }