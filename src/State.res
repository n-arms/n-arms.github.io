open Belt
open Webapi.Dom

type button
    = BlogButton
    | MainButton
    | GitHubFooter
    | StalwartFooter
    | BlogPost(string)
    | Error404

type appMsg
    = HeaderHover(button)
    | HeaderUnHover(button)
    | HeaderClick(button)

type post = {title: string, src: string, date: string}
type manifest = {pages: array<post>}

type appState = {
    page: button,
    hover: option<button>,
    loadedPosts: HashMap.String.t<post>,
    manifest: manifest
}

let request = %raw(`
    filePath => {
        const request = new XMLHttpRequest()
        request.open("GET", filePath, false)
        request.send()
        if (request.status == 200) {
            return request.responseText
        }
    }
`)

@scope("JSON") @val
external parseManifest: string => manifest = "parse"

let parseHash: string => button = hash => switch hash {
    | "" => MainButton
    | "#main" => MainButton
    | "#blog" => BlogButton
    | h => 
        if h -> Js.String.length >= 7 {
            BlogPost(h -> Js.String.substringToEnd(~from=6))
        } else {
            Error404
        }
}

let init = () => {
    let page = parseHash(location -> Location.hash)
    let manifest = "./pages/manifest.json"
        -> request
        -> parseManifest
    let loadedPosts = switch page {
        | BlogPost(s) => manifest.pages 
            -> Array.keep(page => page.title == s)
            -> Array.get(0)
            -> Option.map(p => [(Js.String.replaceByRe(%re("/[ ]/g"), "-", p.title), p)])
            -> Option.map(HashMap.String.fromArray)
        | _ => Some(HashMap.String.fromArray([]))
    }
    switch loadedPosts {
        | Some(loadedPosts) => {page, hover: None, loadedPosts, manifest}
        | None => {page: Error404, hover: None, loadedPosts: HashMap.String.fromArray([]), manifest}
    }
}
