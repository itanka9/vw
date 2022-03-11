import { PathSpec } from "./types";

export function isAbsoluteUrl(url: string) {
    var r = new RegExp('^(?:[a-z]+:)?//', 'i');
    return r.test(url);
}

export function parseHash (locationHash: string): PathSpec {
    const [ user, repo, ...path ] = locationHash.slice(1).split(/\//g);
    return { user, repo, path: path.join('/') };
}